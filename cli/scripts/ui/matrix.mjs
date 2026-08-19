#!/usr/bin/env node

import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { mkdtemp, readFile, rm, symlink } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const TARGETS = [
  { id: "next-js", framework: "next", language: "javascript", entry: "app/page.jsx" },
  { id: "next-ts", framework: "next", language: "typescript", entry: "app/page.tsx" },
  { id: "vite-js", framework: "vite", language: "javascript", entry: "src/App.jsx" },
  { id: "vite-ts", framework: "vite", language: "typescript", entry: "src/App.tsx" },
  { id: "vue-js", framework: "vue", language: "javascript", entry: "src/App.vue" },
  { id: "vue-ts", framework: "vue", language: "typescript", entry: "src/App.vue" },
  { id: "astro-js", framework: "astro", language: "javascript", entry: "src/pages/index.astro" },
  { id: "astro-ts", framework: "astro", language: "typescript", entry: "src/pages/index.astro" },
  { id: "angular-ts", framework: "angular", language: "typescript", entry: "src/app/app.html" },
];

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const target = resolveTarget(options);
  const repository = path.resolve(".");
  const require = createRequire(import.meta.url);
  require("ts-node/register");
  const { generateProject } = require(path.join(repository, "src/generator/generate.ts"));
  const { validateConfig } = require(path.join(repository, "src/config/schema.ts"));
  const catalog = JSON.parse(
    await readFile(path.join(repository, "templates/ui.catalog/catalog.json"), "utf8"),
  );
  const styles = [undefined, ...catalog.map(({ id }) => id)];
  const root = await mkdtemp(path.join(os.tmpdir(), `praxis-ui-${target.id}-`));
  let dependencyRoot;
  let complete = false;
  try {
    for (const [index, style] of styles.entries()) {
      const name = style ? `${target.id}-${style}` : `${target.id}-starter`;
      const config = validateConfig({
        schemaVersion: 1,
        name,
        projectType: "frontend",
        language: target.language,
        frontend: {
          framework: target.framework,
          styling: "tailwind-shadcn",
          ui: style ? { mode: "template", style } : { mode: "starter" },
        },
        deployment: [],
        packageManager: "npm",
        installDependencies: false,
        initializeGit: false,
      });
      const output = await generateProject(config, {
        cwd: root,
        templatesRoot: path.join(repository, "templates"),
      });
      await readFile(path.join(output, target.entry));
      if (options.install && !dependencyRoot) {
        await command("npm", ["install", "--no-audit", "--no-fund"], output);
        dependencyRoot = output;
      } else if (options.install) {
        await symlink(path.join(dependencyRoot, "node_modules"), path.join(output, "node_modules"), "junction");
      }
      if (options.build) await command("npm", ["run", "build"], output);
      process.stdout.write(`[${index + 1}/${styles.length}] ${name}${options.build ? " built" : " generated"}\n`);
      if (!options.keep && output !== dependencyRoot) await rm(output, { recursive: true, force: true });
    }
    complete = true;
    process.stdout.write(`Verified ${styles.length} ${target.id} outputs.\n`);
  } finally {
    if (complete && !options.keep) await rm(root, { recursive: true, force: true });
    else if (!complete || options.keep) process.stderr.write(`Matrix workspace: ${root}\n`);
  }
}

function parseArgs(args) {
  const options = { install: false, build: false, keep: false };
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (["--install", "--build", "--keep"].includes(argument)) {
      options[argument.slice(2)] = true;
      continue;
    }
    if (["--shard", "--target"].includes(argument)) {
      const value = args[++index];
      if (!value) usage(`${argument} requires a value`);
      options[argument.slice(2)] = value;
      continue;
    }
    usage(`unknown argument "${argument}"`);
  }
  if (options.build && !options.install) usage("--build requires --install");
  return options;
}

function resolveTarget(options) {
  if (options.shard && options.target) usage("choose either --shard or --target");
  if (options.target) {
    const target = TARGETS.find(({ id }) => id === options.target);
    if (!target) usage(`unknown target "${options.target}"`);
    return target;
  }
  const match = options.shard?.match(/^(\d+)\/(\d+)$/);
  if (!match || Number(match[2]) !== TARGETS.length) {
    usage("--shard must use N/9 syntax");
  }
  const index = Number(match[1]);
  if (index < 1 || index > TARGETS.length) usage("shard index must be between 1 and 9");
  return TARGETS[index - 1];
}

function usage(message) {
  process.stderr.write(`${message}\nUsage: node scripts/ui/matrix.mjs (--shard N/9 | --target ID) [--install --build] [--keep]\n`);
  process.exit(2);
}

function command(executable, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(executable, args, { cwd, stdio: "inherit", shell: false });
    child.once("error", reject);
    child.once("close", (code) => code === 0
      ? resolve()
      : reject(new Error(`${executable} ${args.join(" ")} exited with ${code}`)));
  });
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
