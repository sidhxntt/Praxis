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
    expect(help).toContain("Next.js");
    expect(help).toContain("Vite (React)");
    expect(help).toContain("Vue");
    expect(help).toContain("Astro");
    expect(help).toContain("Angular (TypeScript only)");
    expect(help).toContain("40");
    expect(help).toContain("local visual gallery");
    expect(help).toContain("terminal fallback");
    expect(help).toContain("DESIGN.md");
  });
});
