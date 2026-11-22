#!/usr/bin/env node
// Builds the gallery's live previews: one small page per UI template at
// templates/ui.catalog/gallery/live/<id>/index.html that renders the hero
// exactly as a generated project ships it (the vite-ts component, unchanged),
// with React shared between them in live/assets/. The CLI's gallery server
// serves these pages in the preview dialog, and the pictures straight from
// each template's public/ folder.
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "vite";

const cliRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const templatesRoot = path.join(cliRoot, "templates");
const galleryLive = path.join(templatesRoot, "ui.catalog", "gallery", "live");

/** base: the URL the pages are served under; outDir: where they are written. */
export async function buildLivePreviews({ base = "/live/", outDir = galleryLive } = {}) {
  const workRoot = path.join(cliRoot, "node_modules", ".cache", `praxis-ui-live-${base.replace(/\W+/g, "-")}`);
  const ids = await discoverStyles();
  await rm(workRoot, { recursive: true, force: true });
  const input = {};
  for (const id of ids) {
    const template = JSON.parse(await readFile(path.join(templatesRoot, `ui.${id}`, "template.json"), "utf8"));
    const component = path.join(templatesRoot, `ui.${id}`, "files", "vite-ts", "src", "components", `${template.component}.tsx`);
    const dir = path.join(workRoot, id);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, "index.html"), `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${template.name} · live preview</title>
<style>html,body{margin:0}</style>
</head>
<body>
<div id="root"></div>
<script type="module" src="./main.tsx"></script>
</body>
</html>
`);
    await writeFile(path.join(dir, "main.tsx"), `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Hero from ${JSON.stringify(component)};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Hero />
  </StrictMode>,
);
`);
    input[id] = path.join(dir, "index.html");
  }
  await build({
    root: workRoot,
    base,
    configFile: false,
    logLevel: "error",
    publicDir: false,
    resolve: { dedupe: ["react", "react-dom"] },
    oxc: { jsx: { runtime: "automatic" } },
    build: {
      outDir,
      emptyOutDir: true,
      modulePreload: { polyfill: false },
      rollupOptions: { input },
    },
  });
  await rm(workRoot, { recursive: true, force: true });
  return ids;
}

async function discoverStyles() {
  const source = await readFile(path.join(cliRoot, "src/ui/catalog.ts"), "utf8");
  const block = source.match(/UI_STYLE_IDS\s*=\s*\[([\s\S]*?)\]\s*as const/)?.[1];
  if (!block) throw new Error("could not read UI_STYLE_IDS from src/ui/catalog.ts");
  return [...block.matchAll(/"([a-z0-9-]+)"/g)].map((match) => match[1]);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const ids = await buildLivePreviews();
  console.log(`Built ${ids.length} live previews.`);
}
