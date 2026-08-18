import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import { validateConfig } from "../../src/config/schema";
import { generateProject } from "../../src/generator/generate";

const roots: string[] = [];

afterEach(async () => {
  delete process.env.CACHE_URL;
  process.exitCode = undefined;
  await Promise.all(
    roots.splice(0).map((root) => rm(root, { recursive: true, force: true })),
  );
});

async function generateRedisBackend(): Promise<string> {
  const root = await mkdtemp(path.join(os.tmpdir(), "praxis-lifecycle-"));
  roots.push(root);
  return generateProject(
    validateConfig({
      schemaVersion: 1,
      name: "api",
      projectType: "backend",
      language: "javascript",
      backend: {
        framework: "express",
        database: "none",
        auth: "none",
        cache: "redis",
      },
      deployment: [],
      packageManager: "npm",
      installDependencies: false,
      initializeGit: false,
    }),
    { cwd: root },
  );
}

async function addStubPackage(
  project: string,
  name: string,
  packageJson: Record<string, unknown>,
  files: Record<string, string>,
): Promise<void> {
  const directory = path.join(project, "node_modules", name);
  await mkdir(directory, { recursive: true });
  await writeFile(
    path.join(directory, "package.json"),
    JSON.stringify(packageJson),
  );
  await Promise.all(
    Object.entries(files).map(([file, contents]) =>
      writeFile(path.join(directory, file), contents),
    ),
  );
}

describe.sequential("generated backend lifecycle", () => {
  it("loads .env before constructing the cache client", async () => {
    const project = await generateRedisBackend();
    expect(
      JSON.parse(await readFile(path.join(project, "package.json"), "utf8"))
        .dependencies.dotenv,
    ).toBeDefined();
    await writeFile(
      path.join(project, ".env"),
      "CACHE_URL=redis://custom-cache:6380\n",
    );
    await addStubPackage(
      project,
      "dotenv",
      {
        type: "module",
        exports: { "./config": "./config.js" },
      },
      {
        "config.js": `import { readFileSync } from "node:fs";
const value = readFileSync(new URL("../../.env", import.meta.url), "utf8").trim().split("=")[1];
process.env.CACHE_URL = value;
`,
      },
    );
    await addStubPackage(
      project,
      "redis",
      { type: "module", exports: "./index.js" },
      {
        "index.js": `export function createClient(options) {
globalThis.__praxisCacheUrl = options.url;
return { isOpen: false, on() {}, async connect() { this.isOpen = true; }, async set() {}, async get() { return "ready"; }, async quit() { this.isOpen = false; } };
}
`,
      },
    );
    await addStubPackage(
      project,
      "express",
      { type: "module", exports: "./index.js" },
      {
        "index.js": `function express() {
return { use() {}, get() {}, listen(_port, callback) { callback(); return { close(done) { done(); } }; } };
}
express.json = () => (_request, _response, next) => next();
export default express;
`,
      },
    );

    await import(
      `${pathToFileURL(path.join(project, "src/server.js")).href}?env=${Date.now()}`
    );
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(
      (globalThis as typeof globalThis & { __praxisCacheUrl?: string })
        .__praxisCacheUrl,
    ).toBe("redis://custom-cache:6380");
    process.emit("SIGTERM");
    await new Promise((resolve) => setTimeout(resolve, 0));
    delete (globalThis as typeof globalThis & { __praxisCacheUrl?: string })
      .__praxisCacheUrl;
  });

  it("runs server close and cleanup tasks only once across concurrent shutdowns", async () => {
    const project = await generateRedisBackend();
    const lifecycle = (await import(
      `${pathToFileURL(path.join(project, "src/lib/shutdown.js")).href}?shutdown=${Date.now()}`
    )) as {
      createShutdown: (
        tasks: Array<() => Promise<void>>,
        close: () => Promise<void>,
      ) => () => Promise<void>;
    };
    let closes = 0;
    let cleanups = 0;
    const shutdown = lifecycle.createShutdown(
      [
        async () => {
          cleanups += 1;
        },
      ],
      async () => {
        closes += 1;
      },
    );

    await Promise.all([shutdown(), shutdown(), shutdown()]);

    expect(closes).toBe(1);
    expect(cleanups).toBe(1);
  });

  it("runs registered cleanup when startup fails", async () => {
    const project = await generateRedisBackend();
    await addStubPackage(project, "dotenv", {
      type: "module",
      exports: { "./config": "./config.js" },
    }, { "config.js": "" });
    await addStubPackage(project, "express", { type: "module", exports: "./index.js" }, {
      "index.js": `function express() {
return { use() {}, get() {}, listen() { throw new Error("listen failed"); } };
}
express.json = () => (_request, _response, next) => next();
export default express;
`,
    });
    await addStubPackage(project, "redis", { type: "module", exports: "./index.js" }, {
      "index.js": `export function createClient() {
return { isOpen: false, on() {}, async connect() { this.isOpen = true; }, async set() {}, async get() { return "ready"; }, async quit() { globalThis.__praxisStartupQuits = (globalThis.__praxisStartupQuits ?? 0) + 1; this.isOpen = false; } };
}
`,
    });
    const originalError = console.error;
    console.error = () => undefined;
    try {
      await import(`${pathToFileURL(path.join(project, "src/server.js")).href}?startup=${Date.now()}`);
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect((globalThis as typeof globalThis & { __praxisStartupQuits?: number }).__praxisStartupQuits)
        .toBe(1);
      expect(process.exitCode).toBe(1);
    } finally {
      console.error = originalError;
      delete (globalThis as typeof globalThis & { __praxisStartupQuits?: number }).__praxisStartupQuits;
      process.exitCode = undefined;
    }
  });

  it("disconnects Redis when readiness fails after connecting", async () => {
    const project = await generateRedisBackend();
    await addStubPackage(
      project,
      "redis",
      { type: "module", exports: "./index.js" },
      {
        "index.js": `export function createClient() {
return { isOpen: false, on() {}, async connect() { this.isOpen = true; }, async set() { throw new Error("readiness failed"); }, async get() {}, async quit() { globalThis.__praxisRedisQuits = (globalThis.__praxisRedisQuits ?? 0) + 1; this.isOpen = false; } };
}
`,
      },
    );
    const cache = (await import(
      `${pathToFileURL(path.join(project, "src/lib/cache.js")).href}?rollback=${Date.now()}`
    )) as { connectCache: () => Promise<void> };

    await expect(cache.connectCache()).rejects.toThrow("readiness failed");
    expect(
      (globalThis as typeof globalThis & { __praxisRedisQuits?: number })
        .__praxisRedisQuits,
    ).toBe(1);
    delete (globalThis as typeof globalThis & { __praxisRedisQuits?: number })
      .__praxisRedisQuits;
  });
});
