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
  if (value.schemaVersion !== 1) return input;

  let normalized = value;
  if (
    value.backend
    && typeof value.backend === "object"
    && !Array.isArray(value.backend)
    && !("cache" in value.backend)
  ) {
    normalized = {
      ...normalized,
      backend: { ...(value.backend as Record<string, unknown>), cache: "none" },
    };
  }
  if (
    value.frontend
    && typeof value.frontend === "object"
    && !Array.isArray(value.frontend)
    && !("ui" in value.frontend)
  ) {
    normalized = {
      ...normalized,
      frontend: {
        ...(value.frontend as Record<string, unknown>),
        ui: { mode: "starter" },
      },
    };
  }
  return normalized;
}
