import { describe, expect, it } from "vitest";
import { formatHelp } from "../../src/cli/help";

describe("formatHelp", () => {
  it("documents every supported command and option", () => {
    const help = formatHelp();

    expect(help).toContain("praxiflow");
    expect(help).toContain("praxiflow create [project-name]");
    expect(help).toContain("--quick");
    expect(help).toContain("--config <file>");
    expect(help).toContain("--no-install");
    expect(help).toContain("praxiflow help");
    expect(help).toContain("praxiflow --help");
    expect(help).toContain("praxiflow -h");
  });
});
