# Praxis Repository Workspace Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Place the website in `web/` and all Praxis Flow/Pro CLI implementation in `cli/`, with a private npm-workspace root that builds and tests both products.

**Architecture:** The repository root owns shared metadata, orchestration, CI, and one npm lockfile. `cli` remains the publishable `praxiflow` package; `web` remains an independently runnable Next.js application. Workspace commands preserve package-local paths while CI and deployment explicitly target the correct product.

**Tech Stack:** npm workspaces, TypeScript, Vitest, Playwright, Next.js 16, GitHub Actions, Vercel

---

### Task 1: Establish the workspace boundary

**Files:**
- Create: `package.json`
- Create: `cli/package.json`
- Move: `wrapper/package.json` to `web/package.json`
- Regenerate: `package-lock.json`

- [ ] Move the current CLI package metadata to `cli/package.json` without changing its name, version, binary, dependencies, or package-local scripts.
- [ ] Rename the web package from `wrapper` to `praxis-web` and keep it private.
- [ ] Replace the root package with a private workspace manifest declaring `cli` and `web`.
- [ ] Add root scripts `dev:web`, `build:web`, `build:cli`, `test:cli`, `check:cli`, `check:web`, and `check` using `npm --workspace`.
- [ ] Run `npm install --package-lock-only` and confirm the lockfile includes both workspace packages.

### Task 2: Move product-owned files

**Files:**
- Move to `cli/`: `src/`, `templates/`, `tests/`, `scripts/`, `tsconfig.json`
- Move to `cli/docs/`: CLI feature specifications and plans
- Move to `web/`: all tracked contents of `wrapper/`
- Modify: `.gitignore`

- [ ] Use Git-aware moves so history follows the website and CLI files.
- [ ] Keep the repository-workspace specification and plan under root `docs/superpowers/`; move the other CLI-owned design and implementation documents to `cli/docs/superpowers/`.
- [ ] Remove package-local lockfiles so the root lockfile is authoritative.
- [ ] Update ignore rules for `/node_modules`, `/cli/dist`, `/web/.next`, workspace temporary output, and local environment files.
- [ ] Verify `wrapper/`, root `src/`, root `templates/`, root `tests/`, and root `scripts/` no longer exist.

### Task 3: Repair package-relative references

**Files:**
- Modify: `cli/package.json`
- Modify: `cli/tsconfig.json`
- Modify: `cli/src/**` only if repository-root assumptions are found
- Modify: `cli/tests/**` only if repository-root assumptions are found
- Modify: `README.md`

- [ ] Search tracked files for `wrapper/`, root-relative CLI implementation paths, and direct root npm commands.
- [ ] Preserve the CLI binary as `cli/dist/index.js` relative to the CLI package.
- [ ] Update README development commands to use root workspace scripts and describe `web/` and `cli/` ownership.
- [ ] Run `npm run build:cli`; resolve only path failures introduced by the move.
- [ ] Run `npm run test:cli`; resolve only path failures introduced by the move.

### Task 4: Update CI and deployment

**Files:**
- Modify: `.github/workflows/ci.yml`
- Modify: `.github/workflows/ui-matrix.yml`
- Create: `vercel.json`

- [ ] Change workflow branch filters from `cli` to `main` for pushes and pull requests.
- [ ] Install once from the repository root with the workspace lockfile.
- [ ] Route CLI build, tests, UI generation, Playwright, and audit through `npm --workspace cli` or root CLI scripts.
- [ ] Add a web production-build job using the web workspace.
- [ ] Configure Vercel to build the `web` workspace from repository root with the Next.js framework and `web/.next` output.
- [ ] Validate workflow YAML structurally and confirm no command points at the former root CLI package or `wrapper/`.

### Task 5: Verify and commit the migration

**Files:**
- Modify: generated `package-lock.json`
- Verify: all changed files

- [ ] Run `npm ci` from the repository root; expect both workspaces to install successfully.
- [ ] Run `npm run check:cli`; expect the full CLI suite and TypeScript build to pass.
- [ ] Run `npm run build:web`; expect a successful Next.js production build.
- [ ] Run `npm audit --workspaces --omit=dev`; expect no production vulnerabilities.
- [ ] Run `git diff --check` and inspect `git status --short` for unintended files.
- [ ] Commit the migration with `refactor: organize repository into workspaces`.

### Task 6: Update and merge the pull request

**Files:**
- Remote branch: `cli`
- Pull request: `#4`

- [ ] Push the migration commit to `origin/cli`.
- [ ] Update PR #4 description to explain the `web/` and `cli/` workspace layout and verification.
- [ ] Wait for every required GitHub Actions and Vercel check to finish successfully; inspect and fix any failure before continuing.
- [ ] Merge PR #4 into `main` using a merge commit.
- [ ] Fetch `origin/main` and prove the feature head is an ancestor of the merged branch.
- [ ] Confirm PR #4 reports `MERGED` and record its merge commit URL.
