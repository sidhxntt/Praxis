import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { products, type ProductKey } from "./products";

export const ogSize = { width: 1200, height: 630 };

/** The share card: the hero in miniature (brand ground, white sans line, italic serif line, the warm ball). */
export async function renderOg(product: ProductKey) {
  const p = products[product];
  const c = p.colors;
  const dir = path.join(process.cwd(), "assets/og");
  const [sans, serif] = await Promise.all([
    readFile(path.join(dir, "inter-tight-latin-500-normal.woff")),
    readFile(path.join(dir, "instrument-serif-latin-400-italic.woff")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 64px",
          color: "#fff",
          fontFamily: "Inter Tight",
          background: `radial-gradient(70% 80% at 50% 40%, rgba(255,255,255,.22), rgba(255,255,255,0) 70%), linear-gradient(180deg, ${c.brand} 0%, ${c.brand} 62%, ${c.brand} 100%)`,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: 84,
            top: 70,
            width: 300,
            height: 300,
            borderRadius: 300,
            background:
              "radial-gradient(circle at 34% 30%, #ffd6c2 0%, #ff8a61 22%, #ed4f1c 48%, #c0230f 70%, #6e0a0c 100%)",
            boxShadow: "0 40px 80px rgba(0,0,0,.25)",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 30, letterSpacing: "-0.01em" }}>
          <div style={{ width: 26, height: 26, borderRadius: 26, background: "#fff" }} />
          {p.name}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 92, letterSpacing: "-0.045em", lineHeight: 1 }}>{p.hero.line1}</div>
          <div style={{ fontFamily: "Instrument Serif", fontSize: 118, lineHeight: 1.02, letterSpacing: "-0.02em", color: c.soft }}>
            {p.hero.line2}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "rgba(255,255,255,.85)" }}>
          <span>{p.hero.meta}</span>
          <span style={{ fontFamily: "monospace" }}>$ {p.command}</span>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Inter Tight", data: sans, weight: 500, style: "normal" },
        { name: "Instrument Serif", data: serif, weight: 400, style: "italic" },
      ],
    },
  );
}
