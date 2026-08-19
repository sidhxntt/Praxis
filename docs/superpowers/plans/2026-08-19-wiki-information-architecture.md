# Praxis Wiki Information Architecture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a two-domain Praxis Wiki with detailed generated-template architecture and deterministic, validated context loading for Codex and Claude Code.

**Architecture:** Markdown under `docs/` remains the canonical source and the existing renderer publishes an explicit page registry to GitHub Wiki. A versioned JSON context map routes a selected Praxis configuration to bounded documentation/source/test bundles; one dependency-free Node command resolves those bundles, while another validates coverage against the actual template directories and Pro capability definitions. Short root instruction files route Codex and Claude Code into the same canonical guide instead of duplicating architecture prose.

**Tech Stack:** Markdown, Mermaid, JSON, Node.js ESM, `node:test`, npm scripts, GitHub Actions/Wiki renderer.

---

### Task 1: Context-map contracts and resolver

**Files:**
- Create: `tests/docs/template-context.test.mjs`
- Create: `docs/template-context.json`
- Create: `scripts/template-context-lib.mjs`
- Create: `scripts/resolve-template-context.mjs`
- Create: `scripts/check-template-context.mjs`
- Modify: `package.json`

- [ ] **Step 1: Write failing Node tests**

Test that the context map has a version, contains Standard, Django, Gin, Compose, Kubernetes, shared Terraform, and AWS/Azure/GCP bundles, resolves a representative Standard config, resolves a representative Pro config with dependency closure, emits equivalent JSON/text bundle membership, rejects unknown selections, and reports missing capability/module coverage.

- [ ] **Step 2: Run the tests and verify RED**

Run: `node --test tests/docs/template-context.test.mjs`

Expected: failure because `scripts/template-context-lib.mjs` and `docs/template-context.json` do not exist.

- [ ] **Step 3: Implement the map and dependency-free resolver**

Define each bundle with `pages`, `sources`, `tests`, `verify`, and `requires`. Export map loading, validation, configuration-to-bundle resolution, dependency ordering, and text/JSON formatting from `template-context-lib.mjs`. The CLI accepts `--config <praxis.config.json>`, repeated `--bundle`, and `--json`, and exits nonzero for invalid or incomplete input.

- [ ] **Step 4: Implement repository coverage validation**

Validate that all selectable template families, every `pro.capability.*` directory, `pro.django`, `pro.gin`, `pro.compose`, `pro.kubernetes`, shared Terraform, and all three cloud Terraform directories are covered; validate paths, bundle dependencies, and cycles. Keep UI style modules represented by the single `standard-ui` family bundle rather than duplicating forty identical entries.

- [ ] **Step 5: Wire npm scripts and verify GREEN**

Add `docs:context`, `docs:context:check`, and `docs:test`; include context validation in `docs:check`. Run the focused Node tests and both resolver output modes.

### Task 2: Two-domain Home and navigation

**Files:**
- Modify: `docs/index.md`
- Modify: `docs/_Sidebar.md`
- Modify: `docs/overview.md`
- Create: `docs/core-internals.md`
- Create: `docs/template-architecture.md`
- Modify: `scripts/render-github-wiki.mjs`
- Modify: `tests/docs/template-context.test.mjs`

- [ ] **Step 1: Add failing renderer/navigation assertions**

Assert the renderer registry includes both domain overview pages and every page introduced by this plan, and that Home/sidebar contain both exact domain names and the Template Agent Guide.

- [ ] **Step 2: Verify RED**

Run: `node --test tests/docs/template-context.test.mjs` and confirm missing pages/navigation cause the expected failures.

- [ ] **Step 3: Rewrite Home as the architectural gateway**

Include the product thesis, end-to-end Mermaid mental model, generator/runtime boundary, Standard/Pro comparison, the two-domain paths, evaluator/user/contributor/agent entry points, and accuracy contract without duplicating detailed pages.

- [ ] **Step 4: Build both domain overview pages and reorganize the sidebar**

Group existing and new material beneath `Praxis Core Internals` and `Praxis Template Architecture`. Update the overview to direct implementation questions to Core and generated-runtime questions to Templates.

- [ ] **Step 5: Register pages in the Wiki renderer and verify GREEN**

Update the explicit renderer registry, run focused tests, and render to a temporary directory.

### Task 3: Detailed generated-template architecture

