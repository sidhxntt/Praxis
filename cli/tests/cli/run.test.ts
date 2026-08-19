import { describe, expect, it, vi } from "vitest";
import { runCli } from "../../src/cli/run";

describe("runCli", () => {
  it("delegates no-argument invocation to the custom composable workflow", async () => {
    const create = vi.fn(async () => undefined);
    await runCli([], { create });
    expect(create).toHaveBeenCalledWith({
      kind: "create",
      projectName: undefined,
      mode: "custom",
      configPath: undefined,
      installDependencies: true,
    });
  });

  it("delegates create invocation to the composable workflow", async () => {
    const create = vi.fn(async () => undefined);
    await runCli(["create", "acme", "--quick", "--no-install"], {
      create,
    });
    expect(create).toHaveBeenCalledWith({
      kind: "create",
      projectName: "acme",
      mode: "quick",
      configPath: undefined,
      installDependencies: false,
    });
  });

  it("writes help without starting the create workflow", async () => {
    const create = vi.fn(async () => undefined);
    const write = vi.fn();
    await runCli(["help"], { create, write });
    expect(create).not.toHaveBeenCalled();
    expect(write).toHaveBeenCalledOnce();
    expect(write.mock.calls[0][0]).toContain("praxiflow --help");
  });
});
