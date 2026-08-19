import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { generateProject } from "../../src/generator/generate";

const roots: string[] = [];
afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true })));
});

describe("Go Gin Pro core", () => {
  it("generates a production backend and Compose-managed PostgreSQL", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "praxis-pro-gin-"));
    roots.push(root);
    const destination = await generateProject({
      schemaVersion: 2,
      name: "payments-api",
      projectType: "pro-backend",
      pro: {
        stack: "go-gin",
        requestedCapabilities: [],
        resolvedCapabilities: [],
      },
      installDependencies: false,
      initializeGit: false,
    }, { cwd: root });

    const goMod = await readFile(path.join(destination, "go.mod"), "utf8");
    expect(goMod).toContain("go 1.26");
    expect(goMod).toContain("github.com/gin-gonic/gin v1.12.0");
    expect(goMod).toContain("github.com/jackc/pgx/v5 v5.9.2");
    expect(goMod).toContain("github.com/go-playground/validator/v10");

    const main = await readFile(path.join(destination, "cmd/api/main.go"), "utf8");
    expect(main).toContain("signal.NotifyContext");
    expect(main).toContain("server.Shutdown");
    expect(main).toContain("slog.NewJSONHandler");

    const router = await readFile(
      path.join(destination, "internal/httpserver/router.go"),
      "utf8",
    );
    expect(router).toContain('health.GET("/live"');
    expect(router).toContain('health.GET("/ready"');
    expect(router).toContain('health.GET("/startup"');

    expect(await readFile(path.join(destination, "sqlc.yaml"), "utf8"))
      .toContain("sql_package: pgx/v5");
    expect(await readFile(path.join(destination, "openapi/openapi.yaml"), "utf8"))
      .toContain("openapi: 3.1.0");

    const compose = await readFile(path.join(destination, "docker-compose.yml"), "utf8");
    expect(compose).toContain("postgres:17-alpine");
    expect(compose).toContain("condition: service_healthy");
    expect(compose).toContain("migrate/migrate");

    const dockerfile = await readFile(path.join(destination, "Dockerfile"), "utf8");
    expect(dockerfile).toContain("golang:1.26-alpine");
    expect(dockerfile).toContain("USER 65532:65532");
  });
});
