import {
  access,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { PraxisConfig } from "../config/schema";
import {
  EnvironmentContribution,
  ManifestSelector,
  OutputScope,
  PackageContribution,
  TemplateManifest,
} from "./manifest";

export interface ComposeOptions {
  templatesRoot: string;
  destination: string;
}

export async function composeProject(
  config: PraxisConfig,
  moduleIds: string[],
  options: ComposeOptions,
): Promise<void> {
  await assertDestinationAvailable(options.destination);
  await mkdir(path.dirname(options.destination), { recursive: true });
  const staging = await mkdtemp(
    path.join(path.dirname(options.destination), `.${path.basename(options.destination)}.praxis-`),
  );

  try {
    const manifests = await Promise.all(
      moduleIds.map((id) => loadManifest(options.templatesRoot, id)),
    );
    for (const manifest of manifests) {
      for (const overlay of manifest.overlays ?? []) {
        if (!selectorMatches(overlay, config)) continue;
        const moduleRoot = path.resolve(options.templatesRoot, manifest.id);
        const source = confinedPath(moduleRoot, overlay.source, "overlay source");
        const output = outputDirectory(staging, overlay.scope, config);
        await copyOverlay(source, output, config, staging);
      }
      for (const patch of manifest.patches ?? []) {
        if (!selectorMatches(patch, config)) continue;
        const output = outputDirectory(staging, patch.scope, config);
        const filePath = confinedPath(output, patch.file, "patch target");
        const contents = await readFile(filePath, "utf8");
        if (!contents.includes(patch.find)) {
          throw new Error(
            `patch target not found in "${path.relative(staging, filePath)}"`,
          );
        }
        await writeFile(
          filePath,
          contents.replace(patch.find, replaceTokens(patch.replace, config)),
        );
      }
    }

    await applyPackages(staging, config, manifests.flatMap((item) => item.packages ?? []));
    await applyEnvironment(staging, config, manifests.flatMap((item) => item.env ?? []));
    await writeFile(
      path.join(staging, "praxis.config.json"),
      `${JSON.stringify(config, null, 2)}\n`,
    );
    await rename(staging, options.destination);
  } catch (error) {
    await rm(staging, { recursive: true, force: true });
    throw error;
  }
}

async function assertDestinationAvailable(destination: string): Promise<void> {
  try {
    await access(destination);
    throw new Error(`destination already exists: ${destination}`);
  } catch (error: unknown) {
    if (error instanceof Error && error.message.startsWith("destination already")) {
      throw error;
    }
    if (!isNodeError(error) || error.code !== "ENOENT") throw error;
  }
}

async function loadManifest(root: string, id: string): Promise<TemplateManifest> {
  if (!/^[a-z0-9][a-z0-9.-]*$/.test(id)) {
    throw new Error(`invalid module id "${id}"`);
  }
  const moduleRoot = confinedPath(path.resolve(root), id, "module path");
  const contents = await readFile(path.join(moduleRoot, "manifest.json"), "utf8");
  const manifest = JSON.parse(contents) as TemplateManifest;
  if (manifest.id !== id) {
    throw new Error(`manifest id mismatch for ${id}`);
  }
  return manifest;
}

function confinedPath(root: string, candidate: string, label: string): string {
  const resolvedRoot = path.resolve(root);
  const resolved = path.resolve(resolvedRoot, candidate);
  if (resolved !== resolvedRoot && !resolved.startsWith(`${resolvedRoot}${path.sep}`)) {
    throw new Error(`${label} escapes its allowed directory`);
  }
  return resolved;
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error;
}

function outputDirectory(
  staging: string,
  scope: OutputScope,
  config: PraxisConfig,
): string {
  if (scope === "root") return staging;
  if (config.projectType === "fullstack") return path.join(staging, scope);
  return staging;
}

async function copyOverlay(
  source: string,
  destination: string,
  config: PraxisConfig,
  staging: string,
): Promise<void> {
  const entries = await readdir(source, { withFileTypes: true });
  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const destinationPath = path.join(destination, entry.name);
    if (entry.isDirectory()) {
      await copyOverlay(sourcePath, destinationPath, config, staging);
      continue;
    }
    const contents = replaceTokens(await readFile(sourcePath, "utf8"), config);
    await mkdir(path.dirname(destinationPath), { recursive: true });
    try {
      const existing = await readFile(destinationPath, "utf8");
      if (existing !== contents) {
        throw new Error(
          `file conflict at "${path.relative(staging, destinationPath)}"`,
        );
      }
    } catch (error) {
      if (error instanceof Error && error.message.startsWith("file conflict")) {
        throw error;
      }
      await writeFile(destinationPath, contents);
    }
  }
}

