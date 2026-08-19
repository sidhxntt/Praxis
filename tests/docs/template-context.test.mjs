import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  formatResolvedContext,
  loadContextMap,
  resolveContext,
  validateContextMap,
} from "../../scripts/template-context-lib.mjs";

const root = path.resolve(import.meta.dirname, "../..");
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

test("context map covers every architecture family and infrastructure target", async () => {
  const map = await loadContextMap(root);
  assert.equal(map.schemaVersion, 1);
  for (const id of [
    "standard-frontend",
    "standard-express",
    "standard-fullstack",
    "pro-django",
    "pro-gin",
    "pro-compose",
    "pro-kubernetes",
    "pro-terraform-shared",
    "pro-terraform-aws",
    "pro-terraform-azure",
    "pro-terraform-gcp",
  ]) assert.ok(map.bundles[id], `missing ${id}`);
});

test("standard configuration resolves ordered frontend, backend, and integration context", async () => {
  const map = await loadContextMap(root);
  const result = resolveContext(map, {
    schemaVersion: 1,
    projectName: "acme",
    projectType: "fullstack",
    packageManager: "npm",
    frontend: { framework: "next", language: "typescript", styling: "tailwind-shadcn", ui: { mode: "template", style: "apple" } },
    backend: { framework: "express", language: "typescript", database: "postgres", auth: "self-hosted", cache: "redis" },
    deployment: ["docker"],
  });
  assert.deepEqual(result.bundleIds.slice(0, 3), [
    "template-foundations",
    "standard-frontend",
    "standard-express",
  ]);
  for (const id of ["standard-fullstack", "standard-database", "standard-auth", "standard-cache", "standard-docker"])
    assert.ok(result.bundleIds.includes(id), `missing resolved ${id}`);
  for (const source of [
    "cli/templates/frontend.next",
    "cli/templates/ui.apple",
    "cli/templates/backend.express",
    "cli/templates/database.postgres",
    "cli/templates/auth.self-hosted",
    "cli/templates/cache.redis",
    "cli/templates/deployment.docker",
  ]) assert.ok(result.sources.includes(source), `missing selected source ${source}`);
});

test("Pro configuration resolves capability prerequisites and selected Terraform cloud", async () => {
  const map = await loadContextMap(root);
  const result = resolveContext(map, {
    schemaVersion: 2,
    projectName: "acme-pro",
    projectType: "pro-backend",
    packageManager: "npm",
    deployment: [],
    pro: {
      stack: "python-django",
      requestedCapabilities: ["scheduled-jobs", "terraform"],
      resolvedCapabilities: [
        "redis-cache", "background-jobs", "scheduled-jobs", "kubernetes", "terraform",
        "autoscaling", "high-availability", "edge-protection", "database-resilience", "cloud-secrets",
      ],
      cloud: "aws",
    },
  });
  const redis = result.bundleIds.indexOf("capability-redis-cache");
  const jobs = result.bundleIds.indexOf("capability-background-jobs");
  const scheduled = result.bundleIds.indexOf("capability-scheduled-jobs");
  assert.ok(redis >= 0 && redis < jobs && jobs < scheduled);
  assert.ok(result.bundleIds.includes("pro-terraform-shared"));
  assert.ok(result.bundleIds.includes("pro-terraform-aws"));
});

test("text and JSON formats expose identical ordered bundle membership", async () => {
  const map = await loadContextMap(root);
  const result = resolveContext(map, { bundles: ["pro-gin", "pro-kubernetes"] });
  const json = JSON.parse(formatResolvedContext(result, "json"));
  const text = formatResolvedContext(result, "text");
  assert.deepEqual(json.bundleIds, result.bundleIds);
  for (const id of result.bundleIds) assert.match(text, new RegExp(`(?:^|\\n)- ${id}(?:\\n|$)`));
});

test("unknown bundle selections fail instead of returning partial context", async () => {
  const map = await loadContextMap(root);
  assert.throws(() => resolveContext(map, { bundles: ["not-real"] }), /unknown context bundle/i);
});

test("unknown configuration selections fail instead of inventing source paths", async () => {
  const map = await loadContextMap(root);
  assert.throws(() => resolveContext(map, {
    schemaVersion: 1,
    projectType: "frontend",
    frontend: { framework: "not-a-framework", ui: { mode: "none" } },
    deployment: [],
  }), /unsupported frontend framework/i);
  assert.throws(() => resolveContext(map, {
    schemaVersion: 1,
    projectType: "frontend",
    frontend: { framework: "next", ui: { mode: "template", style: "not-a-style" } },
    deployment: [],
  }), /unsupported UI style/i);
});

test("resolved Wiki URLs preserve canonical acronym casing", async () => {
  const map = await loadContextMap(root);
  const result = resolveContext(map, { bundles: ["standard-ui"] });
  const uiPage = result.pages.find(({ localPath }) => localPath === "docs/ui-templates.md");
  assert.equal(uiPage.wikiUrl, "https://github.com/sidhxntt/Praxis/wiki/UI-Templates");
});

test("context validation reports missing capability coverage", async () => {
  const map = structuredClone(await loadContextMap(root));
  delete map.capabilityBundles["jwt-auth"];
  const failures = await validateContextMap(map, root);
  assert.ok(failures.some((failure) => failure.includes("jwt-auth")));
});

