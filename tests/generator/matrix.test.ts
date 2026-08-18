import { access, mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { PraxisConfig, validateConfig } from "../../src/config/schema";
import { generateProject } from "../../src/generator/generate";

const roots: string[] = [];
afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true })));
});

async function generate(
  input: Omit<PraxisConfig, "schemaVersion" | "installDependencies" | "initializeGit" | "packageManager">,
  packageManager: PraxisConfig["packageManager"] = "npm",
) {
  const root = await mkdtemp(path.join(os.tmpdir(), "praxis-matrix-"));
  roots.push(root);
  const config = validateConfig({
    schemaVersion: 1,
    ...input,
    packageManager,
    installDependencies: false,
    initializeGit: false,
  });
  return generateProject(config, { cwd: root });
}

describe("bundled template matrix", () => {
  it("generates a JavaScript Vite frontend with Vercel and Docker", async () => {
    const output = await generate({
      name: "vite-app",
      projectType: "frontend",
      language: "javascript",
      frontend: { framework: "vite", styling: "tailwind-shadcn" },
      deployment: ["vercel", "docker"],
    });
    await expect(access(path.join(output, "src/App.jsx"))).resolves.toBeUndefined();
    await expect(access(path.join(output, "backend"))).rejects.toThrow();
    expect(await readFile(path.join(output, "docker-compose.yml"), "utf8"))
      .toContain('"3000:80"');
  });

  it("generates a TypeScript Express/Postgres backend with self-hosted auth", async () => {
    const output = await generate({
      name: "api",
      projectType: "backend",
      language: "typescript",
      backend: {
        framework: "express",
        database: "postgres",
        auth: "self-hosted",
        cache: "none",
      },
      deployment: ["railway", "docker"],
    });
    expect(await readFile(path.join(output, "src/server.ts"), "utf8"))
      .toContain('app.use("/api/auth", authRouter)');
    expect(await readFile(path.join(output, "prisma/schema.prisma"), "utf8"))
      .toContain('provider = "postgresql"');
    expect(await readFile(path.join(output, "docker-compose.yml"), "utf8"))
      .toContain("context: .");
    expect(await readFile(path.join(output, "docker-compose.yml"), "utf8"))
      .toContain("required: false");
  });

  it("generates a TypeScript Next/Mongo fullstack workspace with Clerk", async () => {
    const output = await generate({
      name: "saas",
      projectType: "fullstack",
      language: "typescript",
      frontend: { framework: "next", styling: "tailwind-shadcn" },
      backend: {
        framework: "express",
        database: "mongo",
        auth: "clerk",
        cache: "none",
      },
      deployment: ["vercel", "render", "docker"],
    }, "pnpm");
    expect(JSON.parse(await readFile(path.join(output, "package.json"), "utf8")).scripts.build)
      .toContain("pnpm run build");
    expect(await readFile(path.join(output, "backend/src/server.ts"), "utf8"))
      .toContain("clerkMiddleware");
    expect(await readFile(path.join(output, "backend/src/server.ts"), "utf8"))
      .toContain('app.get("/api/protected", requireAuth');
    expect(await readFile(path.join(output, "backend/prisma/schema.prisma"), "utf8"))
      .toContain('provider = "mongodb"');
    expect(JSON.parse(await readFile(path.join(output, "backend/package.json"), "utf8")).devDependencies.prisma)
      .toBe("6.12.0");
    await expect(access(path.join(output, "frontend/app/protected/page.tsx")))
      .resolves.toBeUndefined();
    const frontendPackage = JSON.parse(await readFile(path.join(output, "frontend/package.json"), "utf8"));
    expect(frontendPackage.dependencies["@clerk/nextjs"]).toBeDefined();
    expect(frontendPackage.dependencies["@clerk/clerk-react"]).toBeUndefined();
    expect(frontendPackage.devDependencies["@tailwindcss/vite"]).toBeUndefined();
    expect(await readFile(path.join(output, "frontend/.env.example"), "utf8"))
      .not.toContain("VITE_CLERK_PUBLISHABLE_KEY");
  });

  it("generates a JavaScript Vite fullstack workspace with Supabase and no database", async () => {
    const output = await generate({
      name: "portal",
      projectType: "fullstack",
      language: "javascript",
      frontend: { framework: "vite", styling: "tailwind-shadcn" },
      backend: {
        framework: "express",
        database: "none",
        auth: "supabase",
        cache: "none",
      },
      deployment: ["render"],
    });
    expect(await readFile(path.join(output, "backend/src/server.js"), "utf8"))
      .toContain('app.get("/api/protected", requireAuth');
    expect(JSON.parse(await readFile(path.join(output, "backend/package.json"), "utf8")).scripts.build)
      .toBe("node --check src/server.js");
    await expect(access(path.join(output, "frontend/src/lib/supabase.js")))
      .resolves.toBeUndefined();
    await expect(access(path.join(output, "frontend/src/ProtectedExample.jsx")))
      .resolves.toBeUndefined();
    expect(await readFile(path.join(output, "frontend/.env.example"), "utf8"))
      .not.toContain("NEXT_PUBLIC_SUPABASE_URL");
    await expect(access(path.join(output, "backend/prisma"))).rejects.toThrow();
  });
});
