import { capitalizeFirstLetter } from "../controllers/user_touch";
import BaseFrameworkInstaller from "./BaseFrameworkInstaller";
import { legacyBranchFor } from "../legacy/branchMatrix";

class FrontedFrameworkInstaller extends BaseFrameworkInstaller {
  constructor(
    packageName: "ts" | "js",
    frameworkType: "vite" | "next",
    projectName: string
  ) {
    const frameworks = {
      ts: {
        branch: legacyBranchFor({ language: "ts", framework: frameworkType }),
        message: `Installing TypeScript ${capitalizeFirstLetter(frameworkType)} Template...`,
      },
      js: {
        branch: legacyBranchFor({ language: "js", framework: frameworkType }),
        message: `Installing JavaScript ${capitalizeFirstLetter(frameworkType)} Template...`,
      },
    };
    super(packageName, projectName, frameworks);
  }
}

export default FrontedFrameworkInstaller
