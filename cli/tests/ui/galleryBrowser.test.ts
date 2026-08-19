import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { Browser, chromium } from "playwright";
import { startGallery } from "../../src/ui/gallery";

describe("visual gallery browser flow", () => {
  let browser: Browser;
  beforeAll(async () => { browser = await chromium.launch({ headless: true }); });
  afterAll(async () => { await browser.close(); });

  it("loads, filters, previews, and returns a keyboard selection to the CLI session", async () => {
    const session = await startGallery({ timeoutMs: 10_000 });
    const selectionResult = session.selection.catch(() => undefined);
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error" || message.type() === "warning") errors.push(message.text());
    });
    try {
      await page.goto(session.url, { waitUntil: "networkidle" });
      expect(page.url()).toBe(session.url);
      expect(await page.title()).toBe("Choose a Praxis Flow landing page");
      expect(await page.locator("h1").textContent()).toContain("Choose your landing-page direction");
      expect(await page.locator(".compatibility").textContent())
        .toContain("Angular, which is TypeScript-only");
      expect(await page.locator("text=/Unhandled Runtime Error|Internal Server Error|Failed to compile/i").count())
        .toBe(0);

      await page.locator("#search").fill("Apple");
      expect(await page.locator("#count").textContent()).toBe("1 of 40 styles");
      const card = page.locator(".card");
      await card.focus();
      await page.keyboard.press("Enter");
      await page.locator("#preview").waitFor({ state: "visible" });
      expect(await page.locator("#preview-title").textContent()).toBe("Apple inspired");
      expect(await page.locator("#preview-image").evaluate((image: HTMLImageElement) =>
        image.naturalWidth)).toBe(1440);
      expect(await page.locator("#preview-image").evaluate((image: HTMLImageElement) =>
        image.naturalHeight)).toBeGreaterThan(900);

      await page.setViewportSize({ width: 390, height: 844 });
      await page.waitForFunction(() =>
        (document.querySelector("#preview-image") as HTMLImageElement).currentSrc.endsWith("apple-mobile.webp"));
      expect(await page.locator("#preview-image").evaluate((image: HTMLImageElement) =>
        image.currentSrc.endsWith("apple-mobile.webp"))).toBe(true);
      await page.locator("#select").click();
      await page.locator("#status").waitFor({ state: "visible" });
      expect(await page.locator("#status").textContent()).toContain("return to the terminal");
      expect(await selectionResult).toBe("apple");
      expect(errors).toEqual([]);
    } finally {
      await context.close();
      await session.close();
      await selectionResult;
    }
  }, 30_000);
});
