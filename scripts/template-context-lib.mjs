import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";

export async function loadContextMap(repositoryRoot) {
  const map = JSON.parse(await readFile(path.join(repositoryRoot, "docs/template-context.json"), "utf8"));
  const uiCatalog = JSON.parse(await readFile(path.join(repositoryRoot, "cli/templates/ui.catalog/catalog.json"), "utf8"));
  return { ...map, uiStyles: uiCatalog.map(({ id }) => id) };
}

function assertSelection(value, supported, label) {
  if (!supported.includes(value)) throw new Error(`Unsupported ${label}: ${value}`);
}

function validateSelections(map, input) {
  if (input.bundles) return;
  assertSelection(input.projectType, map.selections.projectTypes, "project type");
  if (input.projectType === "pro-backend") {
    assertSelection(input.pro?.stack, map.selections.proStacks, "Pro stack");
    for (const capability of input.pro?.resolvedCapabilities ?? []) {
      if (!map.capabilityBundles[capability]) throw new Error(`Unsupported Pro capability: ${capability}`);
    }
    if (input.pro?.resolvedCapabilities?.includes("terraform")) {
      assertSelection(input.pro?.cloud, map.selections.clouds, "Terraform cloud");
    }
    return;
  }
  if (input.frontend) {
    assertSelection(input.frontend.framework, map.selections.frontends, "frontend framework");
    if (input.frontend.ui?.mode === "template") assertSelection(input.frontend.ui.style, map.uiStyles, "UI style");
  }
  if (input.backend) {
    if (input.backend.framework !== "express") throw new Error(`Unsupported backend framework: ${input.backend.framework}`);
    assertSelection(input.backend.database, map.selections.databases, "database");
    assertSelection(input.backend.auth, map.selections.auth, "authentication provider");
    assertSelection(input.backend.cache, map.selections.cache, "cache provider");
  }
  for (const deployment of input.deployment ?? []) assertSelection(deployment, map.selections.deployments, "deployment target");
}

function requestedBundles(map, input) {
  if (input.bundles) return input.bundles;
  const config = input;
  if (config.projectType === "pro-backend") {
    const ids = [
      config.pro?.stack === "python-django" ? "pro-django" : config.pro?.stack === "go-gin" ? "pro-gin" : undefined,
      "pro-compose",
      ...(config.pro?.resolvedCapabilities ?? []).map((capability) => map.capabilityBundles[capability]),
    ];
    if (config.pro?.resolvedCapabilities?.includes("terraform")) {
      if (!config.pro.cloud) throw new Error("Terraform context requires config.pro.cloud");
      ids.push(`pro-terraform-${config.pro.cloud}`);
    }
    return ids.filter(Boolean);
  }
  const ids = [];
  if (config.frontend) ids.push("standard-frontend");
  if (config.backend) {
    ids.push("standard-express");
    if (config.backend.database !== "none") ids.push("standard-database");
    if (config.backend.auth !== "none") ids.push("standard-auth");
    if (config.backend.cache !== "none") ids.push("standard-cache");
  }
  if (config.frontend) ids.push("standard-ui");
  if (config.projectType === "fullstack") ids.push("standard-fullstack");
  for (const deployment of config.deployment ?? []) {
    ids.push(deployment === "docker" ? "standard-docker" : "standard-deployment");
  }
  return ids;
}

function selectedTemplateSources(input) {
  if (input.bundles) return [];
  if (input.projectType === "pro-backend") {
    const sources = [
      "cli/templates/pro.core",
      input.pro?.stack === "python-django" ? "cli/templates/pro.django" : "cli/templates/pro.gin",
      ...((input.pro?.resolvedCapabilities ?? [])
        .filter((capability) => capability !== "kubernetes" && capability !== "terraform")
        .map((capability) => `cli/templates/pro.capability.${capability}`)),
      "cli/templates/pro.compose",
    ];
    if (input.pro?.resolvedCapabilities?.includes("kubernetes")) sources.push("cli/templates/pro.kubernetes");
    if (input.pro?.resolvedCapabilities?.includes("terraform")) {
      sources.push("cli/templates/pro.terraform.shared", `cli/templates/pro.terraform.${input.pro.cloud}`);
    }
    return sources;
  }
  const sources = [];
  if (input.projectType === "fullstack") sources.push("cli/templates/base.workspace");
  if (input.frontend) {
    sources.push(`cli/templates/frontend.${input.frontend.framework}`, "cli/templates/styling.tailwind-shadcn");
    if (input.frontend.ui?.mode === "template") sources.push(`cli/templates/ui.${input.frontend.ui.style}`);
  }
  if (input.backend) {
    sources.push("cli/templates/backend.express");
    if (input.backend.database !== "none") sources.push(`cli/templates/database.${input.backend.database}`);
    if (input.backend.auth !== "none") sources.push(`cli/templates/auth.${input.backend.auth}`);
    if (input.backend.cache !== "none") sources.push(`cli/templates/cache.${input.backend.cache}`);
  }
  for (const deployment of input.deployment ?? []) sources.push(`cli/templates/deployment.${deployment}`);
  return sources;
}

