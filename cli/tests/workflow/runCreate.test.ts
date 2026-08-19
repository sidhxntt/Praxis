import * as p from "@clack/prompts";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { quickConfig } from "../../src/config/schema";
import { runCreate } from "../../src/workflow/runCreate";
import { resolveUiStyle } from "../../src/ui/resolveUi";
import { generateProject } from "../../src/generator/generate";

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
vi.mock("../../src/ui/resolveUi", () => ({
  resolveUiStyle: vi.fn(async () => "apple"),
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
      .mockResolvedValueOnce("starter" as never)
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
        "Use a landing page template?",
        "Database",
        "Authentication",
        "Cache",
        "Package manager",
      ]);
  });

  it("offers all frameworks and resolves a visual template immediately after framework", async () => {
    vi.mocked(p.text).mockResolvedValue("acme" as never);
    vi.mocked(p.select)
      .mockResolvedValueOnce("frontend" as never)
      .mockResolvedValueOnce("javascript" as never)
      .mockResolvedValueOnce("vue" as never)
      .mockResolvedValueOnce("template" as never)
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

    const frameworkPrompt = vi.mocked(p.select).mock.calls[2][0];
    expect(frameworkPrompt.options).toEqual([
      { value: "next", label: "Next.js" },
      { value: "vite", label: "Vite (React)" },
      { value: "vue", label: "Vue" },
      { value: "astro", label: "Astro" },
      { value: "angular", label: "Angular (TypeScript only)" },
    ]);
    expect(resolveUiStyle).toHaveBeenCalledOnce();
    expect(vi.mocked(generateProject).mock.calls.at(-1)?.[0]).toMatchObject({
      language: "javascript",
      frontend: { framework: "vue", ui: { mode: "template", style: "apple" } },
    });
  });

  it("explains Angular's constraint and can continue by switching to TypeScript", async () => {
    vi.mocked(p.text).mockResolvedValue("angular-app" as never);
    vi.mocked(p.select)
      .mockResolvedValueOnce("frontend" as never)
      .mockResolvedValueOnce("javascript" as never)
      .mockResolvedValueOnce("angular" as never)
      .mockResolvedValueOnce("typescript" as never)
      .mockResolvedValueOnce("starter" as never)
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

    expect(vi.mocked(p.select).mock.calls[3][0]).toMatchObject({
      message: "Angular requires TypeScript",
      options: [
        { value: "typescript", label: "Continue with TypeScript" },
        { value: "reselect", label: "Choose another framework" },
      ],
    });
    expect(vi.mocked(generateProject).mock.calls.at(-1)?.[0]).toMatchObject({
      language: "typescript",
      frontend: { framework: "angular", ui: { mode: "starter" } },
    });
  });

  it("skips framework and template prompts for backend-only projects", async () => {
    vi.mocked(p.text).mockResolvedValue("api" as never);
    vi.mocked(p.select)
      .mockResolvedValueOnce("backend" as never)
      .mockResolvedValueOnce("typescript" as never)
      .mockResolvedValueOnce("postgres" as never)
      .mockResolvedValueOnce("none" as never)
      .mockResolvedValueOnce("none" as never)
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
        "Database",
        "Authentication",
        "Cache",
        "Package manager",
      ]);
    expect(resolveUiStyle).not.toHaveBeenCalled();
  });

  it("runs the Pro stack and capability flow with conditional cloud selection", async () => {
    vi.mocked(p.text).mockResolvedValue("acme-api" as never);
    vi.mocked(p.select)
      .mockResolvedValueOnce("pro-backend" as never)
      .mockResolvedValueOnce("go-gin" as never)
      .mockResolvedValueOnce("aws" as never);
    vi.mocked(p.multiselect)
      .mockResolvedValueOnce(["jwt-auth"] as never)
      .mockResolvedValueOnce(["redis-cache"] as never)
      .mockResolvedValueOnce(["sentry"] as never)
      .mockResolvedValueOnce(["terraform"] as never);
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
      .toEqual(["Project type", "Backend stack", "Terraform cloud"]);
    expect(vi.mocked(p.multiselect).mock.calls.map(([options]) => options.message))
      .toEqual([
        "Authentication and access",
        "Application services",
        "Observability and operations",
        "Deployment and reliability",
      ]);
  });
});
