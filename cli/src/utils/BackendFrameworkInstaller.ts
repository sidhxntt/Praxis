import BaseFrameworkInstaller from "./BaseFrameworkInstaller";
import { legacyBranchFor } from "../legacy/branchMatrix";

class BackendFrameworkInstaller extends BaseFrameworkInstaller {
  constructor(
    packageName: "mongo" | "postgres",
    projectName: string,
    isTypescript: boolean = false,
  ) {
    const frameworks = {
      mongo: {
        branch: legacyBranchFor({ language: isTypescript ? "ts" : "js", database: "mongo" }),
        message: `Installing ${isTypescript ? "TypeScript" : "JavaScript"} MongoDB framework...`,
      },
      postgres: {
        branch: legacyBranchFor({ language: isTypescript ? "ts" : "js", database: "postgres" }),
        message: `Installing ${isTypescript ? "TypeScript" : "JavaScript"} Postgres framework...`,
      },
    };
    super(packageName, projectName, frameworks);
  }
}

export default BackendFrameworkInstaller
