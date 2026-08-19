import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { UI_STYLE_IDS } from "../../src/ui/catalog";

describe("generated landing-page visual baselines", () => {
  it("has distinct committed desktop and mobile baselines for every style", async () => {
    const catalog = JSON.parse(
      await readFile(path.resolve("templates/ui.catalog/catalog.json"), "utf8"),
    ) as Array<{
      id: string;
      previews: { desktop: { sha256: string }; mobile: { sha256: string } };
    }>;
    expect(catalog.map(({ id }) => id)).toEqual([...UI_STYLE_IDS]);
    expect(new Set(catalog.map(({ previews }) => previews.desktop.sha256)).size).toBe(40);
    expect(new Set(catalog.map(({ previews }) => previews.mobile.sha256)).size).toBe(40);
  });
});
