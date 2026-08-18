import { ParsedCommand, parseCommand } from "./command";

export interface CliDependencies {
  legacy: () => Promise<void>;
  create: (command: Extract<ParsedCommand, { kind: "create" }>) => Promise<void>;
}

export async function runCli(args: string[], dependencies: CliDependencies): Promise<void> {
  const command = parseCommand(args);
  if (command.kind === "legacy") {
    await dependencies.legacy();
  } else {
    await dependencies.create(command);
  }
}
