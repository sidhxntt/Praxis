#!/usr/bin/env node
// Checks that every UI template ships its hero exactly as its brief gives it:
// the TypeScript component is byte-for-byte the brief's ```tsx block, the
// JavaScript one is that same code with only its types removed, and the
// manifest and template.json agree with the brief.
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseBrief, stripTypes } from "./add-template.mjs";

const cliRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const templatesRoot = path.join(cliRoot, "templates");
const problems = [];
let checked = 0;

for (const name of (await readdir(templatesRoot)).sort()) {
  if (!name.startsWith("ui.") || name === "ui.catalog") continue;
  const root = path.join(templatesRoot, name);
  const brief = parseBrief(await readFile(path.join(root, "brief.txt"), "utf8"));
  const template = JSON.parse(await readFile(path.join(root, "template.json"), "utf8"));
  const js = stripTypes(brief.source, `${brief.component}.tsx`);
  const files = {
    [`files/next-ts/components/${brief.component}.tsx`]: brief.source,
    [`files/vite-ts/src/components/${brief.component}.tsx`]: brief.source,
    [`files/next-js/components/${brief.component}.jsx`]: js,
    [`files/vite-js/src/components/${brief.component}.jsx`]: js,
  };
  for (const [relative, expected] of Object.entries(files)) {
    let actual;
    try { actual = await readFile(path.join(root, relative), "utf8"); } catch { actual = undefined; }
    if (actual !== expected) problems.push(`${name}/${relative} differs from its brief`);
  }
  if (template.name !== brief.name) problems.push(`${name}/template.json name differs from its brief`);
  if (template.component !== brief.component) problems.push(`${name}/template.json component differs from its brief`);
  if (JSON.stringify(template.images) !== JSON.stringify(brief.images)) problems.push(`${name}/template.json pictures differ from its brief`);
  checked += 1;
}

if (problems.length) {
  console.error(problems.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`${checked} UI templates match their briefs exactly.`);
}
