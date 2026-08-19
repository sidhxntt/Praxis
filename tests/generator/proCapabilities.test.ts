import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { ProCapability, ProStack, resolveProCapabilities } from "../../src/config/pro";
import { generateProject } from "../../src/generator/generate";

const roots: string[] = [];
afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true })));
});

async function generate(stack: ProStack, capabilities: ProCapability[]) {
  const root = await mkdtemp(path.join(os.tmpdir(), "praxis-pro-capability-"));
  roots.push(root);
  return generateProject({
    schemaVersion: 2,
    name: "capability-api",
    projectType: "pro-backend",
    pro: {
      stack,
      requestedCapabilities: capabilities,
      resolvedCapabilities: resolveProCapabilities(capabilities),
    },
    installDependencies: false,
    initializeGit: false,
  }, { cwd: root });
}

describe("Pro capability parity", () => {
  it.each(["python-django", "go-gin"] as const)(
    "wires Redis into the %s runtime and local Compose stack",
    async (stack) => {
      const destination = await generate(stack, ["redis-cache"]);
      const compose = await readFile(path.join(destination, "docker-compose.yml"), "utf8");
      expect(compose).toContain("redis:8.8-alpine");
      expect(compose).toContain('["CMD", "redis-cli", "ping"]');
      expect(compose).toContain("condition: service_healthy");
      expect(await readFile(path.join(destination, ".env.example"), "utf8"))
        .toContain("REDIS_URL=redis://redis:6379/0");

      if (stack === "python-django") {
        expect(await readFile(path.join(destination, "pyproject.toml"), "utf8"))
          .toContain("django-redis==7.0.0");
        expect(await readFile(path.join(destination, "config/settings/base.py"), "utf8"))
          .toContain("django_redis.cache.RedisCache");
      } else {
        expect(await readFile(path.join(destination, "go.mod"), "utf8"))
          .toContain("github.com/redis/go-redis/v9 v9.21.0");
        expect(await readFile(path.join(destination, "internal/cache/redis.go"), "utf8"))
          .toContain("client.Ping");
        expect(await readFile(path.join(destination, "cmd/api/main.go"), "utf8"))
          .toContain("cache.Open");
      }
    },
  );

  it.each(["python-django", "go-gin"] as const)(
    "leaves no Redis artifacts in a minimal %s project",
    async (stack) => {
      const destination = await generate(stack, []);
      const compose = await readFile(path.join(destination, "docker-compose.yml"), "utf8");
      expect(compose).not.toContain("redis:8.8-alpine");
      expect(await readFile(path.join(destination, ".env.example"), "utf8"))
        .not.toContain("REDIS_URL");
    },
  );

  it.each(["python-django", "go-gin"] as const)(
    "wires background workers into the %s runtime and Compose stack",
    async (stack) => {
      const destination = await generate(stack, ["background-jobs"]);
      const compose = await readFile(path.join(destination, "docker-compose.yml"), "utf8");
      expect(compose).toContain("worker:");
      expect(compose).toContain("condition: service_healthy");
      expect(compose).toContain("REDIS_URL: redis://redis:6379/0");

      if (stack === "python-django") {
        expect(await readFile(path.join(destination, "pyproject.toml"), "utf8"))
          .toContain("celery==5.6.3");
        expect(await readFile(path.join(destination, "config/celery.py"), "utf8"))
          .toContain("autodiscover_tasks");
        expect(await readFile(path.join(destination, "core/tasks.py"), "utf8"))
          .toContain("autoretry_for");
      } else {
        expect(await readFile(path.join(destination, "go.mod"), "utf8"))
          .toContain("github.com/hibiken/asynq v0.26.0");
        expect(await readFile(path.join(destination, "cmd/worker/main.go"), "utf8"))
          .toContain("server.Run");
        expect(await readFile(path.join(destination, "internal/jobs/tasks.go"), "utf8"))
          .toContain("MaxRetry");
      }
    },
  );

  it.each(["python-django", "go-gin"] as const)(
    "wires scheduled jobs into the %s runtime and Compose stack",
    async (stack) => {
      const destination = await generate(stack, ["scheduled-jobs"]);
      const compose = await readFile(path.join(destination, "docker-compose.yml"), "utf8");
      expect(compose).toContain("scheduler:");
      expect(compose).toContain("condition: service_healthy");

      if (stack === "python-django") {
        expect(compose).toContain('"beat"');
        expect(await readFile(path.join(destination, "config/settings/base.py"), "utf8"))
          .toContain("CELERY_BEAT_SCHEDULE");
      } else {
        expect(compose).toContain('entrypoint: ["/scheduler"]');
        expect(await readFile(path.join(destination, "cmd/scheduler/main.go"), "utf8"))
          .toContain("scheduler.Register");
      }
    },
  );

  it.each(["python-django", "go-gin"] as const)(
    "wires Sentry into the %s runtime without adding a local service",
    async (stack) => {
      const destination = await generate(stack, ["sentry"]);
      const compose = await readFile(path.join(destination, "docker-compose.yml"), "utf8");
      expect(compose).not.toContain("sentry:");
      expect(await readFile(path.join(destination, ".env.example"), "utf8"))
        .toContain("SENTRY_DSN=");

      if (stack === "python-django") {
        expect(await readFile(path.join(destination, "pyproject.toml"), "utf8"))
          .toContain("sentry-sdk[django]");
        const settings = await readFile(path.join(destination, "config/settings/base.py"), "utf8");
        expect(settings).toContain("send_default_pii=False");
        expect(settings).toContain("traces_sample_rate");
      } else {
        expect(await readFile(path.join(destination, "go.mod"), "utf8"))
          .toContain("github.com/getsentry/sentry-go");
        const main = await readFile(path.join(destination, "cmd/api/main.go"), "utf8");
        expect(main).toContain("sentry.Init");
        expect(main).toContain("sentry.Flush");
      }
    },
  );

  it.each(["python-django", "go-gin"] as const)(
    "wires Prometheus metrics into the %s runtime and local Compose stack",
    async (stack) => {
      const destination = await generate(stack, ["prometheus"]);
      const compose = await readFile(path.join(destination, "docker-compose.yml"), "utf8");
      expect(compose).toContain("prom/prometheus:v3.13.2");
      expect(compose).toContain("prometheus-data:/prometheus");
      expect(compose).toContain("condition: service_healthy");
      expect(compose).toContain("http://localhost:9090/-/ready");
      expect(await readFile(path.join(destination, "ops/prometheus/prometheus.yml"), "utf8"))
        .toContain(stack === "python-django" ? "api:8000" : "api:8080");
      expect(await readFile(path.join(destination, "ops/prometheus/alerts.yml"), "utf8"))
        .toContain("PraxisApiDown");

      if (stack === "python-django") {
        expect(await readFile(path.join(destination, "pyproject.toml"), "utf8"))
          .toContain("django-prometheus==2.5.0");
        expect(await readFile(path.join(destination, "config/settings/base.py"), "utf8"))
          .toContain("django_prometheus.middleware.PrometheusBeforeMiddleware");
        expect(await readFile(path.join(destination, "config/urls.py"), "utf8"))
          .toContain('path("metrics/", include("django_prometheus.urls"))');
      } else {
        expect(await readFile(path.join(destination, "go.mod"), "utf8"))
          .toContain("github.com/prometheus/client_golang v1.24.1");
        expect(await readFile(path.join(destination, "internal/httpserver/router.go"), "utf8"))
          .toContain('router.GET("/metrics", gin.WrapH(promhttp.Handler()))');
      }
    },
  );

  it.each(["python-django", "go-gin"] as const)(
    "leaves no Prometheus artifacts in a minimal %s project",
    async (stack) => {
      const destination = await generate(stack, []);
      const compose = await readFile(path.join(destination, "docker-compose.yml"), "utf8");
      expect(compose).not.toContain("prom/prometheus");
      await expect(readFile(path.join(destination, "ops/prometheus/prometheus.yml"), "utf8"))
        .rejects.toMatchObject({ code: "ENOENT" });
    },
  );

  it.each(["python-django", "go-gin"] as const)(
    "wires OpenTelemetry into the %s runtime and local Collector",
    async (stack) => {
      const destination = await generate(stack, ["opentelemetry"]);
      const compose = await readFile(path.join(destination, "docker-compose.yml"), "utf8");
      expect(compose).toContain("otel/opentelemetry-collector-contrib:0.153.0");
      expect(compose).toContain("OTEL_EXPORTER_OTLP_ENDPOINT: http://otel-collector:4318");
      expect(compose).toContain('test: ["CMD", "/otelcol-contrib", "--version"]');
      const collector = await readFile(path.join(destination, "ops/otel-collector.yml"), "utf8");
      expect(collector).toContain("health_check:");
      expect(collector).toContain("endpoint: 0.0.0.0:13133");

      if (stack === "python-django") {
        const project = await readFile(path.join(destination, "pyproject.toml"), "utf8");
        expect(project).toContain("opentelemetry-sdk==1.44.0");
        expect(project).toContain("opentelemetry-instrumentation-django==0.65b0");
        expect(await readFile(path.join(destination, "core/telemetry.py"), "utf8"))
          .toContain("OTLPSpanExporter");
        expect(await readFile(path.join(destination, "config/asgi.py"), "utf8"))
          .toContain("configure_telemetry");
      } else {
        const goModule = await readFile(path.join(destination, "go.mod"), "utf8");
        expect(goModule).toContain("go.opentelemetry.io/otel v1.42.0");
        expect(goModule).toContain("go.opentelemetry.io/contrib/instrumentation/github.com/gin-gonic/gin/otelgin");
        expect(await readFile(path.join(destination, "internal/telemetry/telemetry.go"), "utf8"))
          .toContain("otlptracehttp.New");
        expect(await readFile(path.join(destination, "internal/httpserver/router.go"), "utf8"))
          .toContain('otelgin.Middleware("capability-api")');
      }
    },
  );

  it.each(["python-django", "go-gin"] as const)(
    "leaves no OpenTelemetry artifacts in a minimal %s project",
    async (stack) => {
      const destination = await generate(stack, []);
      expect(await readFile(path.join(destination, "docker-compose.yml"), "utf8"))
        .not.toContain("otel-collector");
      await expect(readFile(path.join(destination, "ops/otel-collector.yml"), "utf8"))
        .rejects.toMatchObject({ code: "ENOENT" });
    },
  );

  it.each(["python-django", "go-gin"] as const)(
    "wires Nginx into the %s local production topology",
    async (stack) => {
      const destination = await generate(stack, ["nginx"]);
      const compose = await readFile(path.join(destination, "docker-compose.yml"), "utf8");
      expect(compose).toContain("nginx:1.30.3-alpine");
      expect(compose).toContain("./ops/nginx.conf:/etc/nginx/nginx.conf:ro");
      expect(compose).toContain("condition: service_healthy");
      expect(compose).toContain("http://localhost/nginx-health");
      const config = await readFile(path.join(destination, "ops/nginx.conf"), "utf8");
      expect(config).toContain(stack === "python-django" ? "server api:8000" : "server api:8080");
      expect(config).toContain("proxy_set_header X-Request-ID");
      expect(config).toContain("client_max_body_size 2m");
      expect(config).toContain("add_header X-Content-Type-Options nosniff always");
    },
  );

  it.each(["python-django", "go-gin"] as const)(
    "leaves no Nginx artifacts in a minimal %s project",
    async (stack) => {
      const destination = await generate(stack, []);
      expect(await readFile(path.join(destination, "docker-compose.yml"), "utf8"))
        .not.toContain("nginx:");
      await expect(readFile(path.join(destination, "ops/nginx.conf"), "utf8"))
        .rejects.toMatchObject({ code: "ENOENT" });
    },
  );

  it.each(["python-django", "go-gin"] as const)(
    "wires object storage into the %s runtime and local Compose stack",
    async (stack) => {
      const destination = await generate(stack, ["object-storage"]);
      const compose = await readFile(path.join(destination, "docker-compose.yml"), "utf8");
      expect(compose).toContain("minio/minio:RELEASE.2025-09-07T16-13-09Z");
      expect(compose).toContain("minio/mc:RELEASE.2025-08-13T08-35-41Z");
      expect(compose).toContain("minio-data:/data");
      expect(compose).toContain("mc mb --ignore-existing local/praxis");
      expect(compose).toContain("http://localhost:9000/minio/health/live");
      expect(compose).toContain("S3_ENDPOINT: http://minio:9000");
      expect(await readFile(path.join(destination, ".env.example"), "utf8"))
        .toContain("S3_BUCKET=praxis");

      if (stack === "python-django") {
        const project = await readFile(path.join(destination, "pyproject.toml"), "utf8");
        expect(project).toContain("django-storages[s3]==1.14.6");
        expect(project).toContain("boto3==1.43.55");
        expect(await readFile(path.join(destination, "config/settings/base.py"), "utf8"))
          .toContain("storages.backends.s3.S3Storage");
      } else {
        expect(await readFile(path.join(destination, "go.mod"), "utf8"))
          .toContain("github.com/aws/aws-sdk-go-v2/service/s3 v1.106.2");
        expect(await readFile(path.join(destination, "internal/storage/s3.go"), "utf8"))
          .toContain("options.UsePathStyle = true");
      }
    },
  );

  it.each(["python-django", "go-gin"] as const)(
    "leaves no object-storage artifacts in a minimal %s project",
    async (stack) => {
      const destination = await generate(stack, []);
      expect(await readFile(path.join(destination, "docker-compose.yml"), "utf8"))
        .not.toContain("minio/minio");
      expect(await readFile(path.join(destination, ".env.example"), "utf8"))
        .not.toContain("S3_BUCKET");
    },
  );

  it.each(["python-django", "go-gin"] as const)(
    "wires Elasticsearch search into the %s runtime and local Compose stack",
    async (stack) => {
      const destination = await generate(stack, ["search"]);
      const compose = await readFile(path.join(destination, "docker-compose.yml"), "utf8");
      expect(compose).toContain("docker.elastic.co/elasticsearch/elasticsearch:9.5.0");
      expect(compose).toContain("elasticsearch-data:/usr/share/elasticsearch/data");
      expect(compose).toContain("_cluster/health?wait_for_status=yellow");
      expect(compose).toContain("ELASTICSEARCH_URL: http://elasticsearch:9200");
      expect(await readFile(path.join(destination, ".env.example"), "utf8"))
        .toContain("ELASTICSEARCH_URL=http://elasticsearch:9200");

      if (stack === "python-django") {
        expect(await readFile(path.join(destination, "pyproject.toml"), "utf8"))
          .toContain("django-elasticsearch-dsl==9.0");
        expect(await readFile(path.join(destination, "config/settings/base.py"), "utf8"))
          .toContain("ELASTICSEARCH_DSL");
      } else {
        expect(await readFile(path.join(destination, "go.mod"), "utf8"))
          .toContain("github.com/elastic/go-elasticsearch/v9 v9.5.0");
        const adapter = await readFile(path.join(destination, "internal/search/elasticsearch.go"), "utf8");
        expect(adapter).toContain("elasticsearch.NewClient");
        expect(adapter).toContain("client.Ping");
      }
    },
  );

  it.each(["python-django", "go-gin"] as const)(
    "leaves no search artifacts in a minimal %s project",
    async (stack) => {
      const destination = await generate(stack, []);
      expect(await readFile(path.join(destination, "docker-compose.yml"), "utf8"))
        .not.toContain("docker.elastic.co/elasticsearch");
      expect(await readFile(path.join(destination, ".env.example"), "utf8"))
        .not.toContain("ELASTICSEARCH_URL");
    },
  );
});
