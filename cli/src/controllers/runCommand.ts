import { exec } from 'child_process';
import * as p from "@clack/prompts";
import chalk from 'chalk';

export function runCommand(command: string): Promise<void> {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        p.log.error(chalk.red(`Error: ${error.message}`));
        return reject(error);
      }

      if (stderr) {
        p.log.warn(chalk.yellow(stderr));
      }

      resolve();
    });
  });
}