**Files:**
- Create: `docs/standard-frontend-architecture.md`
- Create: `docs/express-architecture.md`
- Create: `docs/fullstack-architecture.md`
- Create: `docs/django-architecture.md`
- Create: `docs/gin-architecture.md`
- Create: `docs/capability-architecture.md`
- Create: `docs/compose-architecture.md`
- Create: `docs/kubernetes-architecture.md`
- Create: `docs/terraform-architecture.md`
- Create: `docs/extending-generated-projects.md`
- Refactor: `docs/standard-projects.md`
- Refactor: `docs/praxis-pro.md`
- Refactor: `docs/generated-backends.md`
- Modify: `scripts/render-github-wiki.mjs`
- Modify: `docs/template-context.json`

- [ ] **Step 1: Add failing page-contract tests**

For Express, Django, and Gin assert headings for directory map, entry points, request lifecycle, dependency wiring, lifecycle, capability integration, infrastructure, extension points, and authoritative sources/tests. Assert every page referenced by a context bundle is registered by the renderer.

- [ ] **Step 2: Verify RED**

Run the focused tests and confirm failure because the detailed pages are absent.

- [ ] **Step 3: Write Standard architecture pages**

Document frontend ownership, Express functional composition, backend/fullstack scope mapping, database/auth/cache integration anchors, request flow, readiness and shutdown ordering, and Docker relationships using actual manifests and tests as sources.

- [ ] **Step 4: Write Pro stack architecture pages**

Document Django/DRF object-oriented framework boundaries and Go/Gin structs/interfaces/constructor wiring, including directory maps, request paths, workers, capability patching, lifecycle, extension rules, and authoritative contracts.

- [ ] **Step 5: Write capability and infrastructure pages**

Document requested/resolved capability closure, Compose service dependencies, Kubernetes workloads/configuration/secrets, and shared plus AWS/Azure/GCP Terraform ownership and lifecycle boundaries.

- [ ] **Step 6: Consolidate old overview pages and verify GREEN**

Turn overlapping pages into concise overviews routing to the new canonical details. Register every page and update map paths. Run page-contract and context validation tests.

### Task 4: Codex and Claude Code bootstrap

**Files:**
- Create: `AGENTS.md`
- Create: `CLAUDE.md`
- Create: `docs/template-agent-guide.md`
- Modify: `docs/agent-guide.md`
- Modify: `docs/_Sidebar.md`
- Modify: `docs/index.md`
- Modify: `scripts/render-github-wiki.mjs`
- Modify: `tests/docs/template-context.test.mjs`

- [ ] **Step 1: Add failing bootstrap tests**

Assert both root instruction files reference the same Template Agent Guide and context command, contain no duplicated stack architecture, and that the guide specifies the seven-step loading/verification sequence from the approved design.

- [ ] **Step 2: Verify RED**

Run focused tests and confirm the root files/guide are missing.

- [ ] **Step 3: Add concise agent bootstrap files**

`AGENTS.md` defines Codex routing and invariants. `CLAUDE.md` imports/references the shared instructions using Claude Code's project-memory convention and contains only Claude-specific startup guidance. Both route GitHub-only sessions to the public Wiki entry and repository sessions to local docs.

- [ ] **Step 4: Write the Template Agent Guide**

Document bundle resolution from a config or explicit selection, mandatory reading order, source verification, loaded-context declaration, required checks, failure behavior, and examples for Express and Terraform-enabled Django.

- [ ] **Step 5: Verify GREEN**

Run focused tests, context validation, documentation link validation, and Wiki rendering.

### Task 5: Full verification and isolated commit

**Files:**
- Modify only files listed in Tasks 1–4 and this plan.

- [ ] **Step 1: Run documentation verification**

Run: `npm run docs:check`

Expected: link validation, context-map validation/tests, and Wiki render all pass.

- [ ] **Step 2: Run repository verification**

Run: `npm run check`

Expected: CLI tests/build and web production build pass. If unrelated dirty web/CLI work causes failures, identify that evidence separately and do not alter those files.

- [ ] **Step 3: Audit the specification requirement by requirement**

Confirm Home, both domains, all stack pages, all infrastructure pages, both agent bootstrap files, the guide, context map, resolver modes, coverage enforcement, rendered registry, links, and current-behavior source citations.

- [ ] **Step 4: Review the scoped diff**

Run `git diff --check`, inspect only planned paths, and confirm no unrelated worktree changes are staged.

- [ ] **Step 5: Commit the implementation**

Stage only planned documentation, scripts, tests, root instruction files, and package metadata. Commit with `docs: build agent-readable architecture wiki`.
