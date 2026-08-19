import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { Browser } from "playwright";
import { UI_STYLE_IDS } from "../../src/ui/catalog";
import { launchQualityBrowser, renderStyle } from "./helpers/generatedApp";

describe("generated landing-page responsive behavior", () => {
  let browser: Browser;
  beforeAll(async () => { browser = await launchQualityBrowser(); });
  afterAll(async () => { await browser.close(); });

  it("has no horizontal overflow at the supported viewport gates", async () => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    try {
      for (const id of UI_STYLE_IDS) {
        await renderStyle(page, id);
        for (const width of [320, 375, 768, 1280, 1536]) {
          await page.setViewportSize({ width, height: 800 });
          const sizes = await page.evaluate(() => ({
            viewport: document.documentElement.clientWidth,
            document: document.documentElement.scrollWidth,
          }));
          expect(sizes.document, `${id} at ${width}px`).toBeLessThanOrEqual(sizes.viewport);
        }
      }
    } finally {
      await context.close();
    }
  }, 120_000);

  it("honors reduced motion and keeps mobile navigation usable", async () => {
    const context = await browser.newContext({
      reducedMotion: "reduce",
      viewport: { width: 375, height: 800 },
    });
    const page = await context.newPage();
    try {
      for (const id of UI_STYLE_IDS) {
        await renderStyle(page, id);
        expect(await page.locator("nav").evaluate((node) => getComputedStyle(node).display), id)
          .toBe("none");
        expect(parseFloat(await page.locator(".button").first().evaluate((node) =>
          getComputedStyle(node).transitionDuration)), id).toBeLessThanOrEqual(0.00001);
        expect(await page.locator(".nav-inner .button").isVisible(), id).toBe(true);
      }
    } finally {
      await context.close();
    }
  }, 120_000);
});
