import { describe, expect, it, vi } from "vitest";
import { runCli } from "../../src/cli/run";

describe("runCli", () => {
  it("delegates no-argument invocation to the untouched legacy workflow", async () => {
    const legacy = vi.fn(async () => undefined);
    const create = vi.fn(async () => undefined);
    await runCli([], { legacy, create });
    expect(legacy).toHaveBeenCalledOnce();
    expect(create).not.toHaveBeenCalled();
  });

  it("delegates create invocation to the composable workflow", async () => {
    const legacy = vi.fn(async () => undefined);
    const create = vi.fn(async () => undefined);
    await runCli(["create", "acme", "--quick", "--no-install"], {
      legacy,
      create,
    });
    expect(legacy).not.toHaveBeenCalled();
    expect(create).toHaveBeenCalledWith({
      kind: "create",
      projectName: "acme",
      mode: "quick",
      configPath: undefined,
      installDependencies: false,
    });
  });
});
