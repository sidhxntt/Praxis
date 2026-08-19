#!/usr/bin/env node

import { access, readdir, readFile } from "node:fs/promises";
import { dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const docsRoot = resolve(repositoryRoot, "docs");
const failures = [];

async function markdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const candidate = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...await markdownFiles(candidate));
    else if (extname(entry.name) === ".md") files.push(candidate);
  }
  return files;
}

for (const file of await markdownFiles(docsRoot)) {
  const markdown = await readFile(file, "utf8");
  for (const match of markdown.matchAll(/\[([^\]]+)]\(([^)\s]+)\)/g)) {
    const href = match[2];
    if (/^(?:https?:|mailto:|#)/i.test(href)) continue;
    const pathPart = href.split("#", 1)[0];
    if (!pathPart) continue;
    const target = resolve(dirname(file), decodeURIComponent(pathPart));
    try {
      await access(target);
    } catch {
      failures.push(`${file.slice(repositoryRoot.length + 1)} -> ${href}`);
    }
  }
}

if (failures.length > 0) {
  console.error(`Broken documentation links:\n${failures.map((item) => `- ${item}`).join("\n")}`);
  process.exit(1);
}

console.log("Documentation links are valid.");
