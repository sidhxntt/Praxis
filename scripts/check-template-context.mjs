#!/usr/bin/env node

import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadContextMap, validateContextMap } from "./template-context-lib.mjs";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const failures = await validateContextMap(await loadContextMap(repositoryRoot), repositoryRoot);
if (failures.length > 0) {
  console.error(`Invalid Praxis template context:\n${failures.map((failure) => `- ${failure}`).join("\n")}`);
  process.exit(1);
}
console.log("Praxis template context is complete and valid.");
