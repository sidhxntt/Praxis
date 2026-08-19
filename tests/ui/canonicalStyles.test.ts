import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  CanonicalLandingPage,
  validateCanonicalLandingPage,
} from "../../src/ui/canonical";

async function loadStyle(id: string): Promise<CanonicalLandingPage> {
  const file = path.resolve(`templates/ui.${id}/style.json`);
  return validateCanonicalLandingPage(JSON.parse(await readFile(file, "utf8")));
}

describe("canonical landing page styles", () => {
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
