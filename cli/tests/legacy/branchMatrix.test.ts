import { describe, expect, it } from "vitest";
import { legacyBranchFor } from "../../src/legacy/branchMatrix";

describe("legacy branch compatibility", () => {
  const languages = ["js", "ts"] as const;
  const frameworks = ["vite", "next"] as const;
  const databases = ["mongo", "postgres"] as const;

  it("preserves all frontend branch names", () => {
    for (const language of languages) {
      for (const framework of frameworks) {
        expect(legacyBranchFor({ language, framework })).toBe(
          `${language}-${framework}`,
        );
      }
    }
  });

  it("preserves all backend branch names", () => {
    for (const language of languages) {
      for (const database of databases) {
        expect(legacyBranchFor({ language, database })).toBe(
          `${language}-${database}`,
        );
      }
    }
  });

  it("preserves all fullstack branch names", () => {
    for (const language of languages) {
      for (const framework of frameworks) {
        for (const database of databases) {
          expect(legacyBranchFor({ language, framework, database })).toBe(
            `${language}-${framework}-${database}`,
          );
        }
      }
    }
  });
});
