import { readFile } from "node:fs/promises";
import path from "node:path";

export async function loadStyle(templatesRoot, id) {
  if (!/^[a-z0-9][a-z0-9-]*$/.test(id)) throw new Error(`invalid style id "${id}"`);
  const moduleRoot = path.join(path.resolve(templatesRoot), `ui.${id}`);
  const style = JSON.parse(await readFile(path.join(moduleRoot, "style.json"), "utf8"));
  if (style.id !== id) throw new Error(`style id mismatch for ${id}`);
  if (!Array.isArray(style.sections) || style.sections.length < 7) {
    throw new Error(`${id} must define at least seven sections`);
  }
  const ids = new Set();
  for (const section of style.sections) {
    if (!section.id || ids.has(section.id)) throw new Error(`${id} has invalid section ids`);
    ids.add(section.id);
  }
  for (const asset of style.assets ?? []) {
    if (
      typeof asset.source !== "string"
      || !asset.source.startsWith("assets/")
      || asset.source.includes("..")
      || asset.source.includes("://")
    ) {
      throw new Error(`${id} contains an unsafe asset source`);
    }
  }
  return { moduleRoot, style };
}
