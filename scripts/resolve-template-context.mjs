#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { formatResolvedContext, loadContextMap, resolveContext } from "./template-context-lib.mjs";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
let configPath;
let json = false;
const bundles = [];
for (let index = 0; index < args.length; index += 1) {
  const argument = args[index];
  if (argument === "--json") json = true;
  else if (argument === "--config") configPath = args[++index];
  else if (argument === "--bundle") bundles.push(args[++index]);
  else throw new Error(`Unknown argument: ${argument}`);
}
if (configPath && bundles.length > 0) throw new Error("Use either --config or --bundle, not both");
if (!configPath && bundles.length === 0) {
  console.error("Usage: node scripts/resolve-template-context.mjs (--config <praxis.config.json> | --bundle <id>...) [--json]");
  process.exit(2);
}
try {
  const map = await loadContextMap(repositoryRoot);
  const input = configPath
    ? JSON.parse(await readFile(path.resolve(configPath), "utf8"))
    : { bundles };
  process.stdout.write(formatResolvedContext(resolveContext(map, input), json ? "json" : "text"));
} catch (error) {
  console.error(`Unable to resolve Praxis template context: ${error.message}`);
  process.exit(1);
}
