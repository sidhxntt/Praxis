import { spinner } from "@clack/prompts";
import cloneRepository from "../controllers/cloneRepo";
import displayNextSteps from "../controllers/nextSteps";
import handleError from "../controllers/errorHandling";
import refineProject from "../controllers/refining";
import EndMessage from "../controllers/ending";

type Framework = string;

interface FrameworkConfig {
  branch: string | null;
  message: string | null;
}

class BaseFrameworkInstaller {
  protected readonly projectName: string;
  protected readonly packageName: Framework;
  protected readonly config: FrameworkConfig;
  protected readonly s = spinner();

  constructor(
    packageName: Framework | unknown,
    projectName: string,
    frameworks: Record<Framework, FrameworkConfig>,
  ) {
    this.projectName = projectName;
    if (typeof packageName !== "string" || !(packageName in frameworks)) {
      throw new Error(`Unknown package: ${packageName}`);
    }
    this.packageName = packageName as Framework;
    this.config = frameworks[this.packageName];
  }

  async install() {
    try {
      this.s.start(this.config.message || "Installing framework...");
      await cloneRepository(this.config.branch, this.s);
      await refineProject(this.config.branch);
      displayNextSteps(this.projectName, this.s);
      EndMessage('Coderush')
    } catch (error) {
      handleError(error, this.packageName, this.s);
    }
  }
}

export default BaseFrameworkInstaller