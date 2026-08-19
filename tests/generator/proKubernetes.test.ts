import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { ProCapability, ProStack, resolveProCapabilities } from "../../src/config/pro";
import { generateProject } from "../../src/generator/generate";

const roots: string[] = [];
afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true })));
});

async function generate(stack: ProStack, requested: ProCapability[]) {
  const root = await mkdtemp(path.join(os.tmpdir(), "praxis-pro-kubernetes-"));
  roots.push(root);
  const resolved = resolveProCapabilities(requested);
  return generateProject({
    schemaVersion: 2,
    name: "platform-api",
    projectType: "pro-backend",
    pro: { stack, requestedCapabilities: requested, resolvedCapabilities: resolved },
    installDependencies: false,
    initializeGit: false,
  }, { cwd: root });
}

describe("Praxis Pro Kubernetes output", () => {
  it.each(["python-django", "go-gin"] as const)(
    "injects external SMTP configuration into the %s email worker",
    async (stack) => {
      const destination = await generate(stack, ["kubernetes", "email-tasks"]);
      const worker = await readFile(path.join(destination, "k8s/base/worker.yaml"), "utf8");
      expect(worker).toContain("name: SMTP_HOST");
      expect(worker).toContain("key: smtp-host");
      expect(worker).toContain("name: SMTP_PASSWORD");
      expect(worker).toContain("key: smtp-password");
    },
  );
  it.each(["python-django", "go-gin"] as const)(
    "emits an opt-in suspended seed job for %s",
    async (stack) => {
      const destination = await generate(stack, ["kubernetes", "seed-data"]);
      const seed = await readFile(path.join(destination, "k8s/tools/seed-job.yaml"), "utf8");
      expect(seed).toContain("kind: Job");
      expect(seed).toContain("suspend: true");
      expect(seed).toContain(stack === "python-django" ? "manage.py" : "/seed");
      const base = await readFile(path.join(destination, "k8s/base/kustomization.yaml"), "utf8");
      expect(base).not.toContain("tools/seed-job.yaml");
    },
  );
  it("adds a hardened cluster log forwarder when ELK is selected", async () => {
    const destination = await generate("go-gin", ["kubernetes", "elk"]);
    const forwarder = await readFile(path.join(destination, "k8s/base/log-forwarder.yaml"), "utf8");
    expect(forwarder).toContain("kind: DaemonSet");
    expect(forwarder).toContain("fluent/fluent-bit:4.2.2");
    expect(forwarder).toContain("readOnlyRootFilesystem: true");
    expect(forwarder).toContain("key: elastic-log-host");
    expect(await readFile(path.join(destination, "k8s/base/kustomization.yaml"), "utf8"))
      .toContain("log-forwarder.yaml");
  });
  it("adds a Blackbox Exporter workload for synthetic monitoring", async () => {
    const destination = await generate("go-gin", ["kubernetes", "synthetic-monitoring"]);
    const blackbox = await readFile(path.join(destination, "k8s/base/blackbox-exporter.yaml"), "utf8");
    expect(blackbox).toContain("prom/blackbox-exporter:v0.28.0");
    expect(blackbox).toContain("readOnlyRootFilesystem: true");
    expect(await readFile(path.join(destination, "k8s/base/kustomization.yaml"), "utf8"))
      .toContain("blackbox-exporter.yaml");
  });
  it.each(["python-django", "go-gin"] as const)(
    "generates a secure, stack-aware %s application workload",
    async (stack) => {
      const destination = await generate(stack, ["kubernetes"]);
      const deployment = await readFile(path.join(destination, "k8s/base/deployment.yaml"), "utf8");
      const service = await readFile(path.join(destination, "k8s/base/service.yaml"), "utf8");
      const network = await readFile(path.join(destination, "k8s/base/network-policy.yaml"), "utf8");
      const kustomization = await readFile(path.join(destination, "k8s/base/kustomization.yaml"), "utf8");
      const postgres = await readFile(path.join(destination, "k8s/base/postgres.yaml"), "utf8");

      expect(deployment).toContain("serviceAccountName: platform-api");
      expect(deployment).toContain("runAsNonRoot: true");
      expect(deployment).toContain("readOnlyRootFilesystem: true");
      expect(deployment).toContain("secretKeyRef:");
      expect(deployment).toContain("startupProbe:");
      expect(deployment).toContain("readinessProbe:");
      expect(deployment).toContain("livenessProbe:");
      expect(deployment).toContain("resources:");
      expect(deployment).toContain("maxUnavailable: 0");
      expect(deployment).toContain(stack === "python-django" ? "containerPort: 8000" : "containerPort: 8080");
      expect(deployment).toContain(stack === "python-django" ? "python manage.py migrate" : "migrate/migrate:v4.18.3");
      expect(service).toContain(stack === "python-django" ? "targetPort: 8000" : "targetPort: 8080");
      expect(network).toContain("policyTypes:");
      expect(kustomization).toContain("namespace.yaml");
      expect(kustomization).toContain("postgres.yaml");
      expect(kustomization).not.toContain("secret.example.yaml");
      expect(postgres).toContain("postgres:17-alpine");
      expect(postgres).toContain("volumeClaimTemplates:");
      expect(postgres).toContain("pg_isready");
      const operations = await readFile(path.join(destination, "k8s/README.md"), "utf8");
      expect(operations).toContain("praxis-secrets");
      expect(operations).toContain("kubectl kustomize");
      expect(operations).toContain("External Secrets Operator");
      if (stack === "go-gin") {
        expect(kustomization).toContain("migrations/000001_core.up.sql");
        expect(await readFile(path.join(destination, "k8s/base/migrations/000001_core.up.sql"), "utf8"))
          .toContain("CREATE TABLE service_metadata");
      }
    },
  );

  it("adds capability-conditioned workloads and reliability controls", async () => {
    const destination = await generate("go-gin", [
      "background-jobs",
      "scheduled-jobs",
      "prometheus",
      "opentelemetry",
      "nginx",
      "autoscaling",
      "high-availability",
      "cloud-secrets",
      "kubernetes",
    ]);
    const names = await readdir(path.join(destination, "k8s/base"));
    expect(names).toEqual(expect.arrayContaining([
      "worker.yaml",
      "scheduler.yaml",
      "redis.yaml",
      "prometheus.yaml",
      "otel-collector.yaml",
      "nginx.yaml",
      "hpa.yaml",
      "pdb.yaml",
      "external-secret.yaml",
    ]));
    const deployment = await readFile(path.join(destination, "k8s/base/deployment.yaml"), "utf8");
    expect(deployment).toContain("replicas: 3");
    expect(deployment).toContain("topologySpreadConstraints:");
    expect(deployment).toContain("podAntiAffinity:");
    const hpa = await readFile(path.join(destination, "k8s/base/hpa.yaml"), "utf8");
    expect(hpa).toContain("apiVersion: autoscaling/v2");
    expect(hpa).toContain("minReplicas: 3");
    const pdb = await readFile(path.join(destination, "k8s/base/pdb.yaml"), "utf8");
    expect(pdb).toContain("minAvailable: 2");
    const worker = await readFile(path.join(destination, "k8s/base/worker.yaml"), "utf8");
    expect(worker).toContain("image: praxis-api");
    expect(worker).toContain('command: ["/worker"]');
    const scheduler = await readFile(path.join(destination, "k8s/base/scheduler.yaml"), "utf8");
    expect(scheduler).toContain("image: praxis-api");
    expect(scheduler).toContain('command: ["/scheduler"]');
  });

  it("omits Kubernetes and unselected capability workloads", async () => {
    const withoutKubernetes = await generate("python-django", []);
    await expect(readdir(path.join(withoutKubernetes, "k8s")))
      .rejects.toMatchObject({ code: "ENOENT" });

    const minimal = await generate("python-django", ["kubernetes"]);
    const names = await readdir(path.join(minimal, "k8s/base"));
    expect(names).not.toEqual(expect.arrayContaining([
      "worker.yaml",
      "redis.yaml",
      "prometheus.yaml",
      "hpa.yaml",
      "pdb.yaml",
      "external-secret.yaml",
    ]));
  });

  it("mirrors selected stateful Compose services into Kubernetes", async () => {
    const destination = await generate("python-django", [
      "object-storage",
      "search",
      "kubernetes",
    ]);
    const names = await readdir(path.join(destination, "k8s/base"));
    expect(names).toEqual(expect.arrayContaining(["minio.yaml", "elasticsearch.yaml"]));
    expect(await readFile(path.join(destination, "k8s/base/minio.yaml"), "utf8"))
      .toContain("minio/minio:RELEASE.2025-09-07T16-13-09Z");
    const elasticsearch = await readFile(path.join(destination, "k8s/base/elasticsearch.yaml"), "utf8");
    expect(elasticsearch).toContain("docker.elastic.co/elasticsearch/elasticsearch:9.5.0");
    expect(elasticsearch).toContain('path: "/_cluster/health?wait_for_status=yellow"');
    const config = await readFile(path.join(destination, "k8s/base/configmap.yaml"), "utf8");
    expect(config).toContain("S3_ENDPOINT: http://minio:9000");
    expect(config).toContain("ELASTICSEARCH_URL: http://elasticsearch:9200");
    const deployment = await readFile(path.join(destination, "k8s/base/deployment.yaml"), "utf8");
    expect(deployment.slice(deployment.indexOf("- name: api"))).toContain("- name: S3_ACCESS_KEY");
  });
});
