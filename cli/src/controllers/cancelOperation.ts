import * as p from "@clack/prompts";
import chalk from 'chalk'

export  function cancelOperation(input: unknown | string | symbol) {
  if (p.isCancel(input)) {
    p.outro(chalk.red(`❌ Operation Cancelled.`));
    process.exit(0);
  }
}

export function cancelOperation_onlyforProjectName() {
  p.outro(chalk.red(`❌ Operation Cancelled.`));
  process.exit(0);
}
