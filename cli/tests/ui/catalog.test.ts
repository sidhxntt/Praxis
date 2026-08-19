import { describe, expect, it } from "vitest";
import {
  isUiStyleId,
  UI_STYLE_IDS,
  UI_STYLES,
} from "../../src/ui/catalog";

describe("UI style catalog", () => {
  it("contains exactly 40 unique stable styles", () => {
    expect(UI_STYLE_IDS).toHaveLength(40);
    expect(new Set(UI_STYLE_IDS).size).toBe(40);
    expect(UI_STYLES.map(({ id }) => id)).toEqual([...UI_STYLE_IDS]);
  });

  it("links every inspired style to its source design", () => {
    expect(
      UI_STYLES.every(({ id, label, designFile, description, traits }) =>
        label.endsWith(" inspired")
        && designFile === `DESIGN-${id}.md`
        && description.length > 0
        && traits.length > 0),
    ).toBe(true);
  });

  it("recognizes only catalog style IDs", () => {
    expect(isUiStyleId("apple")).toBe(true);
    expect(isUiStyleId("not-a-style")).toBe(false);
    expect(isUiStyleId(null)).toBe(false);
  });
});
