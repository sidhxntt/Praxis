#!/usr/bin/env node
// Downloads every UI template's pictures (listed in templates/ui.<id>/template.json)
// into templates/ui.<id>/files/shared/public/<path>, which generated projects
// serve from public/. Existing files are kept unless you pass --force.
//
//   npm run ui:images            all templates
//   npm run ui:images -- ora     one template
import { access, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const cliRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const templatesRoot = path.join(cliRoot, "templates");
const args = process.argv.slice(2);
const force = args.includes("--force");
const only = args.filter((arg) => !arg.startsWith("--"));

const modules = (await readdir(templatesRoot))
  .filter((name) => name.startsWith("ui.") && name !== "ui.catalog")
  .filter((name) => only.length === 0 || only.includes(name.slice(3)));

let fetched = 0;
let kept = 0;
const failed = [];
for (const name of modules) {
  let template;
  try {
    template = JSON.parse(await readFile(path.join(templatesRoot, name, "template.json"), "utf8"));
  } catch {
    continue;
  }
  for (const image of template.images) {
    const destination = path.join(templatesRoot, name, "files", "shared", "public", image.path);
    if (!force && await exists(destination)) {
      kept += 1;
      continue;
    }
    try {
      const response = await fetch(image.url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const bytes = Buffer.from(await response.arrayBuffer());
      if (bytes.length === 0) throw new Error("empty response");
      await mkdir(path.dirname(destination), { recursive: true });
      await writeFile(destination, bytes);
      fetched += 1;
      console.log(`${template.id}: ${image.path} (${Math.round(bytes.length / 1024)} KB)`);
    } catch (error) {
      failed.push(`${template.id}: ${image.url} (${error instanceof Error ? error.message : error})`);
    }
  }
}

console.log(`\n${fetched} downloaded, ${kept} already present, ${failed.length} failed.`);
if (failed.length) {
  console.error(failed.join("\n"));
  process.exitCode = 1;
}

async function exists(file) {
  try { await access(file); return true; } catch { return false; }
}
