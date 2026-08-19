import {
  cloudProviders,
  isProCapability,
  ProConfig,
  proStacks,
  resolveProCapabilities,
} from "./pro";
import { isUiStyleId, UiStyleId } from "../ui/catalog";

export type ProjectType = "frontend" | "backend" | "fullstack";
export type Language = "typescript" | "javascript";
export type FrontendFramework = "next" | "vite" | "vue" | "astro" | "angular";
export type FrontendUi =
  | { mode: "starter" }
  | { mode: "template"; style: UiStyleId };
export type Database = "postgres" | "mongo" | "none";
export type AuthProvider = "self-hosted" | "clerk" | "supabase" | "none";
export type CacheProvider = "redis" | "memcached" | "none";
export type DeploymentTarget = "vercel" | "railway" | "render" | "docker";
export type PackageManager = "npm" | "pnpm" | "yarn" | "bun";

export interface LegacyPraxisConfig {
  schemaVersion: 1;
  name: string;
  projectType: ProjectType;
  language: Language;
  frontend?: {
    framework: FrontendFramework;
    styling: "tailwind-shadcn";
    ui?: FrontendUi;
  };
  backend?: {
    framework: "express";
    database: Database;
    auth: AuthProvider;
    cache: CacheProvider;
  };
  deployment: DeploymentTarget[];
  packageManager: PackageManager;
  installDependencies: boolean;
  initializeGit: boolean;
}

export interface ProPraxisConfig {
  schemaVersion: 2;
  name: string;
  projectType: "pro-backend";
  pro: ProConfig;
  installDependencies: boolean;
  initializeGit: boolean;
}

export type PraxisConfig = LegacyPraxisConfig | ProPraxisConfig;

const topLevelKeys = new Set([
  "schemaVersion",
  "name",
  "projectType",
  "language",
  "frontend",
  "backend",
  "deployment",
  "packageManager",
  "installDependencies",
  "initializeGit",
]);

export function quickConfig(name: string): LegacyPraxisConfig {
  return {
    schemaVersion: 1,
    name,
    projectType: "fullstack",
    language: "typescript",
    frontend: {
      framework: "next",
      styling: "tailwind-shadcn",
      ui: { mode: "starter" },
    },
    backend: {
      framework: "express",
      database: "postgres",
      auth: "self-hosted",
      cache: "none",
    },
    deployment: ["vercel", "railway", "docker"],
    packageManager: "npm",
    installDependencies: true,
    initializeGit: true,
  };
}

export function validateConfig(input: unknown): PraxisConfig {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new Error("configuration must be an object");
  }

  const value = input as Record<string, unknown>;
  if (value.projectType === "pro-backend") {
    return validateProConfig(value);
  }
  for (const key of Object.keys(value)) {
    if (!topLevelKeys.has(key)) {
      throw new Error(`unknown configuration key "${key}"`);
    }
  }

  if (value.schemaVersion !== 1) {
    throw new Error("schemaVersion must be 1");
  }
  if (
    typeof value.name !== "string" ||
    !/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(value.name) ||
    value.name === "." ||
    value.name === ".."
  ) {
    throw new Error("name must be a safe directory name");
  }

  const projectTypes: ProjectType[] = ["frontend", "backend", "fullstack"];
  if (!projectTypes.includes(value.projectType as ProjectType)) {
    throw new Error("projectType must be frontend, backend, or fullstack");
  }
  const projectType = value.projectType as ProjectType;

  if (projectType !== "backend" && !value.frontend) {
    throw new Error("frontend configuration is required");
  }
  if (projectType === "backend" && value.frontend) {
    throw new Error("frontend configuration is not allowed");
  }
  if (projectType !== "frontend" && !value.backend) {
    throw new Error("backend configuration is required");
  }
  if (projectType === "frontend" && value.backend) {
    throw new Error("backend configuration is not allowed");
  }

  const languages: Language[] = ["typescript", "javascript"];
  if (!languages.includes(value.language as Language)) {
    throw new Error("language must be typescript or javascript");
  }

  validateFrontend(value.frontend, value.language as Language);
  validateBackend(value.backend);

  const deployments: DeploymentTarget[] = [
    "vercel",
    "railway",
    "render",
    "docker",
  ];
  if (
    !Array.isArray(value.deployment) ||
    value.deployment.some((item) => !deployments.includes(item))
  ) {
    throw new Error("deployment contains an unsupported target");
  }
  if (new Set(value.deployment).size !== value.deployment.length) {
    throw new Error("deployment targets must be unique");
  }

  const packageManagers: PackageManager[] = ["npm", "pnpm", "yarn", "bun"];
  if (!packageManagers.includes(value.packageManager as PackageManager)) {
    throw new Error("packageManager is unsupported");
  }
  if (typeof value.installDependencies !== "boolean") {
    throw new Error("installDependencies must be boolean");
  }
  if (typeof value.initializeGit !== "boolean") {
    throw new Error("initializeGit must be boolean");
  }

  return value as unknown as PraxisConfig;
}

