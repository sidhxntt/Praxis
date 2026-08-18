import { spawn } from "node:child_process";
import path from "node:path";
import { rm } from "node:fs/promises";
import { composeProject } from "../composer/compose";
import { resolveModules } from "../config/resolver";
import { PraxisConfig, validateConfig } from "../config/schema";

export interface GenerateOptions {
  cwd?: string;
  templatesRoot?: string;
  runCommand?: (command: string, args: string[], cwd: string) => Promise<void>;
}

export async function generateProject(
  input: PraxisConfig,
  options: GenerateOptions = {},
): Promise<string> {
  const config = validateConfig(input);
  const cwd = path.resolve(options.cwd ?? process.cwd());
  const destination = path.resolve(cwd, config.name);
  if (path.dirname(destination) !== cwd) {
    throw new Error("project destination must remain inside the current directory");
  }

  const templatesRoot =
    options.templatesRoot ?? path.resolve(__dirname, "../../templates");
  await composeProject(config, resolveModules(config), {
    templatesRoot,
    destination,
  });

  try {
    const run = options.runCommand ?? runCommand;
    if (config.installDependencies) {
      const install = installCommand(config.packageManager);
      await run(install.command, install.args, destination);
    }
    if (config.initializeGit) {
      await run("git", ["init"], destination);
    }
  } catch (error) {
    await rm(destination, { recursive: true, force: true });
    throw error;
  }
  return destination;
}

function installCommand(packageManager: PraxisConfig["packageManager"]): {
  command: string;
  args: string[];
} {
  return packageManager === "yarn"
    ? { command: "yarn", args: [] }
    : { command: packageManager, args: ["install"] };
}

function runCommand(command: string, args: string[], cwd: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, stdio: "inherit" });
    child.once("error", reject);
    child.once("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} exited with code ${code}`));
    });
  });
}
