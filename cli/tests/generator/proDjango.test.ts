import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { generateProject } from "../../src/generator/generate";

const roots: string[] = [];
afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true })));
});

describe("Django Pro core", () => {
  it("generates a production backend and Compose-managed PostgreSQL", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "praxis-pro-django-"));
    roots.push(root);
    const destination = await generateProject({
      schemaVersion: 2,
      name: "payments-api",
      projectType: "pro-backend",
      pro: {
        stack: "python-django",
        requestedCapabilities: [],
        resolvedCapabilities: [],
      },
      installDependencies: false,
      initializeGit: false,
    }, { cwd: root });

    const pyproject = await readFile(path.join(destination, "pyproject.toml"), "utf8");
    expect(pyproject).toContain('django==6.0.7');
    expect(pyproject).toContain('djangorestframework==3.17.1');
    expect(pyproject).toContain('psycopg[binary,pool]==3.3.4');
    expect(pyproject).toContain('drf-spectacular==0.30.0');

    const production = await readFile(
      path.join(destination, "config/settings/production.py"),
      "utf8",
    );
    expect(production).toContain("DEBUG = False");
    expect(production).toContain("SECURE_SSL_REDIRECT");
    expect(production).toContain("CONN_HEALTH_CHECKS");

    const urls = await readFile(path.join(destination, "config/urls.py"), "utf8");
    const coreUrls = await readFile(path.join(destination, "core/urls.py"), "utf8");
    expect(coreUrls).toContain("health/live");
    expect(coreUrls).toContain("health/ready");
    expect(coreUrls).toContain("health/startup");
    expect(urls).toContain("SpectacularAPIView");

    const compose = await readFile(
      path.join(destination, "docker-compose.yml"),
      "utf8",
    );
    expect(compose).toContain("postgres:17-alpine");
    expect(compose).toContain("condition: service_healthy");
    expect(compose).toContain("pg_isready");

    const dockerfile = await readFile(path.join(destination, "Dockerfile"), "utf8");
    expect(dockerfile).toContain("USER app");
    expect(dockerfile).toContain("gunicorn");

    expect(await readFile(path.join(destination, ".env.example"), "utf8"))
      .toContain("DJANGO_SECRET_KEY=");
    expect(await readFile(path.join(destination, ".github/workflows/ci.yml"), "utf8"))
      .toContain("manage.py check --deploy");
    expect(await readFile(path.join(destination, "tests/test_health.py"), "utf8"))
      .toContain('reverse("health-live")');
  });
});
