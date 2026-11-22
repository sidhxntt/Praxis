#!/usr/bin/env node
// Renders every UI template's hero in Chromium and writes the gallery previews
// (desktop 1440×900, mobile 390×844, thumbnail 640×400) plus catalog.json.
// Each hero is bundled with Vite exactly as a generated project would ship it,
// with its pictures served from public/. Previews use reduced motion, which
// every hero answers with one finished still frame.
//
// Run `npm run ui:images` first so the pictures are there.
import { createHash } from "node:crypto";
import { createServer } from "node:http";
import { access, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import sharp from "sharp";
import { build } from "vite";

const cliRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const templatesRoot = path.join(cliRoot, "templates");
const outputOption = process.argv.indexOf("--output");
if (outputOption >= 0 && !process.argv[outputOption + 1]) {
  throw new Error("--output requires a directory");
}
const catalogRoot = path.resolve(
  outputOption >= 0 ? process.argv[outputOption + 1] : path.join(templatesRoot, "ui.catalog"),
);
const previewsRoot = path.join(catalogRoot, "gallery", "previews");
const workRoot = path.join(cliRoot, "node_modules", ".cache", "praxis-ui-previews");
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
  const missing = [];
  try {
    for (const [index, id] of ids.entries()) {
      const template = JSON.parse(await readFile(path.join(templatesRoot, `ui.${id}`, "template.json"), "utf8"));
      for (const image of template.images) {
        if (!await exists(path.join(templatesRoot, `ui.${id}`, "files", "shared", "public", image.path))) {
          missing.push(`${id}: public/${image.path}`);
        }
      }
      const site = await bundle(id, template);
      const server = await serve(site);
      const alt = `${template.name} landing page preview`;
      try {
        const desktop = await capture(browser, server.url, id, "desktop");
        const mobile = await capture(browser, server.url, id, "mobile");
        const thumbnailPath = path.join(previewsRoot, `${id}-thumbnail.webp`);
        await sharp(await readFile(desktop.absolute))
          .resize(640, 400, { fit: "cover", position: "top" })
          .webp({ quality: 80, effort: 6 })
          .toFile(thumbnailPath);
        catalog.push({
          id,
          label: template.name,
          description: template.description,
          traits: template.traits,
          theme: template.theme,
          previews: {
            thumbnail: await previewRecord(`${id}-thumbnail.webp`, 640, 400, alt),
            desktop: await previewRecord(path.basename(desktop.absolute), desktop.width, desktop.height, alt),
            mobile: await previewRecord(path.basename(mobile.absolute), mobile.width, mobile.height, alt),
          },
        });
      } finally {
        await server.close();
      }
      process.stdout.write(`Rendered ${index + 1}/${ids.length}: ${id}\n`);
    }
  } finally {
    await browser.close();
    await rm(workRoot, { recursive: true, force: true });
  }
  await writeFile(path.join(catalogRoot, "catalog.json"), `${JSON.stringify(catalog, null, 2)}\n`);
  if (missing.length) {
    console.warn(`\nRendered without ${missing.length} missing picture(s); run \`npm run ui:images\` and render again:\n${missing.join("\n")}`);
  }
}

async function bundle(id, template) {
  const root = path.join(workRoot, id);
  const outDir = path.join(root, "dist");
  await rm(root, { recursive: true, force: true });
  await mkdir(root, { recursive: true });
  const component = path.join(templatesRoot, `ui.${id}`, "files", "vite-ts", "src", "components", `${template.component}.tsx`);
  await writeFile(path.join(root, "index.html"), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${template.name}</title><style>html,body{margin:0}</style></head><body><div id="root"></div><script type="module" src="./main.tsx"></script></body></html>`);
  await writeFile(path.join(root, "main.tsx"), `import { createRoot } from "react-dom/client";\nimport Hero from ${JSON.stringify(component)};\ncreateRoot(document.getElementById("root")!).render(<Hero />);\n`);
  await build({
    root,
    configFile: false,
    logLevel: "error",
    publicDir: path.join(templatesRoot, `ui.${id}`, "files", "shared", "public"),
    resolve: { dedupe: ["react", "react-dom"] },
    oxc: { jsx: { runtime: "automatic" } },
    build: { outDir, emptyOutDir: true },
  });
  return outDir;
}

function serve(root) {
  const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".webp": "image/webp", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".woff2": "font/woff2" };
  const server = createServer(async (request, response) => {
    const pathname = decodeURIComponent(new URL(request.url ?? "/", "http://127.0.0.1").pathname);
    const file = path.resolve(root, `.${pathname === "/" ? "/index.html" : pathname}`);
    if (!file.startsWith(root)) return response.writeHead(404).end();
    try {
      const bytes = await readFile(file);
      response.writeHead(200, { "content-type": types[path.extname(file)] ?? "application/octet-stream" }).end(bytes);
    } catch {
      response.writeHead(404).end();
    }
  });
  return new Promise((resolve) => server.listen(0, "127.0.0.1", () => resolve({
    url: `http://127.0.0.1:${server.address().port}/`,
    close: () => new Promise((done) => server.close(() => done())),
  })));
}

async function capture(browser, url, id, kind) {
  const context = await browser.newContext({
    viewport: dimensions[kind],
    colorScheme: "light",
    reducedMotion: "reduce",
    locale: "en-US",
    timezoneId: "UTC",
    deviceScaleFactor: 1,
  });
  try {
    const page = await context.newPage();
    await page.goto(url, { waitUntil: "load" });
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map((image) => image.complete ? null : new Promise((done) => { image.onload = image.onerror = done; })));
    });
    await page.waitForTimeout(1200);
    const png = await page.screenshot({ type: "png", animations: "disabled" });
    const absolute = path.join(previewsRoot, `${id}-${kind}.webp`);
    await sharp(png).webp({ quality: 82, effort: 6 }).toFile(absolute);
    const metadata = await sharp(png).metadata();
    return { absolute, width: metadata.width, height: metadata.height };
  } finally {
    await context.close();
  }
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

// Lets WebGL heroes draw in headless Chromium even without a GPU.
const args = ["--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"];

async function launchBrowser() {
  const executablePath = process.env.PRAXIS_CHROME_EXECUTABLE;
  if (executablePath) return chromium.launch({ headless: true, executablePath, args });
  try {
    return await chromium.launch({ headless: true, args });
  } catch (error) {
    if (process.platform !== "darwin") throw error;
  }
  const macChrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  if (process.platform === "darwin" && await exists(macChrome)) {
    return chromium.launch({ headless: true, executablePath: macChrome, args });
  }
  throw new Error("Playwright Chromium is unavailable; run `npx playwright install chromium`");
}

async function exists(file) {
  try { await access(file); return true; } catch { return false; }
}

async function discoverStyles() {
  const source = await readFile(path.join(cliRoot, "src/ui/catalog.ts"), "utf8");
  const block = source.match(/UI_STYLE_IDS\s*=\s*\[([\s\S]*?)\]\s*as const/)?.[1];
  if (!block) throw new Error("could not read UI_STYLE_IDS from src/ui/catalog.ts");
  return [...block.matchAll(/"([a-z0-9-]+)"/g)].map((match) => match[1]);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack : error);
  process.exitCode = 1;
});
