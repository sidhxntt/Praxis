import { execFile } from "node:child_process";
import { cp, readdir, rm } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { buildLivePreviews } from "./build-live.mjs";
import { exportToWeb } from "./export-web.mjs";

const run = promisify(execFile);
const require = createRequire(import.meta.url);
const scriptRoot = path.dirname(fileURLToPath(import.meta.url));
const cliRoot = path.resolve(scriptRoot, "../..");
const sourceRoot = path.join(cliRoot, "gallery-app");
const outputRoot = path.join(sourceRoot, "out");
const targetRoot = path.join(cliRoot, "templates/ui.catalog/gallery");
const nextBin = require.resolve("next/dist/bin/next", {
  paths: [cliRoot, path.resolve(cliRoot, ".."), path.resolve(cliRoot, "../web")],
});

await run(process.execPath, [nextBin, "build", sourceRoot], {
  cwd: cliRoot,
  env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
  maxBuffer: 20 * 1024 * 1024,
});

for (const entry of await readdir(targetRoot)) {
  if (entry !== "previews" && entry !== "live") {
    await rm(path.join(targetRoot, entry), { recursive: true, force: true });
  }
}

await cp(path.join(outputRoot, "index.html"), path.join(targetRoot, "index.html"));
await cp(path.join(outputRoot, "_next"), path.join(targetRoot, "_next"), { recursive: true });

const live = await buildLivePreviews();
console.log(`Next.js gallery export and ${live.length} live previews are current.`);
const web = await exportToWeb();
if (web) console.log(`Website templates updated (${web.templates} templates, ${web.pictures} pictures).`);
