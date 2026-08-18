export type OutputScope = "root" | "frontend" | "backend";

export interface OverlayDefinition {
  scope: OutputScope;
  source: string;
  language?: "typescript" | "javascript";
  framework?: "next" | "vite";
  projectType?: "frontend" | "backend" | "fullstack";
}

export interface PackageContribution {
  scope: OutputScope;
  language?: "typescript" | "javascript";
  framework?: "next" | "vite";
  projectType?: "frontend" | "backend" | "fullstack";
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
}

export interface EnvironmentContribution {
  scope: OutputScope;
  keys: string[];
  language?: "typescript" | "javascript";
  framework?: "next" | "vite";
  projectType?: "frontend" | "backend" | "fullstack";
}

export interface PatchDefinition {
  scope: OutputScope;
  file: string;
  find: string;
  replace: string;
  language?: "typescript" | "javascript";
  framework?: "next" | "vite";
  projectType?: "frontend" | "backend" | "fullstack";
}

export interface TemplateManifest {
  id: string;
  overlays?: OverlayDefinition[];
  packages?: PackageContribution[];
  env?: EnvironmentContribution[];
  patches?: PatchDefinition[];
}
