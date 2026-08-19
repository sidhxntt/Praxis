import * as p from "@clack/prompts";
import path from "node:path";
import { ParsedCommand } from "../cli/command";
import { loadConfigFile } from "../config/load";
import {
  AuthProvider,
  CacheProvider,
  Database,
  DeploymentTarget,
  FrontendFramework,
  Language,
  PackageManager,
  PraxisConfig,
  ProjectType,
  quickConfig,
  validateConfig,
} from "../config/schema";
import {
  CloudProvider,
  ProCapability,
  ProStack,
  recommendedProCapabilities,
} from "../config/pro";
import { generateProject } from "../generator/generate";
import { showRandomAnimation } from "../controllers/user_touch";
import { answersToConfig, proAnswersToConfig } from "./answers";

type CreateCommand = Extract<ParsedCommand, { kind: "create" }>;

interface CreateDependencies {
  showSplash: (message: string) => Promise<void>;
  resolveConfig: (command: CreateCommand) => Promise<PraxisConfig>;
  generate: (config: PraxisConfig) => Promise<string>;
}

const defaultCreateDependencies: CreateDependencies = {
  showSplash: showRandomAnimation,
  resolveConfig: resolveCreateConfig,
  generate: generateProject,
};

export async function runCreate(
  command: CreateCommand,
  dependencies: CreateDependencies = defaultCreateDependencies,
): Promise<void> {
  await dependencies.showSplash("Welcome to Praxis ⚡️🚀");
  p.intro("Praxis Flow composable builder");
  const config = await dependencies.resolveConfig(command);
  const spinner = p.spinner();
  spinner.start(`Generating ${config.name}`);
  try {
    const destination = await dependencies.generate(config);
    spinner.stop("Project generated");
    p.note(nextSteps(config, destination), "Next steps");
    p.outro("Happy building ✨");
  } catch (error) {
    spinner.stop("Generation failed");
    throw error;
  }
}

async function resolveCreateConfig(command: CreateCommand): Promise<PraxisConfig> {
  if (command.mode === "config") {
    const loaded = await loadConfigFile(command.configPath!);
    return validateConfig({
      ...loaded,
      ...(command.projectName ? { name: command.projectName } : {}),
      installDependencies: command.installDependencies
        ? loaded.installDependencies
        : false,
    });
  }

  const name = command.projectName ?? (await requiredText("Project name", "my-app"));
  if (command.mode === "quick") {
    return {
      ...quickConfig(name),
      installDependencies: command.installDependencies,
    };
  }

  const projectType = await select<ProjectType | "pro-backend">("Project type", [
    ["fullstack", "Fullstack"],
    ["frontend", "Frontend"],
    ["backend", "Backend"],
    ["pro-backend", "Production Backend (Pro)"],
  ]);
  if (projectType === "pro-backend") {
    return resolveProAnswers(name, command.installDependencies);
  }
  const language = await select<Language>("Language", [
    ["typescript", "TypeScript"],
    ["javascript", "JavaScript"],
  ]);
  const frontendFramework = projectType === "backend"
    ? undefined
    : await select<FrontendFramework>("Frontend framework", [
        ["next", "Next.js"],
        ["vite", "Vite"],
      ]);
  const database = projectType === "frontend"
    ? undefined
    : await select<Database>("Database", [
        ["postgres", "PostgreSQL"],
        ["mongo", "MongoDB"],
        ["none", "None"],
      ]);
  const authOptions: Array<[AuthProvider, string]> = [
    ...(database === "none" ? [] : [["self-hosted", "Self-hosted"]] as Array<[AuthProvider, string]>),
    ["clerk", "Clerk"],
    ["supabase", "Supabase Auth"],
    ["none", "None"],
  ];
  const auth = projectType === "frontend"
    ? undefined
    : await select<AuthProvider>("Authentication", authOptions);
  const cache = projectType === "frontend"
    ? undefined
    : await select<CacheProvider>("Cache", [
        ["redis", "Redis"],
        ["memcached", "Memcached"],
        ["none", "None"],
      ]);
  const deployment = await selectDeployments(projectType);
  const packageManager = await select<PackageManager>("Package manager", [
    ["npm", "npm"],
    ["pnpm", "pnpm"],
    ["yarn", "Yarn"],
    ["bun", "Bun"],
  ]);
  const installDependencies = command.installDependencies
    ? await confirm("Install dependencies?", true)
    : false;
  const initializeGit = await confirm("Initialize a Git repository?", true);

  return answersToConfig({
    name,
    projectType,
    language,
    frontendFramework,
    database,
    auth,
    cache,
    deployment,
    packageManager,
    installDependencies,
    initializeGit,
  });
}

