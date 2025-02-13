import simpleGit from 'simple-git';
import * as p from "@clack/prompts";
import color from "picocolors";

export default async function cloneRepository(
  branchName: string|null,
  s: any,
): Promise<void> {
  if (!branchName) {
    throw new Error('Branch name is required');
  }

  const git = simpleGit();
  const repoUrl = 'https://github.com/sidhxntt/CodeRush.git';

  try {
    s.message = `Cloning branch ${branchName}...`;
    
    await git.clone(repoUrl, '.', [
      '--single-branch',
      '--branch',
      branchName,
      '--quiet'
    ]);

    return Promise.resolve();
  } catch (error: any) {
    s.stop("Error during installation.");
    p.log.error(color.red(`Error: ${error.message}`));
    throw error;
  }
}