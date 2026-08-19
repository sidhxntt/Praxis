import { describe, expect, it } from "vitest";
import { answersToConfig } from "../../src/workflow/answers";

describe("answersToConfig", () => {
  it("creates frontend configuration without backend fields", () => {
    expect(
      answersToConfig({
        name: "acme",
        projectType: "frontend",
        language: "javascript",
        frontendFramework: "vite",
        frontendUi: { mode: "template", style: "apple" },
        deployment: ["vercel", "docker"],
        packageManager: "pnpm",
        installDependencies: true,
        initializeGit: false,
      }),
    ).toEqual({
      schemaVersion: 1,
      name: "acme",
      projectType: "frontend",
      language: "javascript",
      frontend: {
        framework: "vite",
        styling: "tailwind-shadcn",
        ui: { mode: "template", style: "apple" },
      },
      deployment: ["vercel", "docker"],
      packageManager: "pnpm",
      installDependencies: true,
      initializeGit: false,
    });
  });

  it("creates fullstack configuration with both application sides", () => {
    expect(
      answersToConfig({
        name: "acme",
        projectType: "fullstack",
        language: "typescript",
        frontendFramework: "next",
        frontendUi: { mode: "starter" },
        database: "mongo",
        auth: "clerk",
        cache: "redis",
        deployment: ["vercel", "render"],
        packageManager: "npm",
        installDependencies: false,
        initializeGit: true,
      }),
    ).toMatchObject({
      frontend: { framework: "next", ui: { mode: "starter" } },
      backend: {
        framework: "express",
        database: "mongo",
        auth: "clerk",
        cache: "redis",
      },
    });
  });
});
