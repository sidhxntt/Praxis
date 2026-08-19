import BaseFrameworkInstaller from "./BaseFrameworkInstaller";
import { legacyBranchFor } from "../legacy/branchMatrix";

type DatabaseType = "mongo" | "postgres";

interface FrameworkConfig {
  branch: string;
  message: string;
}

abstract class FullstackFrameworkInstaller extends BaseFrameworkInstaller {
  protected createFrameworkConfigs(
    isTypescript: boolean,
    framework: string
  ): Record<DatabaseType, FrameworkConfig> {
    return {
      mongo: {
        branch: legacyBranchFor({
          language: isTypescript ? "ts" : "js",
          framework: framework as "vite" | "next",
          database: "mongo",
        }),
        message: `Installing ${isTypescript ? "TypeScript" : "JavaScript"} ${
          framework.charAt(0).toUpperCase() + framework.slice(1)
        } MongoDB framework...`,
      },
      postgres: {
        branch: legacyBranchFor({
          language: isTypescript ? "ts" : "js",
          framework: framework as "vite" | "next",
          database: "postgres",
        }),
        message: `Installing ${isTypescript ? "TypeScript" : "JavaScript"} ${
          framework.charAt(0).toUpperCase() + framework.slice(1)
        } Postgres framework...`,
      },
    };
  }

  constructor(
    packageName: DatabaseType,
    projectName: string,
    framework: string,
    isTypescript: boolean = false
  ) {
    const frameworks =
      FullstackFrameworkInstaller.prototype.createFrameworkConfigs(
        isTypescript,
        framework
      );
    super(packageName, projectName, frameworks);
  }
}

class ViteFullstackFrameworkInstaller extends FullstackFrameworkInstaller {
  constructor(
    packageName: DatabaseType,
    projectName: string,
    isTypescript: boolean = false
  ) {
    super(packageName, projectName, "vite", isTypescript);
  }
}

class NextFullstackFrameworkInstaller extends FullstackFrameworkInstaller {
  constructor(
    packageName: DatabaseType,
    projectName: string,
    isTypescript: boolean = false
  ) {
    super(packageName, projectName, "next", isTypescript);
  }
}

export { ViteFullstackFrameworkInstaller, NextFullstackFrameworkInstaller };
