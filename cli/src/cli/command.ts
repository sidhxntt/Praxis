export type ParsedCommand =
  | { kind: "help" }
  | {
      kind: "create";
      projectName?: string;
      mode: "quick" | "custom" | "config";
      configPath?: string;
      installDependencies: boolean;
    };

export function parseCommand(args: string[]): ParsedCommand {
  if (args.length === 0) {
    return {
      kind: "create",
      projectName: undefined,
      mode: "custom",
      configPath: undefined,
      installDependencies: true,
    };
  }

  const createArguments = args[0] === "create" ? args.slice(1) : args;

  if (["help", "--help", "-h"].includes(createArguments[0])) {
    if (createArguments.length > 1) {
      throw new Error(
        `Unexpected argument "${createArguments[1]}". Run "praxiflow help" for usage.`,
      );
    }
    return { kind: "help" };
  }

  if (["legacy", "destroy"].includes(args[0])) {
    throw new Error(
      `Unknown command "${args[0]}". Run "praxiflow help" for usage.`,
    );
  }

  let projectName: string | undefined;
  let configPath: string | undefined;
  let selectedMode: "quick" | "custom" | "config" | undefined;
  let installDependencies = true;

  const chooseMode = (candidate: "quick" | "custom" | "config"): void => {
    if (selectedMode && selectedMode !== candidate) {
      throw new Error(
        'Choose only one of "--custom", "--quick", or "--config".',
      );
    }
    selectedMode = candidate;
  };

  for (let index = 0; index < createArguments.length; index += 1) {
    const argument = createArguments[index];
    if (argument === "--quick") {
      chooseMode("quick");
    } else if (argument === "--custom") {
      chooseMode("custom");
    } else if (argument === "--no-install") {
      installDependencies = false;
    } else if (argument === "--config") {
      const candidatePath = createArguments[index + 1];
      if (!candidatePath || candidatePath.startsWith("-")) {
        throw new Error("--config requires a file path");
      }
      chooseMode("config");
      configPath = candidatePath;
      index += 1;
    } else if (argument.startsWith("-")) {
      throw new Error(
        `Unknown option "${argument}". Run "praxiflow help" for usage.`,
      );
    } else if (!projectName) {
      projectName = argument;
    } else {
      throw new Error(`Unexpected argument "${argument}"`);
    }
  }

  return {
    kind: "create",
    projectName,
    mode: selectedMode ?? "custom",
    configPath,
    installDependencies,
  };
}
