export type ParsedCommand =
  | { kind: "legacy" }
  | {
      kind: "create";
      projectName?: string;
      mode: "quick" | "custom" | "config";
      configPath?: string;
      installDependencies: boolean;
    };

export function parseCommand(args: string[]): ParsedCommand {
  if (args.length === 0 || args[0] === "legacy") {
    return { kind: "legacy" };
  }

  if (args[0] !== "create") {
    throw new Error(`Unknown command "${args[0]}"`);
  }

  let projectName: string | undefined;
  let configPath: string | undefined;
  let mode: "quick" | "custom" | "config" = "custom";
  let installDependencies = true;

  for (let index = 1; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === "--quick") {
      mode = "quick";
    } else if (argument === "--custom") {
      mode = "custom";
    } else if (argument === "--no-install") {
      installDependencies = false;
    } else if (argument === "--config") {
      configPath = args[index + 1];
      if (!configPath || configPath.startsWith("--")) {
        throw new Error("--config requires a file path");
      }
      mode = "config";
      index += 1;
    } else if (argument.startsWith("--")) {
      throw new Error(`Unknown option "${argument}"`);
    } else if (!projectName) {
      projectName = argument;
    } else {
      throw new Error(`Unexpected argument "${argument}"`);
    }
  }

  return {
    kind: "create",
    projectName,
    mode,
    configPath,
    installDependencies,
  };
}
