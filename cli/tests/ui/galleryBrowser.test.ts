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
      expect(await page.locator('script[src^="/_next/static/"]').count()).toBeGreaterThan(0);
      expect(await page.locator("h1").textContent()).toContain("Choose your landing-page direction");
      expect(await page.locator(".compatibility").textContent())
        .toContain("Angular, which is TypeScript-only");
      expect(await page.locator("text=/Unhandled Runtime Error|Internal Server Error|Failed to compile/i").count())
        .toBe(0);

      await page.locator("#open-filters").click();
      await page.locator("#filter-drawer").waitFor({ state: "visible" });
      await page.waitForTimeout(350);
      expect((await page.locator("#filter-drawer").boundingBox())?.x).toBeGreaterThan(900);
      await page.locator(".drawer-close").click();
      expect(await page.locator(".filter-drawer").evaluate((element) =>
        getComputedStyle(element).visibility)).toBe("visible");
      await page.locator(".filter-drawer").waitFor({ state: "hidden" });
      await page.locator("#open-filters").click();
      await page.locator("#filter-drawer").waitFor({ state: "visible" });
      await page.locator("#search").fill("Apple");
      expect(await page.locator("#count").textContent()).toBe("1 of 40 styles");
      await page.locator(".show-results").click();
      const card = page.locator(".card");
      await card.focus();
      await page.keyboard.press("Enter");
      await page.locator("#preview").waitFor({ state: "visible" });
      expect(await page.locator("#preview").evaluate((dialog: HTMLDialogElement) => {
        const rect = dialog.getBoundingClientRect();
        return Math.abs((window.innerWidth - rect.width) / 2 - rect.left) < 2;
      })).toBe(true);
      expect(await page.locator("#preview-title").textContent()).toBe("Apple inspired");
      expect(await page.locator("#preview-description").textContent())
        .toContain("photography-first product story");
      expect(await page.locator("#preview-details").textContent())
        .toContain("Next.js, React, Vue, Astro, Angular");
      expect(await page.locator("#select").evaluate((element: HTMLElement) => {
        const rect = element.getBoundingClientRect();
        return rect.top >= 0 && rect.bottom <= window.innerHeight;
      })).toBe(true);
      await page.waitForFunction(() => {
        const image = document.querySelector("#preview-image") as HTMLImageElement | null;
        return image?.complete && image.naturalHeight > 900;
      });
      const previewSizing = await page.locator(".preview-art").evaluate((element: HTMLElement) => ({
        canScroll: element.scrollHeight > element.clientHeight,
        height: element.clientHeight,
        dialogHeight: (element.closest("dialog") as HTMLDialogElement).clientHeight,
      }));
      expect(previewSizing.canScroll).toBe(true);
      expect(previewSizing.height).toBe(previewSizing.dialogHeight);
      expect(previewSizing.height).toBeGreaterThan(800);
      expect(await page.locator("#preview-image").evaluate((image: HTMLImageElement) =>
        image.naturalWidth)).toBe(1440);
      expect(await page.locator("#preview-image").evaluate((image: HTMLImageElement) =>
        image.naturalHeight)).toBeGreaterThan(900);

      await page.setViewportSize({ width: 390, height: 844 });
      await page.waitForFunction(() =>
        (document.querySelector("#preview-image") as HTMLImageElement).currentSrc.endsWith("apple-mobile.webp"));
      expect(await page.locator("#preview-image").evaluate((image: HTMLImageElement) =>
        image.currentSrc.endsWith("apple-mobile.webp"))).toBe(true);
      expect(await page.locator("#preview").evaluate((dialog: HTMLDialogElement) =>
        dialog.scrollHeight > dialog.clientHeight)).toBe(true);
      await page.locator("#select").scrollIntoViewIfNeeded();
      expect(await page.locator("#select").evaluate((element: HTMLElement) => {
        const rect = element.getBoundingClientRect();
        return rect.top >= 0 && rect.bottom <= window.innerHeight;
      })).toBe(true);
      await page.locator("#select").click();
      await page.waitForFunction(() =>
        document.querySelector("#status")?.textContent?.includes("return to the terminal"));
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