test("CLI resolves a config in both output modes", async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "praxis-context-"));
  const configPath = path.join(directory, "praxis.config.json");
  await writeFile(configPath, JSON.stringify({
    schemaVersion: 1,
    projectName: "api",
    projectType: "backend",
    packageManager: "npm",
    backend: { framework: "express", language: "typescript", database: "none", auth: "none", cache: "none" },
    deployment: [],
  }));
  const { spawnSync } = await import("node:child_process");
  const textResult = spawnSync(process.execPath, ["scripts/resolve-template-context.mjs", "--config", configPath], { cwd: root, encoding: "utf8" });
  const jsonResult = spawnSync(process.execPath, ["scripts/resolve-template-context.mjs", "--config", configPath, "--json"], { cwd: root, encoding: "utf8" });
  assert.equal(textResult.status, 0, textResult.stderr);
  assert.equal(jsonResult.status, 0, jsonResult.stderr);
  const json = JSON.parse(jsonResult.stdout);
  for (const id of json.bundleIds) assert.match(textResult.stdout, new RegExp(`(?:^|\\n)- ${id}(?:\\n|$)`));
});

test("Home and sidebar establish the two-domain Wiki", async () => {
  const home = await readFile(path.join(root, "docs/index.md"), "utf8");
  const sidebar = await readFile(path.join(root, "docs/_Sidebar.md"), "utf8");
  for (const content of [home, sidebar]) {
    assert.match(content, /Praxis Core Internals/);
    assert.match(content, /Praxis Template Architecture/);
    assert.match(content, /Template Agent Guide/);
  }
  assert.match(home, /flowchart/);
  assert.match(home, /not (?:a )?runtime dependency/i);
  assert.match(home, /Standard Praxis/);
  assert.match(home, /Praxis Pro/);
});

test("major backend pages satisfy the shared architecture contract", async () => {
  const headings = [
    "Generated directory map",
    "Runtime entry points",
    "Request lifecycle",
    "Dependency wiring",
    "Startup, readiness, and shutdown",
    "Capability integration",
    "Infrastructure relationship",
    "Extension points",
    "Authoritative sources and tests",
  ];
  for (const file of ["express-architecture.md", "django-architecture.md", "gin-architecture.md"]) {
    const markdown = await readFile(path.join(root, "docs", file), "utf8");
    for (const heading of headings) assert.match(markdown, new RegExp(`## ${heading}`), `${file} lacks ${heading}`);
  }
});

test("renderer registers every context page and both domain overviews", async () => {
  const renderer = await readFile(path.join(root, "scripts/render-github-wiki.mjs"), "utf8");
  const map = await loadContextMap(root);
  const expected = new Set([
    "docs/core-internals.md",
    "docs/template-architecture.md",
    "docs/template-agent-guide.md",
    ...Object.values(map.bundles).flatMap((bundle) => bundle.pages),
  ]);
  for (const page of expected) {
    assert.match(renderer, new RegExp(`"${escapeRegExp(path.basename(page))}"`), `renderer omits ${page}`);
  }
});

test("Wiki workflow watches context tooling and publishes every rendered page", async () => {
  const workflow = await readFile(path.join(root, ".github/workflows/wiki.yml"), "utf8");
  const renderer = await readFile(path.join(root, "scripts/render-github-wiki.mjs"), "utf8");
  for (const watched of ["scripts/check-template-context.mjs", "scripts/template-context-lib.mjs", "scripts/resolve-template-context.mjs", "tests/docs/**", "AGENTS.md", "CLAUDE.md"]) {
    assert.match(workflow, new RegExp(escapeRegExp(watched)), `workflow does not watch ${watched}`);
  }
  const destinations = [...renderer.matchAll(/\["[^"]+\.md", "([^"]+\.md)"\]/g)].map((match) => match[1]);
  for (const destination of destinations) assert.match(workflow, new RegExp(`\\b${escapeRegExp(destination)}\\b`), `workflow does not publish ${destination}`);
});

test("Codex and Claude Code bootstrap into one canonical template guide", async () => {
  const agents = await readFile(path.join(root, "AGENTS.md"), "utf8");
  const claude = await readFile(path.join(root, "CLAUDE.md"), "utf8");
  const guide = await readFile(path.join(root, "docs/template-agent-guide.md"), "utf8");
  for (const instructions of [agents, claude]) {
    assert.match(instructions, /docs\/template-agent-guide\.md/);
    assert.match(instructions, /resolve-template-context\.mjs/);
  }
  assert.match(claude, /@AGENTS\.md/);
  for (const phrase of [
    "Read the agent instructions",
    "Read the Template Agent Guide",
    "Resolve the context bundle",
    "Read every required architecture page",
    "Inspect authoritative sources",
    "State the loaded context",
    "Run every required verification command",
  ]) assert.match(guide, new RegExp(phrase, "i"));
});

test("Agent Guide provides a reusable prompt for new coding-agent sessions", async () => {
  const guide = await readFile(path.join(root, "docs/agent-guide.md"), "utf8");

  assert.match(guide, /## Prompt for a new agent session/);
  assert.match(guide, /Read `AGENTS\.md` and `docs\/template-agent-guide\.md` completely/);
  assert.match(guide, /resolve-template-context\.mjs --config/);
  assert.match(guide, /--bundle <id>/);
  assert.match(guide, /State the loaded bundle/);
  assert.match(guide, /run every returned verification command/i);
  assert.match(guide, /GitHub-only/i);
});
