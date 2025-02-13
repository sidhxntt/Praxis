import { capitalizeFirstLetter } from "../controllers/user_touch";
import BaseFrameworkInstaller from "./BaseFrameworkInstaller";

class FrontedFrameworkInstaller extends BaseFrameworkInstaller {
  constructor(
    packageName: "ts" | "js",
    frameworkType: "vite" | "next",
    projectName: string
  ) {
    const frameworks = {
      ts: {
        branch: `ts-${frameworkType}`,
        message: `Installing TypeScript ${capitalizeFirstLetter(frameworkType)} Template...`,
      },
      js: {
        branch: `js-${frameworkType}`,
        message: `Installing JavaScript ${capitalizeFirstLetter(frameworkType)} Template...`,
      },
    };
    super(packageName, projectName, frameworks);
  }
}

export default FrontedFrameworkInstaller