#!/usr/bin/env node

import * as p from "@clack/prompts";
import chalk from 'chalk'
import fs from "fs";
import path from "path";
import selectProjectType from "./prompts/projectType";
import { cancelOperation_onlyforProjectName } from "./controllers/cancelOperation";
import { getUserName, getTimeBasedGreeting, isGitInstalled , showRandomAnimation, isNodeInstalled} from "./controllers/user_touch";

async function main() {
  const userName = getUserName();
  const greeting = getTimeBasedGreeting();
  await showRandomAnimation('Welcome to Praxis ⚡️🚀')

  // Check for Git installation
  if (!isGitInstalled()) {
    p.log.error(chalk.blue("❌ Git is not installed. Please install Git and try again."));
    process.exit(1);
  }
    // Check for Node installation
  if (!isNodeInstalled()) {
    p.log.error(chalk.blue("❌ Node is not installed. Please install Node and try again."));
    process.exit(1);
  }

  p.log.success(chalk.blue(` ${greeting}, ${userName}! Let's set up your project. 🏄`));

  process.on("SIGINT", () => {
    cancelOperation_onlyforProjectName();
  });

  const projectName = await p.text({
    message: "Name of your project",
    placeholder: "my-awesome-app",
    validate(value) {
      if (value.length === 0) return `Name is required!`;
    },
  });

  if (p.isCancel(projectName)) {
    cancelOperation_onlyforProjectName();
  }

  // Create the folder if it doesn't exist
  const projectPath = path.join(process.cwd(), projectName as string);
  if (!fs.existsSync(projectPath)) {
    fs.mkdirSync(projectPath, { recursive: true });
    p.log.success(chalk.green(`📁 Folder created: ${projectPath}`));
  } else {
    p.log.error(chalk.red(`❌ Folder already exists: ${projectPath}`));
    cancelOperation_onlyforProjectName();
  }

  // Change the working directory to the new project folder
  process.chdir(projectPath);

  await selectProjectType(projectName as string);
}

main();
