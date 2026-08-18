import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { rm } from "node:fs/promises";
import { quickConfig } from "../../src/config/schema";
import { composeProject } from "../../src/composer/compose";

const temporaryDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map((directory) =>
      rm(directory, { recursive: true, force: true }),
    ),
  );
});

async function fixtureRoot(): Promise<string> {
  const root = await mkdtemp(path.join(os.tmpdir(), "praxis-compose-"));
  temporaryDirectories.push(root);
  return root;
}

async function addModule(
  root: string,
  id: string,
  manifest: Record<string, unknown>,
  files: Record<string, string> = {},
): Promise<void> {
  const directory = path.join(root, "templates", id);
  await mkdir(path.join(directory, "files", "common"), { recursive: true });
  await writeFile(
    path.join(directory, "manifest.json"),
    JSON.stringify({ id, ...manifest }),
  );
  for (const [name, content] of Object.entries(files)) {
    const destination = path.join(directory, "files", "common", name);
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, content);
  }
}

describe("composeProject", () => {
  it("copies overlays, replaces tokens, and merges package metadata", async () => {
    const root = await fixtureRoot();
    await addModule(
      root,
      "frontend.next",
      {
        overlays: [{ scope: "frontend", source: "files/common" }],
        packages: [
          {
            scope: "frontend",
            dependencies: { next: "15.1.7" },
            scripts: { dev: "next dev" },
          },
        ],
        env: [{ scope: "frontend", keys: ["NEXT_PUBLIC_APP_URL"] }],
      },
      {
        "README.md": "# {{projectName}}",
        "command.txt": "{{packageManager}} run dev",
        "package.json": JSON.stringify({ private: true }),
      },
    );

    const config = quickConfig("acme");
    config.deployment = [];
    const destination = path.join(root, "output", "acme");
    await composeProject(config, ["frontend.next"], {
      templatesRoot: path.join(root, "templates"),
      destination,
    });

    expect(await readFile(path.join(destination, "frontend/README.md"), "utf8"))
      .toBe("# acme");
    expect(await readFile(path.join(destination, "frontend/command.txt"), "utf8"))
      .toBe("npm run dev");
    expect(
      JSON.parse(
        await readFile(path.join(destination, "frontend/package.json"), "utf8"),
      ),
    ).toMatchObject({
      private: true,
      dependencies: { next: "15.1.7" },
      scripts: { dev: "next dev" },
    });
    expect(
      await readFile(path.join(destination, "frontend/.env.example"), "utf8"),
    ).toBe("NEXT_PUBLIC_APP_URL=\n");
  });

  it("removes staging output when two modules write conflicting files", async () => {
    const root = await fixtureRoot();
    await addModule(
      root,
      "first",
      { overlays: [{ scope: "root", source: "files/common" }] },
      { "shared.txt": "first" },
    );
    await addModule(
      root,
      "second",
      { overlays: [{ scope: "root", source: "files/common" }] },
      { "shared.txt": "second" },
    );
    const destination = path.join(root, "output", "acme");

    await expect(
      composeProject(quickConfig("acme"), ["first", "second"], {
        templatesRoot: path.join(root, "templates"),
        destination,
      }),
    ).rejects.toThrow('file conflict at "shared.txt"');
    await expect(readFile(destination)).rejects.toThrow();
  });

  it("applies ordered manifest patches", async () => {
    const root = await fixtureRoot();
    await addModule(
      root,
      "base",
      { overlays: [{ scope: "root", source: "files/common" }] },
      { "src/app.ts": "// modules\nexport const modules = [];\n" },
    );
    await addModule(root, "feature", {
      patches: [
        {
          scope: "root",
          file: "src/app.ts",
          find: "// modules",
          replace: '// modules\nimport "./feature";',
        },
      ],
    });
    const destination = path.join(root, "output", "acme");

    await composeProject(quickConfig("acme"), ["base", "feature"], {
      templatesRoot: path.join(root, "templates"),
      destination,
    });

    expect(await readFile(path.join(destination, "src/app.ts"), "utf8")).toBe(
      '// modules\nimport "./feature";\nexport const modules = [];\n',
    );
  });

  it("filters overlays by project type", async () => {
    const root = await fixtureRoot();
    await addModule(
      root,
      "deployment",
      {
        overlays: [
          { scope: "root", source: "files/common", projectType: "fullstack" },
        ],
      },
      { "compose.yml": "fullstack" },
    );
    const config = quickConfig("acme");
    config.projectType = "frontend";
    config.backend = undefined;
    config.deployment = [];
    const destination = path.join(root, "output", "acme");

    await composeProject(config, ["deployment"], {
      templatesRoot: path.join(root, "templates"),
      destination,
    });

    await expect(readFile(path.join(destination, "compose.yml"))).rejects.toThrow();
  });

  it("filters cache-specific overlays, patches, packages, and environment", async () => {
    const root = await fixtureRoot();
    await addModule(
      root,
      "base",
      { overlays: [{ scope: "backend", source: "files/common" }] },
      { "src/server.ts": "// cache\n" },
    );
    await addModule(
      root,
      "cache",
      {
        overlays: [
          { scope: "backend", source: "files/common", cache: "redis" },
        ],
        patches: [
          {
            scope: "backend",
            file: "src/server.ts",
            find: "// cache",
            replace: "// cache\n// redis enabled",
            cache: "redis",
          },
        ],
        packages: [
          { scope: "backend", dependencies: { redis: "6.2.1" }, cache: "redis" },
          { scope: "backend", dependencies: { memjs: "1.3.2" }, cache: "memcached" },
        ],
        env: [
          { scope: "backend", keys: ["REDIS_ONLY"], cache: "redis" },
          { scope: "backend", keys: ["MEMCACHED_ONLY"], cache: "memcached" },
        ],
      },
      { "src/lib/cache.ts": "export const cache = 'redis';\n" },
    );
    const config = quickConfig("acme");
    config.backend!.cache = "memcached";
    config.deployment = [];
    const destination = path.join(root, "output", "acme");

    await composeProject(config, ["base", "cache"], {
      templatesRoot: path.join(root, "templates"),
      destination,
    });

    await expect(readFile(path.join(destination, "backend/src/lib/cache.ts"))).rejects.toThrow();
    expect(await readFile(path.join(destination, "backend/src/server.ts"), "utf8"))
      .toBe("// cache\n");
    const packageJson = JSON.parse(
      await readFile(path.join(destination, "backend/package.json"), "utf8"),
    );
    expect(packageJson.dependencies).toEqual({ memjs: "1.3.2" });
    expect(await readFile(path.join(destination, "backend/.env.example"), "utf8"))
      .toBe("MEMCACHED_ONLY=\n");
  });

  it("rejects manifest paths outside their allowed directories", async () => {
    const root = await fixtureRoot();
    await addModule(root, "unsafe", {
      overlays: [{ scope: "root", source: "../../outside" }],
    });

    await expect(
      composeProject(quickConfig("acme"), ["unsafe"], {
        templatesRoot: path.join(root, "templates"),
        destination: path.join(root, "output", "acme"),
      }),
    ).rejects.toThrow("overlay source escapes its allowed directory");
  });

  it("rejects module identifiers containing path traversal", async () => {
    const root = await fixtureRoot();
    await expect(
      composeProject(quickConfig("acme"), ["../unsafe"], {
        templatesRoot: path.join(root, "templates"),
        destination: path.join(root, "output", "acme"),
      }),
    ).rejects.toThrow('invalid module id "../unsafe"');
  });
});
