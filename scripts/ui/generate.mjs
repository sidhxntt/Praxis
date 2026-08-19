#!/usr/bin/env node

import { cp, mkdir, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadStyle } from "./lib/load-style.mjs";
import { renderAngularComponent, renderAngularTemplate } from "./lib/render-angular.mjs";
import { renderAstro } from "./lib/render-astro.mjs";
import { renderCss } from "./lib/render-css.mjs";
import { renderDesignDoc } from "./lib/render-design-doc.mjs";
import { renderPageMarkup } from "./lib/render-html.mjs";
import { renderNext, renderVite } from "./lib/render-react.mjs";
import { renderVue } from "./lib/render-vue.mjs";

const TARGETS = [
  "next-js",
  "next-ts",
  "vite-js",
  "vite-ts",
  "vue-js",
  "vue-ts",
  "astro-js",
  "astro-ts",
  "angular-ts",
];

export async function generateStyleAdapters({ templatesRoot, outputRoot, id }) {
  const { moduleRoot, style } = await loadStyle(templatesRoot, id);
  const filesRoot = path.join(path.resolve(outputRoot), `ui.${id}`, "files");
  await rm(filesRoot, { recursive: true, force: true });
  const markup = renderPageMarkup(style);
  const css = renderCss(style);

  for (const target of TARGETS) {
    await writeTarget(filesRoot, target, markup, css);
  }

  await write(
    path.join(path.resolve(outputRoot), `ui.${id}`, "manifest.json"),
    `${JSON.stringify(renderManifest(id), null, 2)}\n`,
  );

  const shared = path.join(filesRoot, "shared");
  await write(path.join(shared, "DESIGN.md"), await renderDesignDoc(moduleRoot));
  for (const asset of style.assets) {
    const relative = asset.source.slice("assets/".length);
    const source = path.join(moduleRoot, asset.source);
    const destination = path.join(shared, "public", "ui", id, relative);
    await mkdir(path.dirname(destination), { recursive: true });
    await cp(source, destination);
  }
}

function renderManifest(id) {
  const overlays = [{ scope: "frontend", source: "files/shared" }];
  for (const target of TARGETS) {
    const separator = target.lastIndexOf("-");
    const framework = target.slice(0, separator);
    const language = target.slice(separator + 1) === "ts" ? "typescript" : "javascript";
    overlays.push({
      scope: "frontend",
      source: `files/${target}`,
      framework,
      language,
      replace: true,
    });
  }
  return { id: `ui.${id}`, overlays };
}

async function writeTarget(root, target, markup, css) {
  const directory = path.join(root, target);
  if (target === "next-js" || target === "next-ts") {
    const language = target.endsWith("-ts") ? "typescript" : "javascript";
    const extension = language === "typescript" ? "tsx" : "jsx";
    await write(path.join(directory, `app/page.${extension}`), renderNext(markup, language));
    await write(path.join(directory, "app/globals.css"), `${css}\n`);
    return;
  }
  if (target === "vite-js" || target === "vite-ts") {
    const extension = target.endsWith("-ts") ? "tsx" : "jsx";
    await write(path.join(directory, `src/App.${extension}`), renderVite(markup));
    await write(path.join(directory, "src/index.css"), `${css}\n`);
    return;
  }
  if (target === "vue-js" || target === "vue-ts") {
    const language = target.endsWith("-ts") ? "typescript" : "javascript";
    await write(path.join(directory, "src/App.vue"), renderVue(markup, language));
    await write(path.join(directory, "src/index.css"), `${css}\n`);
    return;
  }
  if (target === "astro-js" || target === "astro-ts") {
    await write(path.join(directory, "src/pages/index.astro"), renderAstro(markup));
    await write(path.join(directory, "src/styles/global.css"), `${css}\n`);
    return;
  }
  if (target === "angular-ts") {
    await write(path.join(directory, "src/app/app.ts"), renderAngularComponent());
    await write(path.join(directory, "src/app/app.html"), renderAngularTemplate(markup));
    await write(path.join(directory, "src/styles.css"), `${css}\n`);
    return;
  }
  throw new Error(`unsupported adapter target "${target}"`);
}

async function write(file, contents) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, contents, "utf8");
}

async function discoverStyles(templatesRoot) {
  return (await readdir(templatesRoot, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory() && entry.name.startsWith("ui.") && entry.name !== "ui.shared" && entry.name !== "ui.catalog")
    .map((entry) => entry.name.slice(3))
    .sort();
}

function parseArgs(args) {
  const options = {};
  for (let index = 0; index < args.length; index += 1) {
    const key = args[index];
    if (!["--style", "--templates-root", "--output"].includes(key)) {
      throw new Error(`unknown argument "${key}"`);
    }
    const value = args[index + 1];
    if (!value || value.startsWith("--")) throw new Error(`${key} requires a value`);
    options[key.slice(2)] = value;
    index += 1;
  }
  return options;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const templatesRoot = path.resolve(args["templates-root"] ?? "templates");
  const outputRoot = path.resolve(args.output ?? templatesRoot);
  const ids = args.style ? [args.style] : await discoverStyles(templatesRoot);
  for (const id of ids) await generateStyleAdapters({ templatesRoot, outputRoot, id });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
