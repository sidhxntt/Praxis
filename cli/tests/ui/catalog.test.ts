import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  isUiStyleId,
  supportsUiTemplates,
  UI_STYLE_IDS,
  UI_STYLES,
} from "../../src/ui/catalog";

describe("UI style catalog", () => {
  it("lists unique stable styles in a stable order", () => {
    expect(UI_STYLE_IDS.length).toBeGreaterThan(0);
    expect(new Set(UI_STYLE_IDS).size).toBe(UI_STYLE_IDS.length);
    expect([...UI_STYLE_IDS]).toEqual([...UI_STYLE_IDS].sort());
    expect(UI_STYLES.map(({ id }) => id)).toEqual([...UI_STYLE_IDS]);
  });

  it("describes every style and matches its template module", async () => {
    for (const style of UI_STYLES) {
      expect(style.description.length, style.id).toBeGreaterThan(0);
      expect(style.traits.length, style.id).toBeGreaterThan(0);
      const template = JSON.parse(await readFile(
        path.resolve("templates", `ui.${style.id}`, "template.json"),
        "utf8",
      ));
      expect(template).toMatchObject({
        id: style.id,
        name: style.label,
        description: style.description,
        traits: [...style.traits],
        theme: style.theme,
      });
    }
  });

  it("recognizes only catalog style IDs", () => {
    expect(isUiStyleId("ora")).toBe(true);
    expect(isUiStyleId("apple")).toBe(false);
    expect(isUiStyleId("not-a-style")).toBe(false);
    expect(isUiStyleId(null)).toBe(false);
  });

  it("offers templates only to the React frameworks", () => {
    expect(supportsUiTemplates("next")).toBe(true);
    expect(supportsUiTemplates("vite")).toBe(true);
    expect(supportsUiTemplates("vue")).toBe(false);
    expect(supportsUiTemplates("astro")).toBe(false);
    expect(supportsUiTemplates("angular")).toBe(false);
    expect(supportsUiTemplates(undefined)).toBe(false);
  });
});
