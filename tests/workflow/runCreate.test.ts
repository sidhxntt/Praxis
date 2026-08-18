import { describe, expect, it, vi } from "vitest";
import { quickConfig } from "../../src/config/schema";
import { runCreate } from "../../src/workflow/runCreate";

describe("runCreate", () => {
  it("shows the approved splash before resolving config or prompting for a name", async () => {
    const events: string[] = [];
    const config = quickConfig("acme");

    await runCreate(
      {
        kind: "create",
        projectName: undefined,
        mode: "custom",
        configPath: undefined,
        installDependencies: true,
      },
      {
        showSplash: vi.fn(async (message) => {
          events.push(`splash:${message}`);
        }),
        resolveConfig: vi.fn(async () => {
          events.push("resolve");
          return config;
        }),
        generate: vi.fn(async () => "/tmp/acme"),
      },
    );

    expect(events).toEqual([
      "splash:Welcome to Praxis ⚡️🚀",
      "resolve",
    ]);
  });
});
