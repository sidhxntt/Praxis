import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  ProCapability,
  ProStack,
  proCapabilities,
  recommendedProCapabilities,
  resolveProCapabilities,
} from "../../src/config/pro";
import { generateProject } from "../../src/generator/generate";

const roots: string[] = [];
afterEach(async () => Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true }))));

async function generate(stack: ProStack, requestedCapabilities: ProCapability[], cloud?: "aws") {
  const root = await mkdtemp(path.join(os.tmpdir(), "praxis-pro-release-"));
  roots.push(root);
  return generateProject({
    schemaVersion: 2,
    name: `release-${stack}`,
    projectType: "pro-backend",
    pro: { stack, requestedCapabilities, resolvedCapabilities: resolveProCapabilities(requestedCapabilities), cloud },
    installDependencies: false,
    initializeGit: false,
  }, { cwd: root });
}

describe("Praxis Pro release matrix", () => {
  it.each(["python-django", "go-gin"] as const)(
    "composes minimal, recommended, and maximal %s projects without unresolved markers",
    async (stack) => {
      for (const capabilities of [[], recommendedProCapabilities, [...proCapabilities]] as ProCapability[][]) {
        const destination = await generate(stack, capabilities, capabilities.includes("terraform") ? "aws" : undefined);
        const config = JSON.parse(await readFile(path.join(destination, "praxis.config.json"), "utf8"));
        expect(config.pro.resolvedCapabilities).toEqual(resolveProCapabilities(capabilities));
        const readme = await readFile(path.join(destination, "README.md"), "utf8");
        expect(readme).toContain(`Stack: \`${stack}\``);
        expect(readme).toContain("Explicitly selected:");
        expect(readme).toContain("Automatically implied:");
        expect(readme).toContain("will not work correctly until its environment is configured");
        for (const file of ["docker-compose.yml", stack === "python-django" ? "pyproject.toml" : "go.mod"]) {
          expect(await readFile(path.join(destination, file), "utf8")).not.toMatch(/\{\{[^}]+\}\}/);
        }
      }
    },
  );

  it("has a resolvable adapter or dedicated infrastructure module for every capability", async () => {
    for (const capability of proCapabilities) {
      const destination = await generate("go-gin", [capability], capability === "terraform" ? "aws" : undefined);
      expect(JSON.parse(await readFile(path.join(destination, "praxis.config.json"), "utf8")).pro.resolvedCapabilities)
        .toContain(capability);
    }
  });
});
