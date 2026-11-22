import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { UI_STYLE_IDS } from "../../src/ui/catalog";
import { FrontendFramework, Language, validateConfig } from "../../src/config/schema";
import { generateProject } from "../../src/generator/generate";

export const TEMPLATE_TARGETS = [
  target("next-js", "next", "javascript", "app/page.jsx", "components", "jsx"),
  target("next-ts", "next", "typescript", "app/page.tsx", "components", "tsx"),
  target("vite-js", "vite", "javascript", "src/App.jsx", "src/components", "jsx"),
  target("vite-ts", "vite", "typescript", "src/App.tsx", "src/components", "tsx"),
] as const;

const STARTER_TARGETS = [
  ...TEMPLATE_TARGETS,
  target("vue-js", "vue", "javascript", "src/App.vue", "", ""),
  target("vue-ts", "vue", "typescript", "src/App.vue", "", ""),
  target("astro-js", "astro", "javascript", "src/pages/index.astro", "", ""),
  target("astro-ts", "astro", "typescript", "src/pages/index.astro", "", ""),
  target("angular-ts", "angular", "typescript", "src/app/app.html", "", ""),
] as const;

describe("complete generated UI matrix", () => {
  it("defines one styled output per style and React target, plus nine starters", () => {
    const styled = UI_STYLE_IDS.flatMap((style) =>
      TEMPLATE_TARGETS.map(({ id }) => `${style}:${id}`));
    expect(styled).toHaveLength(UI_STYLE_IDS.length * 4);
    expect(new Set(styled).size).toBe(styled.length);
    expect(STARTER_TARGETS).toHaveLength(9);
  });

  it("generates every styled output and every starter", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "praxis-ui-matrix-"));
    try {
      for (const adapter of TEMPLATE_TARGETS) {
        for (const styleId of UI_STYLE_IDS) {
          const name = `styled-${adapter.id}-${styleId}`;
          const output = await generateProject(frontendConfig(
            name,
            adapter.framework,
            adapter.language,
            { mode: "template", style: styleId },
          ), { cwd: root });
          const template = JSON.parse(
            await readFile(path.resolve("templates", `ui.${styleId}`, "template.json"), "utf8"),
          ) as { component: string; images: Array<{ path: string }> };
          const entry = await readFile(path.join(output, adapter.entry), "utf8");
          expect(entry, `${styleId}:${adapter.id} renders its hero`)
            .toContain(`<${template.component} />`);
          const component = await readFile(
            path.join(output, adapter.components, `${template.component}.${adapter.extension}`),
            "utf8",
          );
          expect(component, `${styleId}:${adapter.id} component`)
            .toContain(`export default function ${template.component}`);
          if (adapter.language === "javascript") {
            expect(component, `${styleId}:${adapter.id} has no type syntax`).not.toMatch(/\bimport type\b|\btype [A-Z]\w* = /);
          }
          expect(await readFile(path.join(output, "DESIGN.md"), "utf8"))
            .toMatch(/^# /);
          expect(await unresolvedTokens(output), `${styleId}:${adapter.id} unresolved tokens`)
            .toEqual([]);
          const packageJson = JSON.parse(await readFile(path.join(output, "package.json"), "utf8"));
          expect(packageJson.scripts.build, `${styleId}:${adapter.id} build script`).toBeTruthy();
          await rm(output, { recursive: true });
        }
      }

      for (const adapter of STARTER_TARGETS) {
        const starter = await generateProject(frontendConfig(
          `starter-${adapter.id}`,
          adapter.framework,
          adapter.language,
          { mode: "starter" },
        ), { cwd: root });
        await expect(readFile(path.join(starter, adapter.entry), "utf8")).resolves.toBeTruthy();
        expect(await readFile(path.join(starter, "DESIGN.md"), "utf8"))
          .toContain(`Framework: \`${adapter.framework}\``);
        await expect(readdir(path.join(starter, "public/design"))).rejects.toThrow();
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
    else if (!/\.(webp|png|jpe?g|gif|avif|ico|woff2?)$/i.test(entry.name)
      && /\{\{[A-Za-z]+\}\}/.test(await readFile(path.join(root, child), "utf8"))) found.push(child);
  }
  return found;
}

function target(
  id: string,
  framework: FrontendFramework,
  language: Language,
  entry: string,
  components: string,
  extension: string,
) {
  return { id, framework, language, entry, components, extension };
}
