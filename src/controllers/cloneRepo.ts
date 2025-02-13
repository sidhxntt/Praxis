import { spawn } from "child_process";
import * as p from "@clack/prompts";
import chalk from 'chalk'

export default async function cloneRepository(
  branchName: string|null,
  s: any,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const command = `git clone --single-branch --branch ${branchName} https://github.com/sidhxntt/CodeRush.git . > /dev/null 2>&1`;
    const child = spawn(command, { stdio: "inherit", shell: true });

    child.on("error", (err) => {
      s.stop("Error during installation.");
      p.log.error(chalk.red(`Error: ${err.message}`));
      reject(err);
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Process exited with code ${code}`));
      }
    });
  });
}
