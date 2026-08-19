import {
  AuthProvider,
  CacheProvider,
  Database,
  DeploymentTarget,
  FrontendFramework,
  FrontendUi,
  Language,
  PackageManager,
  PraxisConfig,
  ProjectType,
  validateConfig,
} from "../config/schema";
import {
  CloudProvider,
  ProCapability,
  ProStack,
  resolveProCapabilities,
} from "../config/pro";

export interface CreateAnswers {
  name: string;
  projectType: ProjectType;
  language: Language;
  frontendFramework?: FrontendFramework;
  frontendUi?: FrontendUi;
  database?: Database;
  auth?: AuthProvider;
  cache?: CacheProvider;
  deployment: DeploymentTarget[];
  packageManager: PackageManager;
  installDependencies: boolean;
  initializeGit: boolean;
}

export interface ProCreateAnswers {
  name: string;
  stack: ProStack;
  capabilities: ProCapability[];
  cloud?: CloudProvider;
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
        ui: answers.frontendUi ?? { mode: "starter" },
      },
    }),
    ...(answers.projectType !== "frontend" && {
      backend: {
        framework: "express",
        database: answers.database,
        auth: answers.auth,
        cache: answers.cache,
      },
    }),
    deployment: answers.deployment,
    packageManager: answers.packageManager,
    installDependencies: answers.installDependencies,
    initializeGit: answers.initializeGit,
  });
}

export function proAnswersToConfig(answers: ProCreateAnswers): PraxisConfig {
  return validateConfig({
    schemaVersion: 2,
    name: answers.name,
    projectType: "pro-backend",
    pro: {
      stack: answers.stack,
      requestedCapabilities: answers.capabilities,
      resolvedCapabilities: resolveProCapabilities(answers.capabilities),
      ...(answers.cloud ? { cloud: answers.cloud } : {}),
    },
    installDependencies: answers.installDependencies,
    initializeGit: answers.initializeGit,
  });
}
