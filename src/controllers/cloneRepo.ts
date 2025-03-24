import { spawn } from 'child_process';
import * as p from "@clack/prompts";
import color from "picocolors";

export default async function cloneRepository(
  branchName: string | null,
  s: any
): Promise<void> {
  if (!branchName) {
    throw new Error('Branch name is required');
  }

  const repoUrl = 'https://github.com/sidhxntt/Jolt.git';

  return new Promise((resolve, reject) => {
    try {
      s.message = `Cloning branch ${branchName}...`;

      const cloneProcess = spawn('git', [
        'clone',
        '--single-branch',
        '--branch',
        branchName,
        '--quiet',
        repoUrl,
        '.'
      ], { 
        stdio: 'inherit' 
      });

      cloneProcess.on('error', (error) => {
        s.stop("Error during installation.");
        p.log.error(color.red(`Git clone error: ${error.message}`));
        reject(error);
      });

      cloneProcess.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          s.stop("Error during installation.");
          const errorMessage = `Git clone failed with code ${code}`;
          p.log.error(color.red(`Error: ${errorMessage}`));
          reject(new Error(errorMessage));
        }
      });
    } catch (error: any) {
      s.stop("Error during installation.");
      p.log.error(color.red(`Error: ${error.message}`));
      reject(error);
    }
  });
}