function validateProConfig(value: Record<string, unknown>): ProPraxisConfig {
  const keys = new Set([
    "schemaVersion",
    "name",
    "projectType",
    "pro",
    "installDependencies",
    "initializeGit",
  ]);
  for (const key of Object.keys(value)) {
    if (!keys.has(key)) throw new Error(`unknown configuration key "${key}"`);
  }
  if (value.schemaVersion !== 2) {
    throw new Error("pro-backend requires schemaVersion 2");
  }
  validateName(value.name);
  if (!value.pro || typeof value.pro !== "object" || Array.isArray(value.pro)) {
    throw new Error("pro configuration is required");
  }
  const pro = value.pro as Record<string, unknown>;
  assertKnownKeys(
    pro,
    ["stack", "requestedCapabilities", "resolvedCapabilities", "cloud"],
    "pro",
  );
  if (!proStacks.includes(pro.stack as never)) {
    throw new Error("pro stack is unsupported");
  }
  const requested = validateCapabilityList(
    pro.requestedCapabilities,
    "requested Pro capabilities",
  );
  const resolved = validateCapabilityList(
    pro.resolvedCapabilities,
    "resolved Pro capabilities",
  );
  const expected = resolveProCapabilities(requested);
  if (JSON.stringify(resolved) !== JSON.stringify(expected)) {
    throw new Error(
      "resolved Pro capabilities do not match requested capabilities",
    );
  }
  const terraform = resolved.includes("terraform");
  if (terraform && !cloudProviders.includes(pro.cloud as never)) {
    throw new Error("cloud is required when Terraform is selected");
  }
  if (!terraform && pro.cloud !== undefined) {
    throw new Error("cloud is only allowed when Terraform is selected");
  }
  validateCommonBooleans(value);
  return value as unknown as ProPraxisConfig;
}

function validateCapabilityList(
  value: unknown,
  label: string,
): import("./pro").ProCapability[] {
  if (!Array.isArray(value) || value.some((item) => !isProCapability(item))) {
    throw new Error(`${label} contain an unsupported capability`);
  }
  if (new Set(value).size !== value.length) {
    throw new Error(`${label} must be unique`);
  }
  return value;
}

function validateName(value: unknown): void {
  if (
    typeof value !== "string" ||
    !/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(value) ||
    value === "." ||
    value === ".."
  ) {
    throw new Error("name must be a safe directory name");
  }
}

function validateCommonBooleans(value: Record<string, unknown>): void {
  if (typeof value.installDependencies !== "boolean") {
    throw new Error("installDependencies must be boolean");
  }
  if (typeof value.initializeGit !== "boolean") {
    throw new Error("initializeGit must be boolean");
  }
}

function validateFrontend(value: unknown, language: Language): void {
  if (value === undefined) return;
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("frontend must be an object");
  }
  const frontend = value as Record<string, unknown>;
  assertKnownKeys(frontend, ["framework", "styling", "ui"], "frontend");
  const frameworks: FrontendFramework[] = [
    "next",
    "vite",
    "vue",
    "astro",
    "angular",
  ];
  if (!frameworks.includes(frontend.framework as FrontendFramework)) {
    throw new Error("frontend framework must be next, vite, vue, astro, or angular");
  }
  if (frontend.styling !== "tailwind-shadcn") {
    throw new Error("frontend styling must be tailwind-shadcn");
  }
  if (frontend.framework === "angular" && language !== "typescript") {
    throw new Error("Angular templates require TypeScript");
  }
  validateFrontendUi(frontend.ui);
}

function validateFrontendUi(value: unknown): void {
  if (value === undefined) return;
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("frontend UI configuration must be an object");
  }
  const ui = value as Record<string, unknown>;
  if (ui.mode === "starter") {
    assertKnownKeys(ui, ["mode"], "starter UI");
    return;
  }
  if (ui.mode === "template") {
    assertKnownKeys(ui, ["mode", "style"], "template UI");
    if (!isUiStyleId(ui.style)) {
      throw new Error("frontend UI style is unsupported");
    }
    return;
  }
  throw new Error("frontend UI mode must be starter or template");
}

function validateBackend(value: unknown): void {
  if (value === undefined) return;
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("backend must be an object");
  }
  const backend = value as Record<string, unknown>;
  assertKnownKeys(
    backend,
    ["framework", "database", "auth", "cache"],
    "backend",
  );
  if (backend.framework !== "express") {
    throw new Error("backend framework must be express");
  }
  if (!["postgres", "mongo", "none"].includes(backend.database as string)) {
    throw new Error("backend database is unsupported");
  }
  if (
    !["self-hosted", "clerk", "supabase", "none"].includes(
      backend.auth as string,
    )
  ) {
    throw new Error("backend auth is unsupported");
  }
  if (
    !(["redis", "memcached", "none"] as const).includes(
      backend.cache as CacheProvider,
    )
  ) {
    throw new Error("backend cache is unsupported");
  }
}

function assertKnownKeys(
  value: Record<string, unknown>,
  allowed: string[],
  section: string,
): void {
  for (const key of Object.keys(value)) {
    if (!allowed.includes(key)) {
      throw new Error(`unknown ${section} configuration key "${key}"`);
    }
  }
}
