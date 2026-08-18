import { ParsedCommand, parseCommand } from "./command";
import { formatHelp } from "./help";

export interface CliDependencies {
  create: (command: Extract<ParsedCommand, { kind: "create" }>) => Promise<void>;
  write?: (message: string) => void;
}

export async function runCli(args: string[], dependencies: CliDependencies): Promise<void> {
  const command = parseCommand(args);
  if (command.kind === "help") {
    (dependencies.write ?? console.log)(formatHelp());
    return;
  }

  await dependencies.create(command);
}
