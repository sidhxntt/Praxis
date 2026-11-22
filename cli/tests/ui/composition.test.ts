import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { composeProject } from "../../src/composer/compose";
import { resolveModules } from "../../src/config/resolver";
import { LegacyPraxisConfig, quickConfig } from "../../src/config/schema";
// @ts-expect-error The authoring script is plain ESM without type declarations.
import { parseBrief, stripTypes } from "../../scripts/ui/add-template.mjs";

const roots: string[] = [];

afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true })));
});

async function scaffold(config: LegacyPraxisConfig): Promise<string> {
  const root = await mkdtemp(path.join(os.tmpdir(), "praxis-ui-compose-"));
  roots.push(root);
  const destination = path.join(root, config.name);
  await composeProject(config, resolveModules(config), {
    templatesRoot: path.resolve("templates"),
    destination,
  });
  return destination;
}

describe("selected UI composition", () => {
  it("replaces a frontend-only starter with the hero exactly as written and its brief as DESIGN.md", async () => {
    const config = quickConfig("stillform");
    config.projectType = "frontend";
    config.backend = undefined;
    config.deployment = [];
    config.frontend!.ui = { mode: "template", style: "ora" };

    const destination = await scaffold(config);
    const brief = parseBrief(await readFile(path.resolve("templates/ui.ora/brief.txt"), "utf8"));

    expect(await readFile(path.join(destination, "app/page.tsx"), "utf8"))
      .toContain('import OraCall from "../components/OraCall";');
    expect(await readFile(path.join(destination, "components/OraCall.tsx"), "utf8"))
      .toBe(brief.source);
    expect(await readFile(path.join(destination, "DESIGN.md"), "utf8"))
      .toBe(brief.design);
    expect(await readFile(path.join(destination, "components/ui/button.tsx"), "utf8"))
      .toContain("Button");
  });

  it("gives JavaScript Vite projects the same hero without its types", async () => {
    const config = quickConfig("stillform-js");
    config.projectType = "frontend";
    config.language = "javascript";
    config.backend = undefined;
    config.deployment = [];
    config.frontend = { framework: "vite", styling: "tailwind-shadcn", ui: { mode: "template", style: "sayso" } };

    const destination = await scaffold(config);
    const brief = parseBrief(await readFile(path.resolve("templates/ui.sayso/brief.txt"), "utf8"));

    expect(await readFile(path.join(destination, "src/App.jsx"), "utf8"))
      .toContain('import Sayso from "./components/Sayso";');
    expect(await readFile(path.join(destination, "src/components/Sayso.jsx"), "utf8"))
      .toBe(stripTypes(brief.source, "Sayso.tsx"));
    await expect(readFile(path.join(destination, "src/components/Sayso.tsx"), "utf8")).rejects.toThrow();
  });

  it("places the selected design inside frontend/ for fullstack projects", async () => {
    const config = quickConfig("stillform-stack");
    config.deployment = [];
    config.frontend!.ui = { mode: "template", style: "ora" };

    const destination = await scaffold(config);

    expect(await readFile(path.join(destination, "frontend/DESIGN.md"), "utf8"))
      .toContain("# Ora");
    expect(await readFile(path.join(destination, "frontend/components/OraCall.tsx"), "utf8"))
      .toContain("export default function OraCall");
    await expect(readFile(path.join(destination, "DESIGN.md"), "utf8"))
      .rejects.toThrow();
  });

  it("gives the plain Tailwind and shadcn starter a design foundation", async () => {
    const config = quickConfig("plain-starter");
    config.projectType = "frontend";
    config.backend = undefined;
    config.deployment = [];

    const destination = await scaffold(config);

    expect(await readFile(path.join(destination, "app/page.tsx"), "utf8"))
      .toContain("Built with Praxis Flow");
    expect(await readFile(path.join(destination, "DESIGN.md"), "utf8"))
      .toContain("Styling: Tailwind CSS with shadcn/ui-compatible primitives");
  });
});
