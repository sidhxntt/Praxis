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
});
