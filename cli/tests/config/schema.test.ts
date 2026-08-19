import { describe, expect, it } from "vitest";
import { quickConfig, validateConfig } from "../../src/config/schema";

describe("PraxisConfig", () => {
  it("creates deterministic fullstack quick-start defaults", () => {
    expect(quickConfig("acme")).toEqual({
      schemaVersion: 1,
      name: "acme",
      projectType: "fullstack",
      language: "typescript",
      frontend: {
        framework: "next",
        styling: "tailwind-shadcn",
        ui: { mode: "starter" },
      },
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

  it.each(["next", "vite", "vue", "astro"] as const)(
    "accepts JavaScript and TypeScript UI templates for %s",
    (framework) => {
      for (const language of ["javascript", "typescript"] as const) {
        const config = quickConfig("acme");
        config.language = language;
        config.frontend = {
          framework,
          styling: "tailwind-shadcn",
          ui: { mode: "template", style: "apple" },
        };
        expect(validateConfig(config).frontend?.ui).toEqual({
          mode: "template",
          style: "apple",
        });
      }
    },
  );

  it("accepts Angular templates in TypeScript projects", () => {
    const config = quickConfig("acme");
    config.frontend = {
      framework: "angular",
      styling: "tailwind-shadcn",
      ui: { mode: "template", style: "apple" },
    };
    expect(validateConfig(config).frontend?.framework).toBe("angular");
  });

  it("rejects Angular templates in JavaScript projects with guidance", () => {
    const config = quickConfig("acme");
    config.language = "javascript";
    config.frontend = {
      framework: "angular",
      styling: "tailwind-shadcn",
      ui: { mode: "starter" },
    };
    expect(() => validateConfig(config)).toThrow(
      "Angular templates require TypeScript",
    );
  });

  it("rejects unknown template style IDs", () => {
    const config = quickConfig("acme");
    config.frontend!.ui = { mode: "template", style: "unknown" as never };
    expect(() => validateConfig(config)).toThrow("frontend UI style is unsupported");
  });

  it("rejects a style on starter UI configuration", () => {
    const config = quickConfig("acme") as unknown as Record<string, unknown>;
    config.frontend = {
      framework: "next",
      styling: "tailwind-shadcn",
      ui: { mode: "starter", style: "apple" },
    };
    expect(() => validateConfig(config)).toThrow(
      'unknown starter UI configuration key "style"',
    );
  });
});
