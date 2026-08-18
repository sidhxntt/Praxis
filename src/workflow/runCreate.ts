import * as p from "@clack/prompts";
import path from "node:path";
import { ParsedCommand } from "../cli/command";
import { loadConfigFile } from "../config/load";
import {
  AuthProvider,
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
import { generateProject } from "../generator/generate";
import { answersToConfig } from "./answers";

type CreateCommand = Extract<ParsedCommand, { kind: "create" }>;

export async function runCreate(command: CreateCommand): Promise<void> {
  p.intro("Praxis Flow composable builder");
  const config = await resolveCreateConfig(command);
  const spinner = p.spinner();
  spinner.start(`Generating ${config.name}`);
  try {
    const destination = await generateProject(config);
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

  const projectType = await select<ProjectType>("Project type", [
    ["fullstack", "Fullstack"],
    ["frontend", "Frontend"],
    ["backend", "Backend"],
  ]);
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
    deployment,
    packageManager,
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
  if (!config.installDependencies) commands.push(`${config.packageManager} install`);
  commands.push(
    config.projectType === "fullstack"
      ? `${config.packageManager} run dev:frontend`
      : `${config.packageManager} run dev`,
  );
  return commands.join("\n");
}
