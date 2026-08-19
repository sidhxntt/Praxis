import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { UI_STYLE_IDS } from "../../src/ui/catalog";

interface PreviewRecord {
  path: string;
  width: number;
  height: number;
  sha256: string;
  alt: string;
}

interface CatalogRecord {
  id: string;
  label: string;
  previews: Record<"thumbnail" | "desktop" | "mobile", PreviewRecord>;
}

const root = path.resolve("templates/ui.catalog");

describe("rendered UI previews", () => {
  it("manifests exactly three hashed previews for every catalog style", async () => {
    const catalog = JSON.parse(
      await readFile(path.join(root, "catalog.json"), "utf8"),
    ) as CatalogRecord[];
    expect(catalog.map(({ id }) => id)).toEqual([...UI_STYLE_IDS]);

    const manifested: string[] = [];
    for (const style of catalog) {
      for (const [kind, expected] of Object.entries({
        thumbnail: [640, 400],
        desktop: [1440, 900],
        mobile: [390, 844],
      })) {
        const preview = style.previews[kind as keyof CatalogRecord["previews"]];
        manifested.push(path.basename(preview.path));
        expect([preview.width, preview.height]).toEqual(expected);
        expect(preview.alt).toContain(style.label);
        expect(preview.alt.toLowerCase()).toContain("landing page preview");
        const bytes = await readFile(path.join(root, "gallery", preview.path));
        expect(createHash("sha256").update(bytes).digest("hex")).toBe(preview.sha256);
        const metadata = await sharp(bytes).metadata();
        expect([metadata.width, metadata.height, metadata.format]).toEqual([
          expected[0],
          expected[1],
          "webp",
        ]);
      }
    }

    expect((await readdir(path.join(root, "gallery/previews"))).sort())
      .toEqual(manifested.sort());
    expect(manifested).toHaveLength(120);
  });
});
