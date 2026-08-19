import { mkdtemp, writeFile, mkdir, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
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
    expect(catalog).toHaveLength(40);
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
    expect(await post(session.url, "apple")).toMatchObject({ status: 204 });
    expect(await session.selection).toBe("apple");
    await expect(fetch(session.url)).rejects.toThrow();
  });

  it("serves only catalog-declared preview filenames", async () => {
    const session = await startGallery({ timeoutMs: 2_000 });
    const preview = await fetch(`${session.url}previews/apple-thumbnail.webp`);
    expect(preview.status).toBe(200);
    expect(preview.headers.get("content-type")).toBe("image/webp");
    expect((await preview.arrayBuffer()).byteLength).toBeGreaterThan(1_000);
    expect(await fetch(`${session.url}previews/not-a-style-thumbnail.webp`))
      .toMatchObject({ status: 404 });
    expect(await fetch(`${session.url}previews/apple-secret.webp`))
      .toMatchObject({ status: 404 });
    await session.close();
    await expect(session.selection).rejects.toThrow("closed");
  });

  it("rejects duplicate concurrent selection attempts", async () => {
    const session = await startGallery({
      galleryRoot: await galleryRoot(),
      timeoutMs: 2_000,
    });
    const responses = await Promise.all([
      post(session.url, "apple"),
      post(session.url, "vercel"),
    ]);
    expect(responses.map((response) => response.status).sort()).toEqual([204, 409]);
    expect(["apple", "vercel"]).toContain(await session.selection);
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
