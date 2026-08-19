import { access, mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { quickConfig } from "../../src/config/schema";
import { generateProject } from "../../src/generator/generate";

const roots: string[] = [];

afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true })));
});

describe("generateProject", () => {
  it("generates a complete quick-start fullstack workspace", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "praxis-generate-"));
    roots.push(root);
    const config = quickConfig("acme");
    config.installDependencies = false;
    config.initializeGit = false;

    const destination = await generateProject(config, { cwd: root });

    expect(destination).toBe(path.join(root, "acme"));
    expect(
      JSON.parse(await readFile(path.join(destination, "package.json"), "utf8")),
    ).toMatchObject({
      name: "acme",
      private: true,
      workspaces: ["frontend", "backend"],
    });
    expect(
      JSON.parse(
        await readFile(path.join(destination, "frontend/package.json"), "utf8"),
      ),
    ).toMatchObject({ dependencies: { next: expect.any(String) } });
    expect(
      JSON.parse(
        await readFile(path.join(destination, "backend/package.json"), "utf8"),
      ),
    ).toMatchObject({
      dependencies: {
        express: expect.any(String),
        "@prisma/client": expect.any(String),
        bcryptjs: expect.any(String),
      },
    });
    expect(await readFile(path.join(destination, "docker-compose.yml"), "utf8"))
      .toContain("services:");
    expect(await readFile(path.join(destination, "frontend/vercel.json"), "utf8"))
      .toContain("buildCommand");
    expect(await readFile(path.join(destination, "backend/railway.json"), "utf8"))
      .toContain("startCommand");
  });

  it("removes generated output when a post-generation command fails", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "praxis-generate-"));
    roots.push(root);
    const config = quickConfig("acme");
    config.initializeGit = false;

    await expect(
      generateProject(config, {
        cwd: root,
        runCommand: async () => {
          throw new Error("install failed");
        },
      }),
    ).rejects.toThrow("install failed");
    await expect(access(path.join(root, "acme"))).rejects.toThrow();
  });
});
