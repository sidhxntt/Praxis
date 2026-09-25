# Template Catalog Grouping Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Group the Praxis template catalog by domain without changing module IDs, generated output, or npm runtime assets.

**Architecture:** The composer will discover `manifest.json` files once, index them by manifest ID, and retain each module directory with its manifest. This removes the flat directory-name assumption while preserving resolver IDs. Standard, Pro, and UI directories will then move to grouped roots, and every consumer will use the new paths.

**Tech Stack:** TypeScript, Node.js filesystem APIs, Vitest, npm packaging.

**Spec:** `docs/superpowers/specs/2026-09-25-template-catalog-grouping-design.md`

## Global Constraints

- Keep all `PraxisConfig` values and resolver IDs unchanged.
- Preserve atomic composition, selector behavior, ordering, and generated-project independence.
- Keep discovered paths confined below `templatesRoot`.
- Publish npm only after the PR merges into `main` and all required checks pass.

### Task 1: Discover modules by manifest ID

**Files:**

- Modify: `cli/src/composer/compose.ts`
- Modify: `cli/tests/composer/compose.test.ts`

**Interfaces:** `composeProject()` retains its public signature. Internally it loads `{ manifest, moduleRoot }` entries from an ID-indexed catalog.

- [ ] Add a failing composer test that creates `templates/standard/frontend/next/manifest.json` with ID `frontend.next`, composes it, and expects its overlay to be written.
- [ ] Add a failing composer test with two nested manifests claiming `frontend.next`, expecting a duplicate-ID error.
- [ ] Run `npm --workspace cli test -- tests/composer/compose.test.ts`; it must fail because the existing loader only reads `templatesRoot/<id>/manifest.json`.
- [ ] Implement a directory walk that stops at each manifest directory, validates manifest IDs, detects duplicates, and returns the requested `{ manifest, moduleRoot }` entries.
- [ ] Use `moduleRoot` for overlay paths, preserve `confinedPath()`, and retain the existing error for an unknown requested module.
- [ ] Re-run `npm --workspace cli test -- tests/composer/compose.test.ts`; all fixture and new nested-module tests must pass.
- [ ] Commit: `refactor: discover template modules by manifest id`.

### Task 2: Move modules into grouped directories

**Files:**

- Move: current Standard module folders below `cli/templates/standard/`.
- Move: current `pro.*` folders below `cli/templates/pro/`.
- Move: current UI folders below `cli/templates/ui/`.

**Interfaces:** Manifest IDs remain exactly the same; only their physical roots change.

- [ ] Move `base.workspace` to `standard/base/workspace`; all `frontend.*` to `standard/frontend/<name>`; `backend.express` to `standard/backend/express`; database/auth/cache/deployment modules to their matching `standard/<family>/<name>` folders; and styling to `standard/styling/tailwind-shadcn`.
- [ ] Move `pro.core` to `pro/core`; Django/Gin to `pro/runtime/<name>`; all capabilities to `pro/capabilities/<name>`; Compose/Kubernetes to `pro/infrastructure/<name>`; and Terraform modules to `pro/infrastructure/terraform/<name>`.
- [ ] Move `designs` to `ui/designs`, `ui.catalog` to `ui/catalog`, `ui.shared` to `ui/shared`, and every `ui.<style>` module to `ui/styles/<style>`.
- [ ] Run `find cli/templates -name manifest.json -print0 | xargs -0 -n1 jq -r .id | sort | uniq -d`; expect no duplicate IDs.
- [ ] Commit: `refactor: group template catalog by domain`.

### Task 3: Update all path consumers

**Files:**

- Modify: `scripts/template-context-lib.mjs`
- Modify: `cli/scripts/ui/*.mjs`, `cli/scripts/ui/lib/load-style.mjs`, `cli/src/ui/gallery.ts`
- Modify: `cli/package.json`
- Modify: `cli/tests/package.test.ts`, `cli/tests/generator/proInfrastructure.test.ts`, `cli/tests/ui/*.test.ts`, `tests/docs/template-context.test.mjs`
- Modify: architecture documentation links in `docs/*.md`

**Interfaces:** Selection still produces IDs such as `ui.apple` and `pro.terraform.aws`; context sources and UI tooling use grouped physical paths.

- [ ] Change representative package tests to expect `templates/ui/styles/<id>/manifest.json`, `templates/ui/catalog/catalog.json`, and no files beneath `templates/ui/designs/`.
- [ ] Update the template-context test to expect grouped Standard and Pro source paths.
- [ ] Run `npm --workspace cli test -- tests/package.test.ts tests/generator/proInfrastructure.test.ts tests/ui` and `npm run docs:test`; expect failures from old paths.
- [ ] Change UI discovery, style loading, preview/gallery locations, source-design reads, context-source generation, test paths, package `files` exclusions, and Markdown links to grouped paths.
- [ ] Re-run `npm --workspace cli test -- tests/package.test.ts tests/generator/proInfrastructure.test.ts tests/ui` and `npm run docs:check`; expect success.
- [ ] Commit: `chore: update grouped template catalog consumers`.

### Task 4: Verify output and package behavior

**Files:** No source edits unless a verification failure proves a missing migration.

- [ ] Run `npm run docs:context:check`.
- [ ] Run `npm --workspace cli test -- tests/generator/lifecycle.test.ts tests/generator/proRuntime.test.ts tests/generator/proCapabilities.test.ts tests/generator/proMatrix.test.ts`.
- [ ] Run `npm --workspace cli test`.
- [ ] Run `npm --workspace cli pack --dry-run` and inspect that grouped runtime templates are present while source-only UI designs are absent.
- [ ] Commit any verification-driven correction separately with a focused message.

### Task 5: Deliver through GitHub and npm

**Files:** Modify `cli/package.json` and `cli/package-lock.json` only for the final release version.

- [ ] Push `refactor/template-catalog-groups` and open a PR into `main` with the grouped-layout and stable-ID compatibility summary.
- [ ] Wait for every required PR check with `gh pr checks <number> --watch`; fix only verified failures.
- [ ] Merge only when checks pass: `gh pr merge <number> --merge --delete-branch`.
- [ ] Switch the primary checkout to `main` and run `git pull --ff-only origin main`.
- [ ] Bump the CLI version on merged `main`, pack and inspect it, publish with `npm --workspace cli publish --access public`, then verify `npm view praxiflow version`.
