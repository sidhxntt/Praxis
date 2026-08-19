import { execFile } from "node:child_process";
import { access, mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { afterEach, describe, expect, it } from "vitest";
import { UI_STYLE_IDS } from "../../src/ui/catalog";

const run = promisify(execFile);
const roots: string[] = [];

afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true })));
});

describe("UI framework adapters", () => {
  it("renders all 40 styles across the complete nine-target matrix", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "praxis-adapters-all-"));
    roots.push(root);
    await run(process.execPath, [
      path.resolve("scripts/ui/generate.mjs"),
      "--templates-root",
      path.resolve("templates"),
      "--output",
      root,
    ]);

    for (const id of UI_STYLE_IDS) {
      const filesRoot = path.join(root, `ui.${id}`, "files");
      await expect(access(path.join(filesRoot, "next-js/app/page.jsx"))).resolves.toBeUndefined();
      await expect(access(path.join(filesRoot, "next-ts/app/page.tsx"))).resolves.toBeUndefined();
      await expect(access(path.join(filesRoot, "vite-js/src/App.jsx"))).resolves.toBeUndefined();
      await expect(access(path.join(filesRoot, "vite-ts/src/App.tsx"))).resolves.toBeUndefined();
      await expect(access(path.join(filesRoot, "vue-js/src/App.vue"))).resolves.toBeUndefined();
      await expect(access(path.join(filesRoot, "vue-ts/src/App.vue"))).resolves.toBeUndefined();
      await expect(access(path.join(filesRoot, "astro-js/src/pages/index.astro"))).resolves.toBeUndefined();
      await expect(access(path.join(filesRoot, "astro-ts/src/pages/index.astro"))).resolves.toBeUndefined();
      await expect(access(path.join(filesRoot, "angular-ts/src/app/app.ts"))).resolves.toBeUndefined();
      expect(await readFile(path.join(filesRoot, "shared/DESIGN.md"), "utf8"))
        .toContain(`DESIGN-${id}.md`);
    }
  });

  it("renders the Apple pilot into nine native deterministic targets", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "praxis-adapters-"));
    roots.push(root);
    await run(process.execPath, [
      path.resolve("scripts/ui/generate.mjs"),
      "--style",
      "apple",
      "--templates-root",
      path.resolve("templates"),
      "--output",
      root,
    ]);

    const filesRoot = path.join(root, "ui.apple", "files");
    expect((await readdir(filesRoot)).sort()).toEqual([
      "angular-ts",
      "astro-js",
      "astro-ts",
      "next-js",
      "next-ts",
      "shared",
      "vite-js",
      "vite-ts",
      "vue-js",
      "vue-ts",
    ]);
    expect(await readFile(path.join(filesRoot, "next-ts/app/page.tsx"), "utf8"))
      .toContain("export default function Home");
    expect(await readFile(path.join(filesRoot, "vite-js/src/App.jsx"), "utf8"))
      .toContain("export default function App");
    expect(await readFile(path.join(filesRoot, "vue-ts/src/App.vue"), "utf8"))
      .toContain('<script setup lang="ts">');
    expect(await readFile(path.join(filesRoot, "astro-ts/src/pages/index.astro"), "utf8"))
      .toContain("---");
    expect(await readFile(path.join(filesRoot, "angular-ts/src/app/app.ts"), "utf8"))
      .toContain("@Component");
    expect(await readFile(path.join(filesRoot, "shared/DESIGN.md"), "utf8"))
      .toContain("Apple-Inspired Landing Page Design");
  });

  it("renders semantic sections, local assets, and reduced motion CSS", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "praxis-adapters-"));
    roots.push(root);
    await run(process.execPath, [
      path.resolve("scripts/ui/generate.mjs"),
      "--style",
      "apple",
      "--templates-root",
      path.resolve("templates"),
      "--output",
      root,
    ]);

    const filesRoot = path.join(root, "ui.apple", "files");
    const page = await readFile(path.join(filesRoot, "next-ts/app/page.tsx"), "utf8");
    const css = await readFile(path.join(filesRoot, "next-ts/app/globals.css"), "utf8");
    expect(page).toContain('<a className="skip-link" href="#main">Skip to content</a>');
    expect(page).toContain('id="principles"');
    expect(page).toContain('src="/ui/apple/stillform-stage.svg"');
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
    expect(css).toContain("--ui-accent: #0066cc");
    await expect(
      readFile(path.join(filesRoot, "shared/public/ui/apple/stillform-stage.svg"), "utf8"),
    ).resolves.toContain("Stillform product composition");
  });

  it("produces identical bytes across repeated generation", async () => {
    const first = await mkdtemp(path.join(os.tmpdir(), "praxis-adapters-a-"));
    const second = await mkdtemp(path.join(os.tmpdir(), "praxis-adapters-b-"));
    roots.push(first, second);
    const args = [
      "--style",
      "apple",
      "--templates-root",
      path.resolve("templates"),
    ];
    await run(process.execPath, [path.resolve("scripts/ui/generate.mjs"), ...args, "--output", first]);
    await run(process.execPath, [path.resolve("scripts/ui/generate.mjs"), ...args, "--output", second]);

    expect(await snapshot(path.join(first, "ui.apple"))).toEqual(
      await snapshot(path.join(second, "ui.apple")),
    );
  });
});

async function snapshot(root: string, relative = ""): Promise<Record<string, string>> {
  const result: Record<string, string> = {};
  for (const entry of (await readdir(path.join(root, relative), { withFileTypes: true }))
    .sort((a, b) => a.name.localeCompare(b.name))) {
    const child = path.join(relative, entry.name);
    if (entry.isDirectory()) Object.assign(result, await snapshot(root, child));
    else result[child] = await readFile(path.join(root, child), "utf8");
  }
  return result;
}
