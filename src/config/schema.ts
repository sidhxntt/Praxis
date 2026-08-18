export type ProjectType = "frontend" | "backend" | "fullstack";
export type Language = "typescript" | "javascript";
export type FrontendFramework = "next" | "vite";
export type Database = "postgres" | "mongo" | "none";
export type AuthProvider = "self-hosted" | "clerk" | "supabase" | "none";
export type DeploymentTarget = "vercel" | "railway" | "render" | "docker";
export type PackageManager = "npm" | "pnpm" | "yarn" | "bun";

export interface PraxisConfig {
  schemaVersion: 1;
  name: string;
  projectType: ProjectType;
  language: Language;
  frontend?: {
    framework: FrontendFramework;
    styling: "tailwind-shadcn";
  };
  backend?: {
    framework: "express";
    database: Database;
    auth: AuthProvider;
  };
  deployment: DeploymentTarget[];
  packageManager: PackageManager;
  installDependencies: boolean;
  initializeGit: boolean;
}

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

export function quickConfig(name: string): PraxisConfig {
  return {
    schemaVersion: 1,
    name,
    projectType: "fullstack",
    language: "typescript",
    frontend: { framework: "next", styling: "tailwind-shadcn" },
    backend: {
      framework: "express",
      database: "postgres",
      auth: "self-hosted",
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

  validateFrontend(value.frontend);
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

function validateFrontend(value: unknown): void {
  if (value === undefined) return;
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("frontend must be an object");
  }
  const frontend = value as Record<string, unknown>;
  assertKnownKeys(frontend, ["framework", "styling"], "frontend");
  if (frontend.framework !== "next" && frontend.framework !== "vite") {
    throw new Error("frontend framework must be next or vite");
  }
  if (frontend.styling !== "tailwind-shadcn") {
    throw new Error("frontend styling must be tailwind-shadcn");
  }
}

function validateBackend(value: unknown): void {
  if (value === undefined) return;
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("backend must be an object");
  }
  const backend = value as Record<string, unknown>;
  assertKnownKeys(backend, ["framework", "database", "auth"], "backend");
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
