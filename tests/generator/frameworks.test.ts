import { access, mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  FrontendFramework,
  Language,
  validateConfig,
} from "../../src/config/schema";
import { generateProject } from "../../src/generator/generate";

const roots: string[] = [];

afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true })));
});

const targets: Array<{
  framework: FrontendFramework;
  language: Language;
  entry: string;
  build: string;
  primitive: string;
}> = [
  { framework: "next", language: "javascript", entry: "app/page.jsx", build: "next build", primitive: "components/ui/button.jsx" },
  { framework: "next", language: "typescript", entry: "app/page.tsx", build: "next build", primitive: "components/ui/button.tsx" },
  { framework: "vite", language: "javascript", entry: "src/App.jsx", build: "vite build", primitive: "src/components/ui/button.jsx" },
  { framework: "vite", language: "typescript", entry: "src/App.tsx", build: "vite build", primitive: "src/components/ui/button.tsx" },
  { framework: "vue", language: "javascript", entry: "src/App.vue", build: "vite build", primitive: "src/components/ui/Button.vue" },
  { framework: "vue", language: "typescript", entry: "src/App.vue", build: "vue-tsc -b && vite build", primitive: "src/components/ui/Button.vue" },
  { framework: "astro", language: "javascript", entry: "src/pages/index.astro", build: "astro build", primitive: "src/components/ui/Button.astro" },
  { framework: "astro", language: "typescript", entry: "src/pages/index.astro", build: "astro check && astro build", primitive: "src/components/ui/Button.astro" },
  { framework: "angular", language: "typescript", entry: "src/app/app.ts", build: "ng build", primitive: "src/app/components/ui/button.ts" },
];

describe("frontend framework starters", () => {
  it.each(targets)(
    "generates a $language $framework starter",
    async ({ framework, language, entry, build, primitive }) => {
      const root = await mkdtemp(path.join(os.tmpdir(), "praxis-framework-"));
      roots.push(root);
      const config = validateConfig({
        schemaVersion: 1,
        name: `${framework}-${language}`,
        projectType: "frontend",
        language,
        frontend: {
          framework,
          styling: "tailwind-shadcn",
          ui: { mode: "starter" },
        },
        deployment: [],
        packageManager: "npm",
        installDependencies: false,
        initializeGit: false,
      });

      const output = await generateProject(config, { cwd: root });
      const packageJson = JSON.parse(
        await readFile(path.join(output, "package.json"), "utf8"),
      );

      await expect(access(path.join(output, entry))).resolves.toBeUndefined();
      await expect(access(path.join(output, primitive))).resolves.toBeUndefined();
      await expect(access(path.join(output, "DESIGN.md"))).rejects.toThrow();
      expect(packageJson.scripts.build).toBe(build);
      expect(packageJson.devDependencies.tailwindcss).toBe("4.3.3");
    },
  );
});
