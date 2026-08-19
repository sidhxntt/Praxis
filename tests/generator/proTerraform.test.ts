import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { CloudProvider, ProCapability, resolveProCapabilities } from "../../src/config/pro";
import { generateProject } from "../../src/generator/generate";

const roots: string[] = [];
afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true })));
});

async function generate(cloud: CloudProvider, extra: ProCapability[] = []) {
  const root = await mkdtemp(path.join(os.tmpdir(), "praxis-pro-terraform-"));
  roots.push(root);
  const requested: ProCapability[] = [...extra, "terraform"];
  return generateProject({
    schemaVersion: 2,
    name: "platform-api",
    projectType: "pro-backend",
    pro: {
      stack: "go-gin",
      requestedCapabilities: requested,
      resolvedCapabilities: resolveProCapabilities(requested),
      cloud,
    },
    installDependencies: false,
    initializeGit: false,
  }, { cwd: root });
}

describe("Praxis Pro Terraform output", () => {
  it.each([
    ["aws", ["aws_vpc", "aws_eks_cluster", "aws_db_instance", "aws_ecr_repository", "aws_secretsmanager_secret", "aws_wafv2_web_acl", "aws_budgets_budget"]],
    ["azure", ["azurerm_virtual_network", "azurerm_kubernetes_cluster", "azurerm_postgresql_flexible_server", "azurerm_container_registry", "azurerm_key_vault", "azurerm_web_application_firewall_policy", "azurerm_consumption_budget_resource_group"]],
    ["gcp", ["google_compute_network", "google_container_cluster", "google_sql_database_instance", "google_artifact_registry_repository", "google_secret_manager_secret", "google_compute_security_policy", "google_billing_budget"]],
  ] as const)("generates managed %s production infrastructure", async (cloud, resources) => {
    const destination = await generate(cloud);
    const terraform = path.join(destination, "infra/terraform");
    const main = await readFile(path.join(terraform, "main.tf"), "utf8");
    const versions = await readFile(path.join(terraform, "versions.tf"), "utf8");
    const variables = await readFile(path.join(terraform, "variables.tf"), "utf8");
    const operations = await readFile(path.join(terraform, "README.md"), "utf8");

    for (const resource of resources) expect(main).toContain(`resource "${resource}`);
    expect(versions).toContain("required_version = \">= 1.15.0, < 2.0.0\"");
    expect(variables).toContain("validation {");
    expect(main).toContain("prevent_destroy");
    expect(main).toContain("deletion_protection");
    expect(operations).toContain("backend.example.hcl");
    expect(operations).toContain("terraform plan");
    expect(await readFile(path.join(terraform, "backend.example.hcl"), "utf8"))
      .not.toContain("CHANGE_ME_SECRET");
  });

  it.each(["aws", "azure", "gcp"] as const)(
    "emits only selected managed service resources for %s",
    async (cloud) => {
      const destination = await generate(cloud, ["redis-cache", "object-storage", "search"]);
      const names = await readdir(path.join(destination, "infra/terraform"));
      expect(names).toEqual(expect.arrayContaining(["cache.tf", "storage.tf", "search.tf"]));
      const cache = await readFile(path.join(destination, "infra/terraform/cache.tf"), "utf8");
      const storage = await readFile(path.join(destination, "infra/terraform/storage.tf"), "utf8");
      const search = await readFile(path.join(destination, "infra/terraform/search.tf"), "utf8");
      expect(cache.length).toBeGreaterThan(100);
      expect(storage.length).toBeGreaterThan(100);
      expect(search).toContain("kubernetes_manifest");

      const minimal = await generate(cloud);
      const minimalNames = await readdir(path.join(minimal, "infra/terraform"));
      expect(minimalNames).not.toEqual(expect.arrayContaining(["cache.tf", "storage.tf", "search.tf"]));
    },
  );
});
