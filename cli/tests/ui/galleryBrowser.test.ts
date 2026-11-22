import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { Browser, chromium } from "playwright";
import { UI_STYLE_IDS } from "../../src/ui/catalog";
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
      expect(await page.locator("h1").textContent()).toContain("Choose a direction, then make it yours.");
      expect(await page.locator(".compatibility").textContent())
        .toContain("Vue, Astro and Angular projects start from the plain starter");
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
      await page.locator("#search").fill("Sayso");
      expect(await page.locator("#count").textContent()).toBe(`1 of ${UI_STYLE_IDS.length} styles`);
      await page.locator(".show-results").click();
      const card = page.locator(".card");
      await card.focus();
      await page.keyboard.press("Enter");
      await page.locator("#preview").waitFor({ state: "visible" });
      expect(await page.locator("#preview").evaluate((dialog: HTMLDialogElement) => {
        const rect = dialog.getBoundingClientRect();
        return Math.abs((window.innerWidth - rect.width) / 2 - rect.left) < 2;
      })).toBe(true);
      expect(await page.locator("#preview-title").textContent()).toBe("Sayso");
      expect(await page.locator("#preview-description").textContent())
        .toContain("red moulded device");
      expect(await page.locator("#preview-details").textContent())
        .toContain("Next.js, Vite (React)");
      expect(await page.locator("#select").evaluate((element: HTMLElement) => {
        const rect = element.getBoundingClientRect();
        return rect.top >= 0 && rect.bottom <= window.innerHeight;
      })).toBe(true);
      // The live hero runs at a real 1440×900 desktop size, scaled to fill the 16:10 stage.
      expect(await page.locator("#preview-frame").getAttribute("src")).toBe("/live/sayso/");
      const hero = page.frameLocator("#preview-frame").locator("#root > *").first();
      await hero.waitFor({ state: "attached" });
      expect(await hero.evaluate((element: HTMLElement) => [window.innerWidth, window.innerHeight, element.getBoundingClientRect().height]))
        .toEqual([1440, 900, 900]);
      const fit = await page.locator(".live-stage").evaluate((stage: HTMLElement) => {
        const device = stage.querySelector(".live-device")!.getBoundingClientRect();
        const box = stage.getBoundingClientRect();
        const dialog = stage.closest("dialog")!.getBoundingClientRect();
        const bar = stage.previousElementSibling!.getBoundingClientRect();
        return { box, device, dialog, bar };
      });
      // no empty space: the stage is filled and the dialog is only as tall as bar + stage
      expect(fit.device.width).toBeGreaterThanOrEqual(fit.box.width - 1);
      expect(fit.device.height).toBeGreaterThanOrEqual(fit.box.height - 1);
      expect(Math.abs(fit.dialog.height - (fit.bar.height + fit.box.height))).toBeLessThan(4);

      await page.locator(".device-toggle button", { hasText: "Phone" }).click();
      await page.waitForFunction(() => {
        const frame = document.querySelector("#preview-frame") as HTMLIFrameElement | null;
        return frame?.contentWindow?.innerWidth === 390 && frame.contentWindow.innerHeight === 844;
      });

      await page.setViewportSize({ width: 390, height: 844 });
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
      expect(await selectionResult).toBe("sayso");
      expect(errors).toEqual([]);
    } finally {
      await context.close();
      await session.close();
      await selectionResult;
    }
  }, 30_000);
});
