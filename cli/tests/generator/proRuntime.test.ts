import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { ProStack, proCapabilities, resolveProCapabilities } from "../../src/config/pro";
import { generateProject } from "../../src/generator/generate";

const roots: string[] = [];
afterEach(async () => Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true }))));

async function minimal(stack: ProStack) {
  const root = await mkdtemp(path.join(os.tmpdir(), "praxis-pro-runtime-"));
  roots.push(root);
  return generateProject({
    schemaVersion: 2, name: "runtime-api", projectType: "pro-backend",
    pro: { stack, requestedCapabilities: [], resolvedCapabilities: [] },
    installDependencies: false, initializeGit: false,
  }, { cwd: root });
}

describe("Praxis Pro core runtime contract", () => {
  it("composes Django realtime and telemetry startup without corrupting identifiers", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "praxis-pro-runtime-"));
    roots.push(root);
    const destination = await generateProject({
      schemaVersion: 2, name: "runtime-api", projectType: "pro-backend",
      pro: {
        stack: "python-django",
        requestedCapabilities: [...proCapabilities],
        resolvedCapabilities: resolveProCapabilities([...proCapabilities]),
        cloud: "aws",
      },
      installDependencies: false, initializeGit: false,
    }, { cwd: root });
    const asgi = await readFile(path.join(destination, "config/asgi.py"), "utf8");
    expect(asgi).toContain("configure_telemetry()\ndjango_application = get_asgi_application()");
    expect(asgi).toContain('"http": django_application');
    expect(asgi).not.toContain("django_configure_telemetry");
    const ci = await readFile(path.join(destination, ".github/workflows/ci.yml"), "utf8");
    expect(ci).toContain("JWT_SIGNING_KEY: ci-only-jwt-signing-key-at-least-32-bytes");
  });
  it.each(["python-django", "go-gin"] as const)("includes production evidence and resilience primitives for %s", async (stack) => {
    const destination = await minimal(stack);
    const ci = await readFile(path.join(destination, ".github/workflows/ci.yml"), "utf8");
    for (const gate of ["gitleaks", "trivy", "checkov", "syft"]) expect(ci.toLowerCase()).toContain(gate);
    const operations = await readFile(path.join(destination, "docs/operations.md"), "utf8");
    for (const topic of ["backup", "restore", "rollback", "secret rotation", "disaster recovery", "production-readiness"]) {
      expect(operations.toLowerCase()).toContain(topic);
    }
    if (stack === "python-django") {
      expect(await readFile(path.join(destination, "core/idempotency.py"), "utf8")).toContain("IdempotencyKey");
      expect(await readFile(path.join(destination, "core/locks.py"), "utf8")).toContain("DistributedLock");
      expect(await readFile(path.join(destination, "config/settings/base.py"), "utf8")).toContain("DjangoFilterBackend");
      const middleware = await readFile(path.join(destination, "core/middleware.py"), "utf8");
      expect(middleware).toContain("security.auth_failure");
      expect(middleware).not.toContain("request.body");
    } else {
      expect(await readFile(path.join(destination, "internal/idempotency/idempotency.go"), "utf8")).toContain("type Store interface");
      expect(await readFile(path.join(destination, "internal/locks/locks.go"), "utf8")).toContain("type DistributedLock interface");
      const middleware = await readFile(path.join(destination, "internal/httpserver/middleware.go"), "utf8");
      expect(middleware).toContain("security.auth_failure");
      expect(middleware).not.toContain("Request.Body");
    }
  });
});
