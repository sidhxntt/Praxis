import * as p from "@clack/prompts";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { quickConfig } from "../../src/config/schema";
import { runCreate } from "../../src/workflow/runCreate";

vi.mock("@clack/prompts", () => ({
  intro: vi.fn(),
  outro: vi.fn(),
  note: vi.fn(),
  cancel: vi.fn(),
  isCancel: vi.fn(() => false),
  text: vi.fn(),
  select: vi.fn(),
  multiselect: vi.fn(),
  confirm: vi.fn(),
  spinner: vi.fn(() => ({ start: vi.fn(), stop: vi.fn() })),
}));
vi.mock("../../src/controllers/user_touch", () => ({
  showRandomAnimation: vi.fn(async () => undefined),
}));
vi.mock("../../src/generator/generate", () => ({
  generateProject: vi.fn(async () => "/tmp/acme"),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

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

  it("prompts for cache after authentication in the custom backend flow", async () => {
    vi.mocked(p.text).mockResolvedValue("acme" as never);
    vi.mocked(p.select)
      .mockResolvedValueOnce("fullstack" as never)
      .mockResolvedValueOnce("typescript" as never)
      .mockResolvedValueOnce("next" as never)
      .mockResolvedValueOnce("postgres" as never)
      .mockResolvedValueOnce("self-hosted" as never)
      .mockResolvedValueOnce("redis" as never)
      .mockResolvedValueOnce("npm" as never);
    vi.mocked(p.multiselect).mockResolvedValue([] as never);
    vi.mocked(p.confirm)
      .mockResolvedValueOnce(false as never)
      .mockResolvedValueOnce(false as never);

    await runCreate({
      kind: "create",
      projectName: undefined,
      mode: "custom",
      configPath: undefined,
      installDependencies: true,
    });

    expect(vi.mocked(p.select).mock.calls.map(([options]) => options.message))
      .toEqual([
        "Project type",
        "Language",
        "Frontend framework",
        "Database",
        "Authentication",
        "Cache",
        "Package manager",
      ]);
  });
});
