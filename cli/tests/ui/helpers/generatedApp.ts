import { readFile } from "node:fs/promises";
import path from "node:path";
import { Browser, chromium, Page } from "playwright";
import { UI_STYLE_IDS, UiStyleId } from "../../../src/ui/catalog";

export async function launchQualityBrowser(): Promise<Browser> {
  return chromium.launch({ headless: true });
}

export async function renderStyle(page: Page, id: UiStyleId): Promise<void> {
  const moduleRoot = path.resolve("templates", `ui.${id}`);
  const style = JSON.parse(await readFile(path.join(moduleRoot, "style.json"), "utf8"));
  // Repository generator modules are plain ESM scripts rather than shipped TypeScript APIs.
  const { renderPageMarkup } = await import("../../../scripts/ui/lib/render-html.mjs");
  const { renderCss } = await import("../../../scripts/ui/lib/render-css.mjs");
  let markup: string = renderPageMarkup(style);
  for (const asset of style.assets as Array<{ source: string }>) {
    const bytes = await readFile(path.join(moduleRoot, asset.source));
    const mime = asset.source.endsWith(".svg") ? "image/svg+xml" : "application/octet-stream";
    const uri = `data:${mime};base64,${bytes.toString("base64")}`;
    markup = markup.split(`/ui/${id}/${asset.source.slice("assets/".length)}`).join(uri);
  }
  const css: string = renderCss(style).replace('@import "tailwindcss";', "");
  await page.setContent(
    `<!doctype html><html lang="en"><head><title>${id} preview</title><meta name="viewport" content="width=device-width,initial-scale=1"><style>${css}</style></head><body>${markup}</body></html>`,
    { waitUntil: "load" },
  );
}

export async function forEveryStyle(
  browser: Browser,
  check: (page: Page, id: UiStyleId) => Promise<void>,
): Promise<void> {
  const context = await browser.newContext({
    colorScheme: "light",
    reducedMotion: "reduce",
    viewport: { width: 1280, height: 800 },
  });
  const page = await context.newPage();
  try {
    for (const id of UI_STYLE_IDS) {
      await renderStyle(page, id);
      await check(page, id);
    }
  } finally {
    await context.close();
  }
}
