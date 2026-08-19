import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  CanonicalLandingPage,
  validateCanonicalLandingPage,
} from "../../src/ui/canonical";
import { UI_STYLE_IDS } from "../../src/ui/catalog";

async function loadStyle(id: string): Promise<CanonicalLandingPage> {
  const file = path.resolve(`templates/ui.${id}/style.json`);
  return validateCanonicalLandingPage(JSON.parse(await readFile(file, "utf8")));
}

describe("canonical landing page styles", () => {
  it("provides a substantive source-linked module for every catalog style", async () => {
    const pages = await Promise.all(UI_STYLE_IDS.map(loadStyle));

    expect(pages).toHaveLength(40);
    expect(new Set(pages.map(({ id }) => id)).size).toBe(40);
    for (const page of pages) {
      expect(page.sections.length).toBeGreaterThanOrEqual(7);
      expect(page.assets.length).toBeGreaterThan(0);
      await expect(
        access(path.resolve(`templates/ui.${page.id}/DESIGN.md`)),
      ).resolves.toBeUndefined();
      const design = await readFile(
        path.resolve(`templates/ui.${page.id}/DESIGN.md`),
        "utf8",
      );
      expect(design.toLowerCase()).toContain("not affiliated");
      expect(design).toContain(`DESIGN-${page.id}.md`);
    }
  });

  it("uses distinct original brands and hero statements", async () => {
    const pages = await Promise.all(UI_STYLE_IDS.map(loadStyle));
    const brands = pages.map(({ sections }) =>
      sections.find(({ type }) => type === "navigation")?.type === "navigation"
        ? sections.find(({ type }) => type === "navigation")!.brand
        : "",
    );
    const heroes = pages.map(({ sections }) =>
      sections.find(({ type }) => type === "hero")?.type === "hero"
        ? sections.find(({ type }) => type === "hero")!.heading
        : "",
    );
    expect(new Set(brands).size).toBe(40);
    expect(new Set(heroes).size).toBe(40);
  });

  it("defines the Apple-inspired pilot as a substantive landing page", async () => {
    const style = await loadStyle("apple");

    expect(style.id).toBe("apple");
    expect(style.sourceDesign).toBe("DESIGN-apple.md");
    expect(style.sections).toHaveLength(8);
    expect(style.sections[0].type).toBe("navigation");
    expect(style.sections.at(-1)?.type).toBe("footer");
    expect(style.sections.some(({ type }) => type === "hero")).toBe(true);
    expect(style.sections.some(({ type }) => type === "cta")).toBe(true);
    expect(
      style.sections.filter(
        ({ type }) => !["navigation", "hero", "cta", "footer"].includes(type),
      ).length,
    ).toBeGreaterThanOrEqual(3);
  });

  it("requires accessible motion and confined original assets", async () => {
    const style = await loadStyle("apple");

    expect(style.accessibility).toEqual({ reducedMotion: true, skipLink: true });
    expect(style.assets.length).toBeGreaterThan(0);
    expect(
      style.assets.every(
        ({ source, alt, decorative }) =>
          source.startsWith("assets/")
          && !source.includes("..")
          && (decorative ? alt === "" : alt.length > 0),
      ),
    ).toBe(true);
  });

  it("rejects unsafe or incomplete canonical styles", async () => {
    const style = await loadStyle("apple");
    expect(() =>
      validateCanonicalLandingPage({
        ...style,
        assets: [{
          source: "../outside.svg",
          alt: "Unsafe",
          width: 100,
          height: 100,
        }],
      }),
    ).toThrow("asset source must stay inside assets/");
    expect(() =>
      validateCanonicalLandingPage({ ...style, sections: style.sections.slice(0, 2) }),
    ).toThrow("landing page must contain at least seven sections");
  });
});
