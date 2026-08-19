import fs from 'fs/promises';
import path from 'path';

export default async function refineProject(
  branchName: string | null,
): Promise<void> {
  if (!branchName) {
    throw new Error("Branch name is required");
  }

  const currentDir = process.cwd();
  const templateDir = path.join(currentDir, `${branchName}-template`);

  try {
    // Remove .git directory
    await fs.rm(path.join(currentDir, '.git'), { 
      recursive: true, 
      force: true 
    }).catch(() => {}); // Ignore if .git doesn't exist

    // Remove .DS_Store
    await fs.unlink(path.join(currentDir, '.DS_Store')).catch(() => {});

    // Copy template contents
    await fs.cp(templateDir, currentDir, { 
      recursive: true, 
      force: true 
    });

    // Remove template directory
    await fs.rm(templateDir, { 
      recursive: true, 
      force: true 
    });
  } catch (error) {
    throw new Error(`Refining process failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}