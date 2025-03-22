import { spawn } from "child_process";

export default async function refineProject(
  branchName: string|null,
): Promise<void> {
  if(!branchName) {
    
  }
  return new Promise((resolve, reject) => {
    const command = `rm -rf .git && rm -f .DS_Store && cp -rf ${branchName}-template/ . && rm -rf ${branchName}-template/`;
    const refineProcess = spawn(command, { stdio: "inherit", shell: true });

    refineProcess.on("close", (refineCode) => {
      if (refineCode === 0) {
        resolve();
      } else {
        reject(new Error("Refining process failed."));
      }
    });
  });
}