function replaceTokens(contents: string, config: PraxisConfig): string {
  const tokens: Record<string, string> = {
    projectName: config.name,
    packageManager:
      config.projectType === "pro-backend"
        ? config.pro.stack === "python-django" ? "pdm" : "go"
        : config.packageManager,
    proStack: config.projectType === "pro-backend" ? config.pro.stack : "",
    cloud: config.projectType === "pro-backend" ? config.pro.cloud ?? "" : "",
    backendPort:
      config.projectType === "pro-backend"
        ? config.pro.stack === "python-django" ? "8000" : "8080"
        : "",
  };
  return Object.entries(tokens).reduce(
    (result, [name, value]) => result.split(`{{${name}}}`).join(value),
    contents,
  );
}

async function applyPackages(
  staging: string,
  config: PraxisConfig,
  contributions: PackageContribution[],
): Promise<void> {
  contributions = contributions.filter((item) => contributionMatches(item, config));
  const scopes = new Set(contributions.map((item) => item.scope));
  for (const scope of scopes) {
    const relevant = contributions.filter((item) => item.scope === scope);
    const directory = outputDirectory(staging, scope, config);
    const packagePath = path.join(directory, "package.json");
    let packageJson: Record<string, unknown> = {};
    try {
      packageJson = JSON.parse(await readFile(packagePath, "utf8"));
    } catch {
      await mkdir(directory, { recursive: true });
    }
    packageJson.name ??= config.projectType === "fullstack" && scope !== "root"
      ? `${config.name}-${scope}`
      : config.name;
    for (const contribution of relevant) {
      packageJson.dependencies = mergeRecord(
        packageJson.dependencies,
        contribution.dependencies,
      );
      packageJson.devDependencies = mergeRecord(
        packageJson.devDependencies,
        contribution.devDependencies,
      );
      packageJson.scripts = mergeRecord(packageJson.scripts, contribution.scripts);
    }
    removeEmptyRecords(packageJson);
    await writeFile(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);
  }
}

async function applyEnvironment(
  staging: string,
  config: PraxisConfig,
  contributions: EnvironmentContribution[],
): Promise<void> {
  contributions = contributions.filter((item) => contributionMatches(item, config));
  for (const scope of new Set(contributions.map((item) => item.scope))) {
    const keys = new Set(
      contributions.filter((item) => item.scope === scope).flatMap((item) => item.keys),
    );
    if (keys.size === 0) continue;
    const directory = outputDirectory(staging, scope, config);
    await mkdir(directory, { recursive: true });
    const contents = [...keys].sort().map((key) => key.includes("=") ? key : `${key}=`).join("\n");
    await writeFile(path.join(directory, ".env.example"), `${contents}\n`);
  }
}

function contributionMatches(
  contribution: PackageContribution | EnvironmentContribution,
  config: PraxisConfig,
): boolean {
  return selectorMatches(contribution, config);
}

function selectorMatches(
  selector: ManifestSelector,
  config: PraxisConfig,
): boolean {
  if (selector.projectType && selector.projectType !== config.projectType) {
    return false;
  }
  if (config.projectType === "pro-backend") {
    return !selector.language
      && !selector.framework
      && !selector.cache
      && (!selector.proStack || selector.proStack === config.pro.stack)
      && (!selector.capability
        || config.pro.resolvedCapabilities.includes(selector.capability))
      && (!selector.cloud || selector.cloud === config.pro.cloud);
  }
  return (!selector.language || selector.language === config.language)
    && (!selector.framework || selector.framework === config.frontend?.framework)
    && (!selector.cache || selector.cache === config.backend?.cache)
    && !selector.proStack
    && !selector.capability
    && !selector.cloud;
}

function mergeRecord(
  current: unknown,
  addition: Record<string, string> | undefined,
): Record<string, string> {
  return {
    ...((current && typeof current === "object" ? current : {}) as Record<string, string>),
    ...(addition ?? {}),
  };
}

function removeEmptyRecords(packageJson: Record<string, unknown>): void {
  for (const key of ["dependencies", "devDependencies", "scripts"]) {
    const value = packageJson[key];
    if (value && typeof value === "object" && Object.keys(value).length === 0) {
      delete packageJson[key];
    }
  }
}