export function resolveContext(map, input) {
  validateSelections(map, input);
  const ordered = [];
  const visiting = new Set();
  const visited = new Set();
  const add = (id) => {
    const bundle = map.bundles[id];
    if (!bundle) throw new Error(`Unknown context bundle: ${id}`);
    if (visited.has(id)) return;
    if (visiting.has(id)) throw new Error(`Context bundle dependency cycle at ${id}`);
    visiting.add(id);
    for (const required of bundle.requires ?? []) add(required);
    visiting.delete(id);
    visited.add(id);
    ordered.push(id);
  };
  for (const id of requestedBundles(map, input)) add(id);

  const unique = (field) => [...new Set(ordered.flatMap((id) => map.bundles[id][field] ?? []))];
  return {
    schemaVersion: map.schemaVersion,
    bundleIds: ordered,
    bundles: ordered.map((id) => ({ id, title: map.bundles[id].title })),
    pages: unique("pages").map((localPath) => ({
      localPath,
      wikiUrl: `${map.wikiBaseUrl}/${path.basename(localPath, ".md").split("-").map((part) => part === "ui" ? "UI" : part[0].toUpperCase() + part.slice(1)).join("-")}`,
    })),
    sources: [...new Set([...unique("sources"), ...selectedTemplateSources(input)])],
    tests: unique("tests"),
    verify: unique("verify"),
  };
}

export function formatResolvedContext(result, format = "text") {
  if (format === "json") return `${JSON.stringify(result, null, 2)}\n`;
  const section = (title, values, render = (value) => value) =>
    `\n${title}:\n${values.map((value) => `- ${render(value)}`).join("\n") || "- none"}\n`;
  return [
    "Praxis template context",
    section("Bundles", result.bundleIds),
    section("Architecture pages", result.pages, (page) => `${page.localPath} (${page.wikiUrl})`),
    section("Authoritative sources", result.sources),
    section("Contract tests", result.tests),
    section("Verification commands", result.verify),
  ].join("");
}

async function exists(candidate) {
  try { await access(candidate); return true; } catch { return false; }
}

export async function validateContextMap(map, repositoryRoot) {
  const failures = [];
  if (map.schemaVersion !== 1) failures.push("template-context.json schemaVersion must be 1");
  for (const [id, bundle] of Object.entries(map.bundles ?? {})) {
    for (const dependency of bundle.requires ?? []) {
      if (!map.bundles[dependency]) failures.push(`${id} requires unknown bundle ${dependency}`);
    }
    for (const field of ["pages", "sources", "tests"]) {
      if (!Array.isArray(bundle[field]) || bundle[field].length === 0) failures.push(`${id} must declare ${field}`);
      for (const candidate of bundle[field] ?? []) {
        if (!await exists(path.join(repositoryRoot, candidate))) failures.push(`${id} references missing ${field} path ${candidate}`);
      }
    }
  }
  for (const [capability, bundle] of Object.entries(map.capabilityBundles ?? {})) {
    if (!map.bundles[bundle]) failures.push(`${capability} maps to unknown bundle ${bundle}`);
  }
  const proSource = await readFile(path.join(repositoryRoot, "cli/src/config/pro.ts"), "utf8");
  const capabilityBlock = proSource.match(/export const proCapabilities = \[([\s\S]*?)\] as const;/)?.[1] ?? "";
  const capabilities = [...capabilityBlock.matchAll(/"([a-z0-9-]+)"/g)].map((match) => match[1]);
  for (const capability of capabilities) {
    if (!map.capabilityBundles?.[capability]) failures.push(`missing context coverage for Pro capability ${capability}`);
  }
  const templateRoot = path.join(repositoryRoot, "cli/templates");
  for (const entry of await readdir(templateRoot, { withFileTypes: true })) {
    if (!entry.isDirectory() || !await exists(path.join(templateRoot, entry.name, "manifest.json"))) continue;
    if (!map.moduleFamilies?.some(({ prefix }) => entry.name.startsWith(prefix))) {
      failures.push(`missing context coverage for template module ${entry.name}`);
    }
  }
  try {
    for (const id of Object.keys(map.bundles ?? {})) resolveContext(map, { bundles: [id] });
  } catch (error) {
    failures.push(error.message);
  }
  return [...new Set(failures)].sort();
}
