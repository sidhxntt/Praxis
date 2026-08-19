import { describe, expect, it } from "vitest";
import {
  recommendedProCapabilities,
  resolveProCapabilities,
} from "../../src/config/pro";
import { validateConfig } from "../../src/config/schema";

function proConfig(overrides: Record<string, unknown> = {}) {
  return {
    schemaVersion: 2,
    name: "payments-api",
    projectType: "pro-backend",
    pro: {
      stack: "python-django",
      requestedCapabilities: [],
      resolvedCapabilities: [],
    },
    installDependencies: true,
    initializeGit: true,
    ...overrides,
  };
}

describe("Praxis Pro configuration", () => {
  it("accepts a minimal Django configuration", () => {
    expect(validateConfig(proConfig())).toEqual(proConfig());
  });

  it("accepts a minimal Go configuration", () => {
    const config = proConfig({
      pro: {
        stack: "go-gin",
        requestedCapabilities: [],
        resolvedCapabilities: [],
      },
    });
    expect(validateConfig(config)).toEqual(config);
  });

  it("requires schema version 2 for Pro", () => {
    expect(() => validateConfig(proConfig({ schemaVersion: 1 }))).toThrow(
      "pro-backend requires schemaVersion 2",
    );
  });

  it("rejects an unsupported stack", () => {
    const config = proConfig({
      pro: {
        stack: "node-express",
        requestedCapabilities: [],
        resolvedCapabilities: [],
      },
    });
    expect(() => validateConfig(config)).toThrow("pro stack is unsupported");
  });

  it("rejects duplicate and unknown capabilities", () => {
    const duplicate = proConfig({
      pro: {
        stack: "python-django",
        requestedCapabilities: ["redis-cache", "redis-cache"],
        resolvedCapabilities: ["redis-cache"],
      },
    });
    expect(() => validateConfig(duplicate)).toThrow(
      "requested Pro capabilities must be unique",
    );

    const unknown = proConfig({
      pro: {
        stack: "python-django",
        requestedCapabilities: ["magic"],
        resolvedCapabilities: ["magic"],
      },
    });
    expect(() => validateConfig(unknown)).toThrow(
      "requested Pro capabilities contain an unsupported capability",
    );
  });

  it("requires an exact deterministic resolution", () => {
    const config = proConfig({
      pro: {
        stack: "python-django",
        requestedCapabilities: ["realtime"],
        resolvedCapabilities: ["realtime"],
      },
    });
    expect(() => validateConfig(config)).toThrow(
      "resolved Pro capabilities do not match requested capabilities",
    );
  });

  it("requires cloud exactly when Terraform is selected", () => {
    const terraformCapabilities = resolveProCapabilities(["terraform"]);
    const missing = proConfig({
      pro: {
        stack: "python-django",
        requestedCapabilities: ["terraform"],
        resolvedCapabilities: terraformCapabilities,
      },
    });
    expect(() => validateConfig(missing)).toThrow(
      "cloud is required when Terraform is selected",
    );

    const unexpected = proConfig({
      pro: {
        stack: "python-django",
        requestedCapabilities: [],
        resolvedCapabilities: [],
        cloud: "aws",
      },
    });
    expect(() => validateConfig(unexpected)).toThrow(
      "cloud is only allowed when Terraform is selected",
    );
  });

  it("rejects legacy-only top-level keys", () => {
    expect(() => validateConfig(proConfig({ language: "typescript" }))).toThrow(
      'unknown configuration key "language"',
    );
  });
});

describe("resolveProCapabilities", () => {
  it("adds JWT authentication for fine-grained authorization", () => {
    expect(resolveProCapabilities(["fine-grained-auth"])).toEqual([
      "jwt-auth",
      "fine-grained-auth",
    ]);
  });
  it("uses Redis for background jobs", () => {
    expect(resolveProCapabilities(["background-jobs"])).toEqual([
      "redis-cache",
      "background-jobs",
    ]);
  });

  it("resolves implications in deterministic catalog order", () => {
    expect(
      resolveProCapabilities([
        "terraform",
        "email-tasks",
        "scheduled-jobs",
        "realtime",
      ]),
    ).toEqual([
      "redis-cache",
      "background-jobs",
      "scheduled-jobs",
      "email-tasks",
      "realtime",
      "kubernetes",
      "terraform",
      "autoscaling",
      "high-availability",
      "edge-protection",
      "database-resilience",
      "cloud-secrets",
    ]);
  });

  it("provides the approved recommended defaults", () => {
    expect(recommendedProCapabilities).toEqual([
      "redis-cache",
      "background-jobs",
      "sentry",
      "prometheus",
      "opentelemetry",
      "nginx",
      "autoscaling",
      "high-availability",
      "edge-protection",
      "database-resilience",
      "cloud-secrets",
    ]);
  });
});
