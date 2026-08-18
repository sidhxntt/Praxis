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
      frontend: { framework: "vite", styling: "tailwind-shadcn" },
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
        database: "mongo",
        auth: "clerk",
        deployment: ["vercel", "render"],
        packageManager: "npm",
        installDependencies: false,
        initializeGit: true,
      }),
    ).toMatchObject({
      frontend: { framework: "next" },
      backend: { framework: "express", database: "mongo", auth: "clerk" },
    });
  });
});
