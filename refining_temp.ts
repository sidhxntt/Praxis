import { join } from 'path';
import { rm, cp, access } from 'fs/promises';
import { constants } from 'fs';

export default async function refineProject(
  branchName: string|null,
  frontend: boolean
): Promise<void> {
  try {
    // Check if branchName is provided
    if (!branchName) {
      throw new Error('Branch name is required');
    }

    // Helper function to check if path exists
    async function pathExists(path: string): Promise<boolean> {
      try {
        await access(path, constants.F_OK);
        return true;
      } catch {
        return false;
      }
    }

    const gitPath = join(process.cwd(), '.git');
    const dsStorePath = join(process.cwd(), '.DS_Store');
    
    // Remove .git directory if it exists
    if (await pathExists(gitPath)) {
      await rm(gitPath, { recursive: true, force: true });
    }
    
    // Remove .DS_Store if it exists
    if (await pathExists(dsStorePath)) {
      await rm(dsStorePath, { force: true });
    }
    
    // Determine source directory name based on frontend flag
    const sourceDirName = frontend ? branchName : `${branchName}-template`;
    
    // Get absolute paths
    const sourceDir = join(process.cwd(), sourceDirName);
    const currentDir = process.cwd();
    
    // Check if source directory exists
    if (!(await pathExists(sourceDir))) {
      throw new Error(`Source directory '${sourceDirName}' does not exist`);
    }
    
    // Copy all contents from source directory to current directory
    await cp(sourceDir, currentDir, {
      recursive: true,
      force: true
    });
    
    // Remove the source directory after copying
    await rm(sourceDir, { recursive: true, force: true });
    
  } catch (error: any) {
    throw new Error(`Refining process failed: ${error.message}`);
  }
}