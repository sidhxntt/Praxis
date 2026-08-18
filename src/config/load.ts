import { readFile } from "node:fs/promises";
import path from "node:path";
import { PraxisConfig, validateConfig } from "./schema";

export async function loadConfigFile(filePath: string): Promise<PraxisConfig> {
  const resolved = path.resolve(filePath);
  try {
    const parsed = JSON.parse(await readFile(resolved, "utf8")) as unknown;
    return validateConfig(normalizeSchemaV1(parsed));
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`Unable to load configuration ${resolved}: ${detail}`);
  }
}

function normalizeSchemaV1(input: unknown): unknown {
  if (!input || typeof input !== "object" || Array.isArray(input)) return input;
  const value = input as Record<string, unknown>;
  if (
    value.schemaVersion !== 1 ||
    !value.backend ||
    typeof value.backend !== "object" ||
    Array.isArray(value.backend)
  ) {
    return input;
  }
  const backend = value.backend as Record<string, unknown>;
  if ("cache" in backend) return input;
  return { ...value, backend: { ...backend, cache: "none" } };
}
