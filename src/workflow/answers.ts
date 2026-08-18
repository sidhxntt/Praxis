import {
  AuthProvider,
  Database,
  DeploymentTarget,
  FrontendFramework,
  Language,
  PackageManager,
  PraxisConfig,
  ProjectType,
  validateConfig,
} from "../config/schema";

export interface CreateAnswers {
  name: string;
  projectType: ProjectType;
  language: Language;
  frontendFramework?: FrontendFramework;
  database?: Database;
  auth?: AuthProvider;
  deployment: DeploymentTarget[];
  packageManager: PackageManager;
  installDependencies: boolean;
  initializeGit: boolean;
}

export function answersToConfig(answers: CreateAnswers): PraxisConfig {
  return validateConfig({
    schemaVersion: 1,
    name: answers.name,
    projectType: answers.projectType,
    language: answers.language,
    ...(answers.projectType !== "backend" && {
      frontend: {
        framework: answers.frontendFramework,
        styling: "tailwind-shadcn",
      },
    }),
    ...(answers.projectType !== "frontend" && {
      backend: {
        framework: "express",
        database: answers.database,
        auth: answers.auth,
      },
    }),
    deployment: answers.deployment,
    packageManager: answers.packageManager,
    installDependencies: answers.installDependencies,
    initializeGit: answers.initializeGit,
  });
}
