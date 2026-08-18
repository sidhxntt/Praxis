import { describe, expect, it } from "vitest";
import { parseCommand } from "../../src/cli/command";

describe("parseCommand", () => {
  it("preserves the existing workflow when no command is supplied", () => {
    expect(parseCommand([])).toEqual({ kind: "legacy" });
  });

  it("supports an explicit legacy command", () => {
    expect(parseCommand(["legacy"])).toEqual({ kind: "legacy" });
  });

  it("parses a quick create command", () => {
    expect(parseCommand(["create", "acme", "--quick"])).toEqual({
      kind: "create",
      projectName: "acme",
      mode: "quick",
      configPath: undefined,
      installDependencies: true,
    });
  });

  it("parses config and no-install options", () => {
    expect(
      parseCommand([
        "create",
        "--config",
        "team.praxis.json",
        "--no-install",
      ]),
    ).toEqual({
      kind: "create",
      projectName: undefined,
      mode: "config",
      configPath: "team.praxis.json",
      installDependencies: false,
    });
  });

  it("rejects unsupported commands", () => {
    expect(() => parseCommand(["destroy"])).toThrow(
      'Unknown command "destroy"',
    );
  });
});
