import { mkdtemp, writeFile, mkdir, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { UI_STYLE_IDS } from "../../src/ui/catalog";
import { startGallery } from "../../src/ui/gallery";

const roots: string[] = [];

afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true })));
});

async function galleryRoot(): Promise<string> {
  const root = await mkdtemp(path.join(os.tmpdir(), "praxis-gallery-"));
  roots.push(root);
  await mkdir(root, { recursive: true });
  await mkdir(path.join(root, "_next", "static", "chunks"), { recursive: true });
  await Promise.all([
    writeFile(path.join(root, "index.html"), "<!doctype html><title>Gallery</title><script src=\"/_next/static/chunks/app.js\"></script>"),
    writeFile(path.join(root, "_next", "static", "chunks", "app.js"), "void 0;"),
  ]);
  return root;
}

describe("loopback UI gallery", () => {
  it("binds a random loopback port and serves only allowlisted gallery resources", async () => {
    const session = await startGallery({
      galleryRoot: await galleryRoot(),
      timeoutMs: 2_000,
    });
    const url = new URL(session.url);
    expect(url.hostname).toBe("127.0.0.1");
    expect(Number(url.port)).toBeGreaterThan(0);
    expect(await (await fetch(session.url)).text()).toContain("Gallery");
    expect(await (await fetch(`${session.url}_next/static/chunks/app.js`)).text())
      .toBe("void 0;");
    expect(await fetch(`${session.url}_next/static/../index.html`))
      .toMatchObject({ status: 404 });
    const catalog = await (await fetch(`${session.url}catalog.json`)).json();
    expect(catalog).toHaveLength(UI_STYLE_IDS.length);
    expect(await fetch(`${session.url}../package.json`)).toMatchObject({ status: 404 });
    expect(await fetch(`${session.url}%2e%2e%2fpackage.json`)).toMatchObject({ status: 404 });
    expect(await fetch(`${session.url}_next/static/chunks/app.js`, { method: "PUT" }))
      .toMatchObject({ status: 405 });
    await session.close();
    await expect(session.selection).rejects.toThrow("closed");
  });

  it("accepts one valid selection, rejects invalid IDs, and closes its listener", async () => {
    const session = await startGallery({
      galleryRoot: await galleryRoot(),
      timeoutMs: 2_000,
    });
    expect(await post(session.url, "not-a-style")).toMatchObject({ status: 400 });
    expect(await post(session.url, "ora")).toMatchObject({ status: 204 });
    expect(await session.selection).toBe("ora");
    await expect(fetch(session.url)).rejects.toThrow();
  });

  it("serves only catalog-declared preview filenames", async () => {
    const session = await startGallery({ timeoutMs: 2_000 });
    const preview = await fetch(`${session.url}previews/ora-thumbnail.webp`);
    expect(preview.status).toBe(200);
    expect(preview.headers.get("content-type")).toBe("image/webp");
    expect((await preview.arrayBuffer()).byteLength).toBeGreaterThan(1_000);
    expect(await fetch(`${session.url}previews/not-a-style-thumbnail.webp`))
      .toMatchObject({ status: 404 });
    expect(await fetch(`${session.url}previews/ora-secret.webp`))
      .toMatchObject({ status: 404 });
    await session.close();
    await expect(session.selection).rejects.toThrow("closed");
  });

  it("serves live previews, their scripts and template pictures, and nothing else", async () => {
    const root = await galleryRoot();
    const templates = await mkdtemp(path.join(os.tmpdir(), "praxis-gallery-templates-"));
    roots.push(templates);
    await mkdir(path.join(root, "live", "ora"), { recursive: true });
    await mkdir(path.join(root, "live", "assets"), { recursive: true });
    await writeFile(path.join(root, "live", "ora", "index.html"), "<!doctype html><title>Ora live</title>");
    await writeFile(path.join(root, "live", "assets", "ora-abc.js"), "void 1;");
    const pictures = path.join(templates, "ui.ora", "files", "shared", "public", "design", "websites", "ora-call");
    await mkdir(pictures, { recursive: true });
    await writeFile(path.join(pictures, "orb.webp"), Buffer.from([1, 2, 3]));
    const session = await startGallery({ galleryRoot: root, templatesRoot: templates, timeoutMs: 2_000 });

    const page = await fetch(`${session.url}live/ora/`);
    expect(page.status).toBe(200);
    expect(await page.text()).toContain("Ora live");
    expect(page.headers.get("content-security-policy")).toContain("https://fonts.googleapis.com");
    expect(page.headers.get("content-security-policy")).toContain("frame-ancestors 'self'");
    expect((await fetch(session.url)).headers.get("content-security-policy")).not.toContain("googleapis");
    expect(await (await fetch(`${session.url}live/assets/ora-abc.js`)).text()).toBe("void 1;");
    const picture = await fetch(`${session.url}design/websites/ora-call/orb.webp`);
    expect(picture.headers.get("content-type")).toBe("image/webp");
    expect(Buffer.from(await picture.arrayBuffer())).toEqual(Buffer.from([1, 2, 3]));

    for (const blocked of [
      "live/not-a-style/",
      "live/ora/secret.html",
      "live/assets/x.html",
      "design/websites/ora-call/missing.webp",
      "design/websites/ora-call/%2e%2e%2f%2e%2e%2fmanifest.json",
      "design/websites/ora-call/..%2fmanifest.json",
    ]) {
      expect((await fetch(`${session.url}${blocked}`)).status, blocked).toBe(404);
    }
    await session.close();
    await expect(session.selection).rejects.toThrow("closed");
  });

  it("rejects duplicate concurrent selection attempts", async () => {
    const session = await startGallery({
      galleryRoot: await galleryRoot(),
      timeoutMs: 2_000,
    });
    const responses = await Promise.all([
      post(session.url, "ora"),
      post(session.url, "sayso"),
    ]);
    expect(responses.map((response) => response.status).sort()).toEqual([204, 409]);
    expect(["ora", "sayso"]).toContain(await session.selection);
  });

  it("times out and closes the listener", async () => {
    const session = await startGallery({
      galleryRoot: await galleryRoot(),
      timeoutMs: 20,
    });
    await expect(session.selection).rejects.toThrow("timed out");
    await expect(fetch(session.url)).rejects.toThrow();
  });

  it("honors an abort signal and closes the listener", async () => {
    const controller = new AbortController();
    const session = await startGallery({
      galleryRoot: await galleryRoot(),
      timeoutMs: 2_000,
      signal: controller.signal,
    });
    controller.abort();
    await expect(session.selection).rejects.toThrow("cancelled");
    await expect(fetch(session.url)).rejects.toThrow();
  });
});

function post(url: string, id: string): Promise<Response> {
  return fetch(`${url}select`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ id }),
  });
}
