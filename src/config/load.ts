import { readFile } from "node:fs/promises";
import path from "node:path";
import { PraxisConfig, validateConfig } from "./schema";

export async function loadConfigFile(filePath: string): Promise<PraxisConfig> {
  const resolved = path.resolve(filePath);
  try {
    return validateConfig(JSON.parse(await readFile(resolved, "utf8")));
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`Unable to load configuration ${resolved}: ${detail}`);
  }
}