async function resolveProAnswers(
  name: string,
  mayInstall: boolean,
): Promise<PraxisConfig> {
  const stack = await select<ProStack>("Backend stack", [
    ["python-django", "Python + Django/DRF"],
    ["go-gin", "Go + Gin"],
  ]);
  const authentication = await selectCapabilities(
    "Authentication and access",
    [
      ["jwt-auth", "JWT authentication"],
      ["social-auth", "Social authentication"],
      ["fine-grained-auth", "Fine-grained authorization"],
    ],
  );
  const application = await selectCapabilities("Application services", [
    ["redis-cache", "Redis caching"],
    ["background-jobs", "Background jobs"],
    ["scheduled-jobs", "Scheduled jobs"],
    ["email-tasks", "Asynchronous email"],
    ["object-storage", "Object storage"],
    ["search", "Elasticsearch search"],
    ["realtime", "Realtime WebSockets"],
    ["kafka", "Kafka event streaming"],
    ["feature-flags", "Feature flags"],
    ["seed-data", "Development seed data"],
  ]);
  const observability = await selectCapabilities(
    "Observability and operations",
    [
      ["sentry", "Sentry error monitoring"],
      ["prometheus", "Prometheus metrics"],
      ["opentelemetry", "OpenTelemetry tracing"],
      ["elk", "ELK log aggregation"],
      ["synthetic-monitoring", "Synthetic uptime checks"],
      ["load-testing", "Load testing"],
      ["compliance-audit", "Compliance audit controls"],
    ],
  );
  const deployment = await selectCapabilities("Deployment and reliability", [
    ["nginx", "Nginx reverse proxy"],
    ["kubernetes", "Kubernetes"],
    ["terraform", "Terraform managed cloud"],
    ["autoscaling", "Autoscaling"],
    ["high-availability", "High availability"],
    ["edge-protection", "Edge protection"],
    ["database-resilience", "Database resilience"],
    ["disaster-recovery", "Multi-region disaster recovery"],
    ["cloud-secrets", "Cloud secrets"],
  ]);
  const capabilities = [
    ...authentication,
    ...application,
    ...observability,
    ...deployment,
  ];
  const cloud = capabilities.includes("terraform")
    ? await select<CloudProvider>("Terraform cloud", [
        ["aws", "AWS"],
        ["azure", "Azure"],
        ["gcp", "GCP"],
      ])
    : undefined;
  const installDependencies = mayInstall
    ? await confirm("Install dependencies?", true)
    : false;
  const initializeGit = await confirm("Initialize a Git repository?", true);
  return proAnswersToConfig({
    name,
    stack,
    capabilities,
    cloud,
    installDependencies,
    initializeGit,
  });
}

async function requiredText(message: string, placeholder: string): Promise<string> {
  const result = await p.text({
    message,
    placeholder,
    validate: (value) => value.trim() ? undefined : `${message} is required`,
  });
  return cancelled(result).trim();
}

async function select<T extends string>(
  message: string,
  options: Array<[T, string]>,
): Promise<T> {
  const result = await p.select({
    message,
    options: options.map(([value, label]) => ({ value, label })),
  });
  return cancelled(result) as T;
}

async function selectCapabilities(
  message: string,
  options: Array<[ProCapability, string]>,
): Promise<ProCapability[]> {
  const result = await p.multiselect({
    message,
    options: options.map(([value, label]) => ({ value, label })) as never,
    initialValues: options
      .map(([value]) => value)
      .filter((value) => recommendedProCapabilities.includes(value)),
    required: false,
  });
  return cancelled(result) as ProCapability[];
}

async function selectDeployments(projectType: ProjectType): Promise<DeploymentTarget[]> {
  const options: Array<{ value: DeploymentTarget; label: string }> = [];
  if (projectType !== "backend") options.push({ value: "vercel", label: "Vercel" });
  if (projectType !== "frontend") {
    options.push({ value: "railway", label: "Railway" });
    options.push({ value: "render", label: "Render" });
  }
  options.push({ value: "docker", label: "Docker" });
  const result = await p.multiselect({
    message: "Deployment targets",
    options,
    required: false,
  });
  return cancelled(result) as DeploymentTarget[];
}

async function confirm(message: string, initialValue: boolean): Promise<boolean> {
  return cancelled(await p.confirm({ message, initialValue })) as boolean;
}

function cancelled<T>(value: T | symbol): T {
  if (p.isCancel(value)) {
    p.cancel("Operation cancelled");
    throw new Error("Operation cancelled");
  }
  return value as T;
}

function nextSteps(config: PraxisConfig, destination: string): string {
  const relative = path.relative(process.cwd(), destination);
  const commands = [`cd ${relative}`];
  if (config.projectType === "pro-backend") {
    if (!config.installDependencies) {
      commands.push(
        config.pro.stack === "python-django" ? "pdm install" : "go mod download",
      );
    }
    commands.push(
      config.pro.stack === "python-django"
        ? "pdm run python manage.py runserver"
        : "go run ./cmd/api",
    );
    return commands.join("\n");
  }
  if (!config.installDependencies) commands.push(`${config.packageManager} install`);
  commands.push(
    config.projectType === "fullstack"
      ? `${config.packageManager} run dev:frontend`
      : `${config.packageManager} run dev`,
  );
  return commands.join("\n");
}
