import { readFile } from "node:fs/promises";
import path from "node:path";

export async function renderDesignDoc(moduleRoot) {
  const contents = await readFile(path.join(moduleRoot, "DESIGN.md"), "utf8");
  if (!contents.includes("not affiliated")) {
    throw new Error("generated design documentation must include a no-affiliation notice");
  }
  return contents.endsWith("\n") ? contents : `${contents}\n`;
}
