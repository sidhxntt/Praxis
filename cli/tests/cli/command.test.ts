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

  it.each([["create", "help"], ["create", "--help"], ["create", "-h"]])(
    "parses %s %s as help",
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

  it("parses custom mode without the create alias", () => {
    expect(parseCommand(["--custom"])).toEqual({
      kind: "create",
      projectName: undefined,
      mode: "custom",
      configPath: undefined,
      installDependencies: true,
    });
  });

  it("parses a positional project name without the create alias", () => {
    expect(parseCommand(["my-app"])).toEqual({
      kind: "create",
      projectName: "my-app",
      mode: "custom",
      configPath: undefined,
      installDependencies: true,
    });
  });

  it("parses quick mode without the create alias", () => {
    expect(parseCommand(["--quick"])).toEqual({
      kind: "create",
      projectName: undefined,
      mode: "quick",
      configPath: undefined,
      installDependencies: true,
    });
  });

  it("parses config mode without the create alias", () => {
    expect(parseCommand(["--config", "team.praxis.json"])).toEqual({
      kind: "create",
      projectName: undefined,
      mode: "config",
      configPath: "team.praxis.json",
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

  it.each([
    ["--quick", "--custom"],
    ["--custom", "--quick"],
    ["--quick", "--config", "team.praxis.json"],
    ["--config", "team.praxis.json", "--quick"],
    ["--custom", "--config", "team.praxis.json"],
    ["--config", "team.praxis.json", "--custom"],
  ])("rejects conflicting create modes: %s", (...args) => {
    expect(() => parseCommand(args)).toThrow(
      'Choose only one of "--custom", "--quick", or "--config".',
    );
  });

  it("rejects an unknown single-dash flag", () => {
    expect(() => parseCommand(["-x"])).toThrow(
      'Unknown option "-x". Run "praxiflow help" for usage.',
    );
  });
});
