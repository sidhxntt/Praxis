#!/usr/bin/env node

import { execFile } from "node:child_process";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";

const run = promisify(execFile);
const repository = path.resolve(".");
const templates = path.join(repository, "templates");

async function main() {
  const temporary = await mkdtemp(path.join(os.tmpdir(), "praxis-ui-verify-"));
  try {
    await run(process.execPath, [
      path.join(repository, "scripts/ui/generate.mjs"),
      "--templates-root", templates,
      "--output", temporary,
    ]);
    const expected = await generatedSnapshot(templates);
    const actual = await generatedSnapshot(temporary);
    const stale = new Set([...Object.keys(expected), ...Object.keys(actual)]);
    const differences = [...stale].filter((file) => expected[file] !== actual[file]).sort();
    if (differences.length > 0) {
      for (const file of differences) process.stderr.write(`stale generated file: ${file}\n`);
      process.exitCode = 1;
      return;
    }
    process.stdout.write(`UI adapter sources are current (${Object.keys(expected).length} files).\n`);
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
}

async function generatedSnapshot(root) {
  const snapshot = {};
  for (const entry of await readdir(root, { withFileTypes: true })) {
    if (entry.isDirectory() && entry.name.startsWith("ui.") && !["ui.shared", "ui.catalog"].includes(entry.name)) {
      await addTree(snapshot, root, path.join(entry.name, "files"));
      await addFile(snapshot, root, path.join(entry.name, "manifest.json"));
    }
  }
  return snapshot;
}

async function addTree(snapshot, root, relative) {
  for (const entry of await readdir(path.join(root, relative), { withFileTypes: true })) {
    const child = path.join(relative, entry.name);
    if (entry.isDirectory()) await addTree(snapshot, root, child);
    else await addFile(snapshot, root, child);
  }
}

async function addFile(snapshot, root, relative) {
  snapshot[relative.split(path.sep).join("/")] = (await readFile(path.join(root, relative))).toString("base64");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
