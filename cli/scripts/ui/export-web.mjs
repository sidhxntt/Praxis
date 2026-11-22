#!/usr/bin/env node
// Publishes the UI templates to the Praxis website (../web): the live preview
// pages under public/templates/live/, the gallery screenshots under
// public/templates/previews/, every template's pictures under
// public/design/websites/ (where the heroes look for them), and
// lib/ui-templates.json, which the site's Templates section reads.
import { access, cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildLivePreviews } from "./build-live.mjs";

const cliRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const templatesRoot = path.join(cliRoot, "templates");

export async function exportToWeb(webRoot = path.resolve(cliRoot, "../web")) {
  try {
    await access(path.join(webRoot, "package.json"));
  } catch {
    return undefined;
  }
  const publicRoot = path.join(webRoot, "public");
  const ids = await buildLivePreviews({ base: "/templates/live/", outDir: path.join(publicRoot, "templates", "live") });

  const previews = path.join(publicRoot, "templates", "previews");
  await rm(previews, { recursive: true, force: true });
  await cp(path.join(templatesRoot, "ui.catalog", "gallery", "previews"), previews, { recursive: true });

  let pictures = 0;
  for (const id of ids) {
    const source = path.join(templatesRoot, `ui.${id}`, "files", "shared", "public", "design", "websites");
    let folders = [];
    try { folders = await readdir(source); } catch { continue; }
    for (const folder of folders) {
      await mkdir(path.join(publicRoot, "design", "websites", folder), { recursive: true });
      for (const file of await readdir(path.join(source, folder))) {
        await cp(path.join(source, folder, file), path.join(publicRoot, "design", "websites", folder, file));
        pictures += 1;
      }
    }
  }

  const catalog = JSON.parse(await readFile(path.join(templatesRoot, "ui.catalog", "catalog.json"), "utf8"));
  const data = catalog.map(({ id, label, description, traits, theme, previews: shots }) => ({
    id,
    label,
    description,
    traits,
    theme,
    thumbnail: `/templates/${shots.thumbnail.path}`,
    desktop: `/templates/${shots.desktop.path}`,
    mobile: `/templates/${shots.mobile.path}`,
    live: `/templates/live/${id}/index.html`,
  }));
  await writeFile(path.join(webRoot, "lib", "ui-templates.json"), `${JSON.stringify(data, null, 2)}\n`);
  return { templates: ids.length, pictures };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await exportToWeb();
  if (!result) console.log("No ../web project found; nothing exported.");
  else console.log(`Website updated: ${result.templates} templates, ${result.pictures} pictures.`);
}
