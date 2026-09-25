import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { UI_STYLE_IDS } from "../../src/ui/catalog";
import { FrontendFramework, Language, validateConfig } from "../../src/config/schema";
import { generateProject } from "../../src/generator/generate";

export const ADAPTER_TARGETS = [
  target("next-js", "next", "javascript", "app/page.jsx"),
  target("next-ts", "next", "typescript", "app/page.tsx"),
  target("vite-js", "vite", "javascript", "src/App.jsx"),
  target("vite-ts", "vite", "typescript", "src/App.tsx"),
  target("vue-js", "vue", "javascript", "src/App.vue"),
  target("vue-ts", "vue", "typescript", "src/App.vue"),
  target("astro-js", "astro", "javascript", "src/pages/index.astro"),
  target("astro-ts", "astro", "typescript", "src/pages/index.astro"),
  target("angular-ts", "angular", "typescript", "src/app/app.html"),
] as const;

describe("complete generated UI matrix", () => {
  it("defines exactly 360 unique styled outputs and nine starters", () => {
    const styled = UI_STYLE_IDS.flatMap((style) =>
      ADAPTER_TARGETS.map(({ id }) => `${style}:${id}`));
    expect(styled).toHaveLength(360);
    expect(new Set(styled).size).toBe(360);
    expect(ADAPTER_TARGETS).toHaveLength(9);
  });

  it("generates and validates all 369 framework outputs", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "praxis-ui-matrix-"));
    try {
      for (const adapter of ADAPTER_TARGETS) {
        for (const styleId of UI_STYLE_IDS) {
          const name = `styled-${adapter.id}-${styleId}`;
          const output = await generateProject(frontendConfig(
            name,
            adapter.framework,
            adapter.language,
            { mode: "template", style: styleId },
          ), { cwd: root });
          const style = JSON.parse(
            await readFile(path.resolve("templates", `ui.${styleId}`, "style.json"), "utf8"),
          ) as { sourceDesign: string; sections: Array<{ brand?: string }>; assets: Array<{ source: string }> };
          const entry = await readFile(path.join(output, adapter.entry), "utf8");
          expect(entry, `${styleId}:${adapter.id} original brand`)
            .toContain(style.sections.find(({ brand }) => brand)?.brand);
          expect(await readFile(path.join(output, "DESIGN.md"), "utf8"))
            .toContain(style.sourceDesign);
          for (const asset of style.assets) {
            await expect(readFile(path.join(
              output,
              "public/ui",
              styleId,
              asset.source.slice("assets/".length),
            )), `${styleId}:${adapter.id} local asset`).resolves.toBeTruthy();
          }
          expect(await unresolvedTokens(output), `${styleId}:${adapter.id} unresolved tokens`)
            .toEqual([]);
          const packageJson = JSON.parse(await readFile(path.join(output, "package.json"), "utf8"));
          expect(packageJson.scripts.build, `${styleId}:${adapter.id} build script`).toBeTruthy();
          await rm(output, { recursive: true });
        }

        const starterName = `starter-${adapter.id}`;
        const starter = await generateProject(frontendConfig(
          starterName,
          adapter.framework,
          adapter.language,
          { mode: "starter" },
        ), { cwd: root });
        await expect(readFile(path.join(starter, adapter.entry), "utf8")).resolves.toBeTruthy();
        expect(await readFile(path.join(starter, "DESIGN.md"), "utf8"))
          .toContain(`Framework: \`${adapter.framework}\``);
        await expect(readdir(path.join(starter, "public/ui"))).rejects.toThrow();
        await rm(starter, { recursive: true });
      }
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  }, 120_000);
});

function frontendConfig(
  name: string,
  framework: FrontendFramework,
  language: Language,
  ui: { mode: "starter" } | { mode: "template"; style: (typeof UI_STYLE_IDS)[number] },
) {
  return validateConfig({
    schemaVersion: 1,
    name,
    projectType: "frontend",
    language,
    frontend: { framework, styling: "tailwind-shadcn", ui },
    deployment: [],
    packageManager: "npm",
    installDependencies: false,
    initializeGit: false,
  });
}

async function unresolvedTokens(root: string, relative = ""): Promise<string[]> {
  const found: string[] = [];
  for (const entry of await readdir(path.join(root, relative), { withFileTypes: true })) {
    const child = path.join(relative, entry.name);
    if (entry.isDirectory()) found.push(...await unresolvedTokens(root, child));
    else if ((await readFile(path.join(root, child), "utf8")).includes("{{")) found.push(child);
  }
  return found;
}

function target(
  id: string,
  framework: FrontendFramework,
  language: Language,
  entry: string,
) {
  return { id, framework, language, entry };
}
