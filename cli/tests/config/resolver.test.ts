import { describe, expect, it } from "vitest";
import { quickConfig } from "../../src/config/schema";
import { resolveModules } from "../../src/config/resolver";

describe("resolveModules", () => {
  it("expands a fullstack configuration in deterministic order", () => {
    expect(resolveModules(quickConfig("acme"))).toEqual([
      "base.workspace",
      "frontend.next",
      "styling.tailwind-shadcn",
      "backend.express",
      "database.postgres",
      "auth.self-hosted",
      "deployment.vercel",
      "deployment.railway",
      "deployment.docker",
    ]);
  });

  it("requires a database for self-hosted authentication", () => {
    const config = quickConfig("acme");
    config.backend!.database = "none";
    expect(() => resolveModules(config)).toThrow(
      "self-hosted authentication requires a database",
    );
  });

  it("rejects backend hosting for frontend-only projects", () => {
    const config = quickConfig("acme");
    config.projectType = "frontend";
    config.backend = undefined;
    config.deployment = ["railway"];
    expect(() => resolveModules(config)).toThrow(
      "railway requires a backend project",
    );
  });

  it("rejects Vercel for backend-only projects", () => {
    const config = quickConfig("acme");
    config.projectType = "backend";
    config.frontend = undefined;
    config.deployment = ["vercel"];
    expect(() => resolveModules(config)).toThrow(
      "vercel requires a frontend project",
    );
  });

  it.each([
    ["redis", "cache.redis"],
    ["memcached", "cache.memcached"],
  ] as const)("appends the %s cache module after auth", (cache, moduleId) => {
    const config = quickConfig("acme");
    config.backend!.cache = cache;
    const modules = resolveModules(config);

    expect(modules.indexOf(moduleId)).toBe(
      modules.indexOf("auth.self-hosted") + 1,
    );
  });

  it("does not append a cache module when cache is none", () => {
    expect(resolveModules(quickConfig("acme"))).not.toContain("cache.none");
  });

  it("appends the selected UI module after the frontend starter modules", () => {
    const config = quickConfig("acme");
    config.frontend!.ui = { mode: "template", style: "apple" };

    const modules = resolveModules(config);

    expect(modules.slice(0, 4)).toEqual([
      "base.workspace",
      "frontend.next",
      "styling.tailwind-shadcn",
      "ui.apple",
    ]);
  });

  it("does not append a UI module in starter mode", () => {
    expect(resolveModules(quickConfig("acme")).some((id) => id.startsWith("ui.")))
      .toBe(false);
  });

  it("resolves Pro modules in core, adapter, capability, and infrastructure order", () => {
    expect(resolveModules({
      schemaVersion: 2,
      name: "acme-api",
      projectType: "pro-backend",
      pro: {
        stack: "go-gin",
        requestedCapabilities: ["realtime", "terraform"],
        resolvedCapabilities: [
          "redis-cache",
          "realtime",
          "kubernetes",
          "terraform",
          "autoscaling",
          "high-availability",
          "edge-protection",
          "database-resilience",
          "cloud-secrets",
        ],
        cloud: "gcp",
      },
      installDependencies: false,
      initializeGit: false,
    })).toEqual([
      "pro.core",
      "pro.gin",
      "pro.capability.redis-cache",
      "pro.capability.realtime",
      "pro.capability.autoscaling",
      "pro.capability.high-availability",
      "pro.capability.edge-protection",
      "pro.capability.database-resilience",
      "pro.capability.cloud-secrets",
      "pro.compose",
      "pro.kubernetes",
      "pro.terraform.shared",
      "pro.terraform.gcp",
    ]);
  });
});
