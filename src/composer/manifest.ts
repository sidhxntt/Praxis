export type OutputScope = "root" | "frontend" | "backend";

export interface ManifestSelector {
  language?: "typescript" | "javascript";
  framework?: "next" | "vite" | "vue" | "astro" | "angular";
  projectType?: "frontend" | "backend" | "fullstack" | "pro-backend";
  cache?: "redis" | "memcached" | "none";
  proStack?: "python-django" | "go-gin";
  capability?: import("../config/pro").ProCapability;
  cloud?: "aws" | "azure" | "gcp";
}

export interface OverlayDefinition extends ManifestSelector {
  scope: OutputScope;
  source: string;
}

export interface PackageContribution extends ManifestSelector {
  scope: OutputScope;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
}

export interface EnvironmentContribution extends ManifestSelector {
  scope: OutputScope;
  keys: string[];
}

export interface PatchDefinition extends ManifestSelector {
  scope: OutputScope;
  file: string;
  find: string;
  replace: string;
}

export interface TemplateManifest {
  id: string;
  overlays?: OverlayDefinition[];
  packages?: PackageContribution[];
  env?: EnvironmentContribution[];
  patches?: PatchDefinition[];
}
