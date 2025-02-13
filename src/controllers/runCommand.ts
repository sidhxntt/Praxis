import { spawn } from "child_process";
import * as p from "@clack/prompts";
import chalk from 'chalk'


export function runCommand(command: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, {
      stdio: "inherit",
      shell: true,
    });

    child.on("error", (err) => {
      p.log.error(chalk.red(`Error: ${err.message}`));
      reject(err);
    });

    child.on("close", (code) => {
      code === 0 ? resolve() : reject(new Error(`Process exited with code ${code}`));
    });
  });
}
