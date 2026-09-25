import { execFile } from "node:child_process";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { describe, expect, it } from "vitest";
import { UI_STYLE_IDS } from "../src/ui/catalog";
import packageJson from "../package.json";

const run = promisify(execFile);

describe("published package contents", () => {
  it("targets the public npm registry", () => {
    expect(packageJson.name).toBe("praxiflow");
    expect(packageJson.publishConfig.registry).toBe("https://registry.npmjs.org");
    expect(packageJson.publishConfig.access).toBe("public");
    expect(packageJson.repository.url).toBe("git+https://github.com/sidhxntt/Praxis.git");
    expect(packageJson.bin.praxiflow).toBe("dist/index.js");
  });

  it("ships every runtime UI artifact and excludes authoring/test sources", async () => {
    const { stdout } = await run("npm", [
      "pack",
      "--dry-run",
      "--json",
      "--cache",
      path.join(os.tmpdir(), "praxis-ui-npm-cache"),
    ], { cwd: path.resolve("."), maxBuffer: 20 * 1024 * 1024 });
    const report = JSON.parse(stdout) as Array<{ files: Array<{ path: string }> }>;
    const files = report[0].files.map(({ path: file }) => file);

    for (const id of UI_STYLE_IDS) {
      expect(files, `${id} manifest`).toContain(`templates/ui.${id}/manifest.json`);
      expect(files, `${id} design guide`).toContain(`templates/ui.${id}/files/shared/DESIGN.md`);
      expect(files.some((file) => file.startsWith(`templates/ui.${id}/files/next-ts/`)), id)
        .toBe(true);
      expect(files.some((file) => file.startsWith(`templates/ui.${id}/files/angular-ts/`)), id)
        .toBe(true);
    }
    expect(files).toContain("templates/ui.catalog/catalog.json");
    expect(files).toContain("README.md");
    expect(files).toContain("LICENSE.txt");
    expect(files).toContain("templates/ui.catalog/gallery/index.html");
    expect(files.some((file) => file.startsWith("templates/ui.catalog/gallery/_next/static/") && file.endsWith(".js")))
      .toBe(true);
    expect(files.some((file) => file.startsWith("templates/ui.catalog/gallery/_next/static/") && file.endsWith(".css")))
      .toBe(true);
    expect(files.filter((file) => file.startsWith("templates/ui.catalog/gallery/previews/")))
      .toHaveLength(120);
    expect(files.some((file) => file.startsWith("templates/designs/"))).toBe(false);
    expect(files.some((file) => /templates\/ui\.[^/]+\/(DESIGN\.md|style\.json)$/.test(file))).toBe(false);
    expect(files.some((file) => /templates\/ui\.[^/]+\/assets\//.test(file))).toBe(false);
    expect(files.some((file) => file.startsWith("tests/"))).toBe(false);
    expect(files.some((file) => file.startsWith("scripts/"))).toBe(false);
  }, 30_000);
});
