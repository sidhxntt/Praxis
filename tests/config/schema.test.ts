import { describe, expect, it } from "vitest";
import { quickConfig, validateConfig } from "../../src/config/schema";

describe("PraxisConfig", () => {
  it("creates deterministic fullstack quick-start defaults", () => {
    expect(quickConfig("acme")).toEqual({
      schemaVersion: 1,
      name: "acme",
      projectType: "fullstack",
      language: "typescript",
      frontend: { framework: "next", styling: "tailwind-shadcn" },
      backend: {
        framework: "express",
        database: "postgres",
        auth: "self-hosted",
        cache: "none",
      },
      deployment: ["vercel", "railway", "docker"],
      packageManager: "npm",
      installDependencies: true,
      initializeGit: true,
    });
  });

  it("rejects project names that escape the destination", () => {
    expect(() => validateConfig({ ...quickConfig("acme"), name: "../acme" }))
      .toThrow("name must be a safe directory name");
  });

  it("requires frontend configuration for frontend projects", () => {
    const config = quickConfig("acme");
    expect(() =>
      validateConfig({ ...config, projectType: "frontend", frontend: undefined }),
    ).toThrow("frontend configuration is required");
  });

  it("rejects backend configuration on frontend-only projects", () => {
    const config = quickConfig("acme");
    expect(() => validateConfig({ ...config, projectType: "frontend" })).toThrow(
      "backend configuration is not allowed",
    );
  });

  it("rejects unknown configuration keys", () => {
    expect(() => validateConfig({ ...quickConfig("acme"), surprise: true })).toThrow(
      'unknown configuration key "surprise"',
    );
  });

  it("rejects unknown nested configuration keys", () => {
    const config = quickConfig("acme") as unknown as Record<string, unknown>;
    config.backend = { ...(config.backend as object), unsafe: true };
    expect(() => validateConfig(config)).toThrow(
      'unknown backend configuration key "unsafe"',
    );
  });

  it("requires a cache choice for backend projects", () => {
    const config = quickConfig("acme") as unknown as Record<string, unknown>;
    const { cache: _cache, ...backend } = config.backend as Record<
      string,
      unknown
    >;
    config.backend = backend;
    expect(() => validateConfig(config)).toThrow("backend cache is unsupported");
  });

  it("rejects unsupported cache providers", () => {
    const config = quickConfig("acme");
    config.backend!.cache = "varnish" as never;
    expect(() => validateConfig(config)).toThrow("backend cache is unsupported");
  });

  it("rejects duplicate deployment targets", () => {
    const config = quickConfig("acme");
    config.deployment = ["docker", "docker"];
    expect(() => validateConfig(config)).toThrow(
      "deployment targets must be unique",
    );
  });
});
