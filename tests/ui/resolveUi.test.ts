import { describe, expect, it, vi } from "vitest";
import { browserLaunchCommand } from "../../src/ui/openBrowser";
import { resolveUiStyle } from "../../src/ui/resolveUi";
import { UiStyleId } from "../../src/ui/catalog";

function session(selection: Promise<UiStyleId>) {
  return {
    url: "http://127.0.0.1:43210/",
    selection,
    close: vi.fn(async () => undefined),
  };
}

describe("resolveUiStyle", () => {
  it("returns a selection made in the visual gallery", async () => {
    const gallery = session(Promise.resolve("apple"));
    const selectTerminal = vi.fn();
    await expect(resolveUiStyle({
      confirmGallery: vi.fn(async () => true),
      startGallery: vi.fn(async () => gallery),
      openBrowser: vi.fn(async () => true),
      selectTerminal,
      env: {},
    })).resolves.toBe("apple");
    expect(selectTerminal).not.toHaveBeenCalled();
  });

  it("uses terminal selection when the user declines the browser", async () => {
    const startGallery = vi.fn();
    await expect(resolveUiStyle({
      confirmGallery: vi.fn(async () => false),
      startGallery,
      openBrowser: vi.fn(),
      selectTerminal: vi.fn(async () => "vercel"),
      env: {},
    })).resolves.toBe("vercel");
    expect(startGallery).not.toHaveBeenCalled();
  });

  it.each([{ CI: "true" }, { TERM: "dumb" }])(
    "uses terminal selection in a headless environment %#",
    async (env) => {
      const confirmGallery = vi.fn();
      await expect(resolveUiStyle({
        confirmGallery,
        startGallery: vi.fn(),
        openBrowser: vi.fn(),
        selectTerminal: vi.fn(async () => "raycast"),
        env,
      })).resolves.toBe("raycast");
      expect(confirmGallery).not.toHaveBeenCalled();
    },
  );

  it("closes the gallery and falls back when browser launch fails", async () => {
    const gallery = session(new Promise(() => undefined));
    await expect(resolveUiStyle({
      confirmGallery: vi.fn(async () => true),
      startGallery: vi.fn(async () => gallery),
      openBrowser: vi.fn(async () => false),
      selectTerminal: vi.fn(async () => "figma"),
      env: {},
    })).resolves.toBe("figma");
    expect(gallery.close).toHaveBeenCalledOnce();
  });

  it("falls back after gallery timeout or browser closure", async () => {
    const gallery = session(Promise.reject(new Error("timed out")));
    await expect(resolveUiStyle({
      confirmGallery: vi.fn(async () => true),
      startGallery: vi.fn(async () => gallery),
      openBrowser: vi.fn(async () => true),
      selectTerminal: vi.fn(async () => "notion"),
      env: {},
    })).resolves.toBe("notion");
  });

  it("does not turn explicit cancellation into a terminal prompt", async () => {
    const controller = new AbortController();
    controller.abort();
    const selectTerminal = vi.fn();
    await expect(resolveUiStyle({
      confirmGallery: vi.fn(async () => true),
      startGallery: vi.fn(),
      openBrowser: vi.fn(),
      selectTerminal,
      env: {},
      signal: controller.signal,
    })).rejects.toThrow("cancelled");
    expect(selectTerminal).not.toHaveBeenCalled();
  });
});

describe("browserLaunchCommand", () => {
  it("uses argument arrays without shell interpolation on every supported platform", () => {
    const url = "http://127.0.0.1:43210/";
    expect(browserLaunchCommand(url, "darwin")).toEqual({ command: "open", args: [url] });
    expect(browserLaunchCommand(url, "win32")).toEqual({
      command: "cmd",
      args: ["/c", "start", "", url],
    });
    expect(browserLaunchCommand(url, "linux")).toEqual({ command: "xdg-open", args: [url] });
  });

  it("rejects non-loopback and non-http gallery URLs", () => {
    expect(() => browserLaunchCommand("https://example.com", "darwin"))
      .toThrow("loopback");
    expect(() => browserLaunchCommand("file:///tmp/gallery", "linux"))
      .toThrow("loopback");
  });
});
