#!/usr/bin/env node

import { createHash } from "node:crypto";
import { access, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
import sharp from "sharp";
import { loadStyle } from "./lib/load-style.mjs";
import { renderCss } from "./lib/render-css.mjs";
import { renderPageMarkup } from "./lib/render-html.mjs";

const templatesRoot = path.resolve("templates");
const outputOption = process.argv.indexOf("--output");
if (outputOption >= 0 && !process.argv[outputOption + 1]) {
  throw new Error("--output requires a directory");
}
const catalogRoot = path.resolve(
  outputOption >= 0 ? process.argv[outputOption + 1] : path.join(templatesRoot, "ui.catalog"),
);
const previewsRoot = path.join(catalogRoot, "gallery", "previews");
const dimensions = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 390, height: 844 },
};

async function main() {
  const ids = await discoverStyles();
  await rm(previewsRoot, { recursive: true, force: true });
  await mkdir(previewsRoot, { recursive: true });
  const browser = await launchBrowser();
  const catalog = [];
  try {
    for (const [index, id] of ids.entries()) {
      const { moduleRoot, style } = await loadStyle(templatesRoot, id);
      const html = await renderDocument(moduleRoot, style);
      const context = await browser.newContext({
        colorScheme: "light",
        reducedMotion: "reduce",
        locale: "en-US",
        timezoneId: "UTC",
        deviceScaleFactor: 1,
      });
      const page = await context.newPage();
      await page.addInitScript(() => {
        Date.now = () => 1_700_000_000_000;
        Math.random = () => 0.5;
      });
      await page.setContent(html, { waitUntil: "load" });
      await page.evaluate(() => document.fonts.ready);

      const desktop = await capture(page, id, "desktop", dimensions.desktop);
      const mobile = await capture(page, id, "mobile", dimensions.mobile);
      const thumbnailPath = path.join(previewsRoot, `${id}-thumbnail.webp`);
      await sharp(await readFile(desktop.absolute))
        .resize(640, 400, { fit: "cover", position: "top" })
        .webp({ quality: 78, effort: 6 })
        .toFile(thumbnailPath);
      const alt = `${style.name} landing page preview`;
      catalog.push({
        id: style.id,
        label: style.name,
        designFile: style.sourceDesign,
        description: style.description,
        traits: style.traits,
        theme: style.theme,
        previews: {
          thumbnail: await previewRecord(`${id}-thumbnail.webp`, 640, 400, alt),
          desktop: await previewRecord(path.basename(desktop.absolute), 1440, 900, alt),
          mobile: await previewRecord(path.basename(mobile.absolute), 390, 844, alt),
        },
      });
      await context.close();
      process.stdout.write(`Rendered ${index + 1}/${ids.length}: ${id}\n`);
    }
  } finally {
    await browser.close();
  }
  await writeFile(
    path.join(catalogRoot, "catalog.json"),
    `${JSON.stringify(catalog, null, 2)}\n`,
  );
}

async function capture(page, id, kind, viewport) {
  await page.setViewportSize(viewport);
  await page.evaluate(() => scrollTo(0, 0));
  const png = await page.screenshot({ type: "png", animations: "disabled" });
  const absolute = path.join(previewsRoot, `${id}-${kind}.webp`);
  await sharp(png).webp({ quality: 82, effort: 6 }).toFile(absolute);
  return { absolute };
}

async function previewRecord(filename, width, height, alt) {
  const bytes = await readFile(path.join(previewsRoot, filename));
  return {
    path: `previews/${filename}`,
    width,
    height,
    sha256: createHash("sha256").update(bytes).digest("hex"),
    alt,
  };
}

async function renderDocument(moduleRoot, style) {
  let markup = renderPageMarkup(style);
  for (const asset of style.assets) {
    const contents = await readFile(path.join(moduleRoot, asset.source));
    const mime = asset.source.endsWith(".svg") ? "image/svg+xml" : "application/octet-stream";
    const uri = `data:${mime};base64,${contents.toString("base64")}`;
    markup = markup.split(`/ui/${style.id}/${asset.source.slice("assets/".length)}`).join(uri);
  }
  const css = renderCss(style).replace('@import "tailwindcss";', "");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${css}</style></head><body>${markup}</body></html>`;
}

async function launchBrowser() {
  const executablePath = process.env.PRAXIS_CHROME_EXECUTABLE;
  if (executablePath) return chromium.launch({ headless: true, executablePath });
  try {
    return await chromium.launch({ headless: true });
  } catch (error) {
    if (process.platform !== "darwin") throw error;
  }
  const macChrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  if (process.platform === "darwin" && await exists(macChrome)) {
    return chromium.launch({ headless: true, executablePath: macChrome });
  }
  throw new Error("Playwright Chromium is unavailable; run `npx playwright install chromium`");
}

async function exists(file) {
  try { await access(file); return true; } catch { return false; }
}

async function discoverStyles() {
  const source = await readFile(path.resolve("src/ui/catalog.ts"), "utf8");
  const block = source.match(/UI_STYLE_IDS\s*=\s*\[([\s\S]*?)\]\s*as const/)?.[1];
  if (!block) throw new Error("could not read UI_STYLE_IDS from src/ui/catalog.ts");
  return [...block.matchAll(/"([a-z0-9-]+)"/g)].map((match) => match[1]);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
