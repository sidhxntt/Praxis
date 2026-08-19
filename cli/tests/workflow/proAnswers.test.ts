import { describe, expect, it } from "vitest";
import { proAnswersToConfig } from "../../src/workflow/answers";

describe("proAnswersToConfig", () => {
  it("records requested and deterministically resolved capabilities", () => {
    expect(proAnswersToConfig({
      name: "payments-api",
      stack: "python-django",
      capabilities: ["scheduled-jobs", "terraform"],
      cloud: "azure",
      installDependencies: true,
      initializeGit: false,
    })).toEqual({
      schemaVersion: 2,
      name: "payments-api",
      projectType: "pro-backend",
      pro: {
        stack: "python-django",
        requestedCapabilities: ["scheduled-jobs", "terraform"],
        resolvedCapabilities: [
          "redis-cache",
          "background-jobs",
          "scheduled-jobs",
          "kubernetes",
          "terraform",
          "autoscaling",
          "high-availability",
          "edge-protection",
          "database-resilience",
          "cloud-secrets",
        ],
        cloud: "azure",
      },
      installDependencies: true,
      initializeGit: false,
    });
  });
});
