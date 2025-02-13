import BaseFrameworkInstaller from "./BaseFrameworkInstaller";

class BackendFrameworkInstaller extends BaseFrameworkInstaller {
  constructor(
    packageName: "mongo" | "postgres",
    projectName: string,
    isTypescript: boolean = false,
  ) {
    const frameworks = {
      mongo: {
        branch: isTypescript ? "ts-mongo" : "js-mongo",
        message: `Installing ${isTypescript ? "TypeScript" : "JavaScript"} MongoDB framework...`,
      },
      postgres: {
        branch: isTypescript ? "ts-postgres" : "js-postgres",
        message: `Installing ${isTypescript ? "TypeScript" : "JavaScript"} Postgres framework...`,
      },
    };
    super(packageName, projectName, frameworks);
  }
}

export default BackendFrameworkInstaller