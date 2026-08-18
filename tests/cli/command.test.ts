import { describe, expect, it } from "vitest";
import { parseCommand } from "../../src/cli/command";

describe("parseCommand", () => {
  it("starts the custom create workflow when no command is supplied", () => {
    expect(parseCommand([])).toEqual({
      kind: "create",
      projectName: undefined,
      mode: "custom",
      configPath: undefined,
      installDependencies: true,
    });
  });

  it.each([["help"], ["--help"], ["-h"]])(
    "parses %s as help",
    (...args) => {
      expect(parseCommand(args)).toEqual({ kind: "help" });
    },
  );

  it("keeps create --custom as a compatibility alias", () => {
    expect(parseCommand(["create", "acme", "--custom"])).toEqual({
      kind: "create",
      projectName: "acme",
      mode: "custom",
      configPath: undefined,
      installDependencies: true,
    });
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
      'Unknown command "destroy". Run "praxiflow help" for usage.',
    );
  });

  it("rejects the removed legacy command with a help pointer", () => {
    expect(() => parseCommand(["legacy"])).toThrow(
      'Unknown command "legacy". Run "praxiflow help" for usage.',
    );
  });
});
