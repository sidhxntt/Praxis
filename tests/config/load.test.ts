import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { quickConfig } from "../../src/config/schema";
import { loadConfigFile } from "../../src/config/load";

const roots: string[] = [];
afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true })));
});

describe("loadConfigFile", () => {
  it("loads and validates a JSON configuration", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "praxis-config-"));
    roots.push(root);
    const file = path.join(root, "praxis.config.json");
    await writeFile(file, JSON.stringify(quickConfig("acme")));
    expect(await loadConfigFile(file)).toEqual(quickConfig("acme"));
  });

  it("reports malformed JSON with the file name", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "praxis-config-"));
    roots.push(root);
    const file = path.join(root, "broken.json");
    await writeFile(file, "{");
    await expect(loadConfigFile(file)).rejects.toThrow(
      `Unable to load configuration ${file}`,
    );
  });
});
