import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("Praxis Pro infrastructure release contracts", () => {
  it("documents validation, state safety, identity, rollback, and cost controls", async () => {
    const terraform = await readFile(path.resolve("templates/pro.terraform.shared/files/common/infra/terraform/README.md"), "utf8");
    for (const topic of ["terraform validate", "remote state", "workload identity", "rollback", "cost"]) {
      expect(terraform.toLowerCase()).toContain(topic);
    }
    const kubernetes = await readFile(path.resolve("templates/pro.kubernetes/files/common/k8s/README.md"), "utf8");
    for (const topic of ["kustomize", "secret", "rollback", "network policy", "disaster recovery"]) {
      expect(kubernetes.toLowerCase()).toContain(topic);
    }
  });
});
