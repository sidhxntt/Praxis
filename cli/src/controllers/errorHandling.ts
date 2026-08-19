import {log} from "@clack/prompts";
import chalk from 'chalk'

export default function handleError(error: unknown, packageName: string, s:any) {
    s.stop(chalk.red(`Error during installation`));
    if (error instanceof Error) {
      log.error(chalk.red(`Failed to install ${packageName}: ${error.message}`));
    } else {
      log.error(chalk.red(`Unknown error occurred: ${error}`));
    }
    throw error;
  }