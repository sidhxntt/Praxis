import { PraxisConfig, validateConfig } from "./schema";

export function resolveModules(config: PraxisConfig): string[] {
  validateConfig(config);

  if (config.projectType === "pro-backend") {
    const modules = [
      "pro.core",
      config.pro.stack === "python-django" ? "pro.django" : "pro.gin",
    ];
    for (const capability of config.pro.resolvedCapabilities) {
      if (capability === "kubernetes" || capability === "terraform") continue;
      modules.push(`pro.capability.${capability}`);
    }
    modules.push("pro.compose");
    if (config.pro.resolvedCapabilities.includes("kubernetes")) {
      modules.push("pro.kubernetes");
    }
    if (config.pro.resolvedCapabilities.includes("terraform")) {
      modules.push("pro.terraform.shared", `pro.terraform.${config.pro.cloud}`);
    }
    return modules;
  }

  if (config.backend?.auth === "self-hosted" && config.backend.database === "none") {
    throw new Error("self-hosted authentication requires a database");
  }
  if (
    config.deployment.includes("vercel") &&
    config.projectType === "backend"
  ) {
    throw new Error("vercel requires a frontend project");
  }
  for (const target of ["railway", "render"] as const) {
    if (config.deployment.includes(target) && config.projectType === "frontend") {
      throw new Error(`${target} requires a backend project`);
    }
  }

  const modules: string[] = [];
  if (config.projectType === "fullstack") modules.push("base.workspace");
  if (config.frontend) {
    modules.push(`frontend.${config.frontend.framework}`);
    modules.push("styling.tailwind-shadcn");
  }
  if (config.backend) {
    modules.push("backend.express");
    if (config.backend.database !== "none") {
      modules.push(`database.${config.backend.database}`);
    }
    if (config.backend.auth !== "none") {
      modules.push(`auth.${config.backend.auth}`);
    }
    if (config.backend.cache !== "none") {
      modules.push(`cache.${config.backend.cache}`);
    }
  }
  modules.push(...config.deployment.map((target) => `deployment.${target}`));
  return modules;
}
