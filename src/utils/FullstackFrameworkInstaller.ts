import BaseFrameworkInstaller from "./BaseFrameworkInstaller";

class FullstackFrameworkInstaller extends BaseFrameworkInstaller {
  constructor(
    packageName: "mongo" | "postgres",
    projectName: string,
    isTypescript: boolean = false,
  ) {
    const frameworks = {
      mongo: {
        branch: isTypescript ? "ts-vite-mongo" : "js-vite-mongo",
        message: `Installing ${isTypescript ? "TypeScript" : "JavaScript"} Vite MongoDB framework...`,
      },
      postgres: {
        branch: isTypescript ? "ts-vite-postgres" : "js-vite-postgres",
        message: `Installing ${isTypescript ? "TypeScript" : "JavaScript"} Vite Postgres framework...`,
      },
    };
    super(packageName, projectName, frameworks);
  }
}

export default FullstackFrameworkInstaller