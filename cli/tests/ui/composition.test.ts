import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { composeProject } from "../../src/composer/compose";
import { resolveModules } from "../../src/config/resolver";
import { LegacyPraxisConfig, quickConfig } from "../../src/config/schema";

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
  it("replaces a frontend-only starter with native landing code and root DESIGN.md", async () => {
    const config = quickConfig("stillform");
    config.projectType = "frontend";
    config.backend = undefined;
    config.deployment = [];
    config.frontend!.ui = { mode: "template", style: "apple" };

    const destination = await scaffold(config);

    expect(await readFile(path.join(destination, "app/page.tsx"), "utf8"))
      .toContain("Stillform");
    expect(await readFile(path.join(destination, "DESIGN.md"), "utf8"))
      .toContain("DESIGN-apple.md");
    expect(await readFile(
      path.join(destination, "public/ui/apple/stillform-stage.svg"),
      "utf8",
    )).toContain("Stillform product composition");
  });

  it("places the selected design inside frontend/ for fullstack projects", async () => {
    const config = quickConfig("stillform-stack");
    config.deployment = [];
    config.frontend!.ui = { mode: "template", style: "apple" };

    const destination = await scaffold(config);

    expect(await readFile(path.join(destination, "frontend/DESIGN.md"), "utf8"))
      .toContain("DESIGN-apple.md");
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
