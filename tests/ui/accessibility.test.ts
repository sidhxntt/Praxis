import AxeBuilder from "@axe-core/playwright";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { Browser } from "playwright";
import { forEveryStyle, launchQualityBrowser } from "./helpers/generatedApp";

describe("generated landing-page accessibility", () => {
  let browser: Browser;
  beforeAll(async () => { browser = await launchQualityBrowser(); });
  afterAll(async () => { await browser.close(); });

  it("has no serious violations and preserves semantic navigation for all 40 styles", async () => {
    await forEveryStyle(browser, async (page, id) => {
      const results = await new AxeBuilder({ page }).analyze();
      const serious = results.violations.filter(({ impact }) =>
        impact === "serious" || impact === "critical");
      expect(serious.map(({ id: rule, nodes }) => ({
        rule,
        nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })),
      })), id)
        .toEqual([]);
      expect(await page.locator("main").count(), id).toBe(1);
      expect(await page.locator("h1").count(), id).toBe(1);
      expect(await page.locator("nav[aria-label='Primary']").count(), id).toBe(1);
      expect(await page.locator("img:not([alt])").count(), id).toBe(0);

      const hrefs = await page.locator("a[href^='#']").evaluateAll((links) =>
        links.map((link) => link.getAttribute("href")!));
      const missing = await page.evaluate((targets) => targets.filter((href) =>
        href.length <= 1 || !document.getElementById(href.slice(1))), hrefs);
      expect(missing, `${id} broken local links`).toEqual([]);

      await page.keyboard.press("Tab");
      expect(await page.locator(":focus-visible").count(), `${id} visible keyboard focus`)
        .toBe(1);
    });
  }, 120_000);
});
