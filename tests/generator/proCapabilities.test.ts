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
});
