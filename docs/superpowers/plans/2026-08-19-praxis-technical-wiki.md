# Praxis Technical Wiki Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and automatically publish a human- and agent-friendly technical Wiki for the current Praxis architecture.

**Architecture:** Repository Markdown is the source of truth. A deterministic Node renderer maps it to GitHub Wiki pages, while a link checker and CI workflow prevent drift and publish only managed pages.

**Tech Stack:** Markdown, Mermaid, Node.js ESM, GitHub Actions, GitHub Wiki Git repository.

---

### Task 1: Establish Wiki navigation and product orientation

**Files:**
- Create: `docs/index.md`
- Create: `docs/overview.md`
- Create: `docs/architecture.md`
- Create: `docs/terminology.md`
- Create: `docs/_Sidebar.md`
- Create: `docs/_Footer.md`

- [ ] Write audience routes, product boundaries, vocabulary, and system diagrams.
- [ ] Link every claim to the deeper implementation pages.

### Task 2: Document the generator implementation

**Files:**
- Create: `docs/code-architecture.md`
- Create: `docs/generation-pipeline.md`
- Create: `docs/manifest-system.md`
- Create: `docs/repository-map.md`

- [ ] Trace CLI parsing through validation, module resolution, atomic composition, post-generation tasks, and output.
- [ ] Document every manifest primitive, selector, output scope, token, ordering rule, and failure invariant.
- [ ] Add source maps and change-impact tables.

### Task 3: Document generated project families

**Files:**
- Create: `docs/standard-projects.md`
- Create: `docs/praxis-pro.md`
- Create: `docs/generated-backends.md`
- Create: `docs/ui-templates.md`

- [ ] Explain which project types create backends and how standard Express modules compose.
- [ ] Explain Pro capability closure, Django/Gin overlays, Compose, Kubernetes, and Terraform.
- [ ] Trace representative generated requests and service dependencies.
- [ ] Explain canonical UI generation, nine framework/language targets, previews, and `DESIGN.md` provenance.

### Task 4: Add contributor and agent operations

**Files:**
- Create: `docs/testing.md`
- Create: `docs/agent-guide.md`
- Create: `docs/wiki-publishing.md`
- Modify: `README.md`

- [ ] Add verification matrices, authoritative commands, generated-file rules, and a task-oriented agent reading order.
- [ ] Link the repository README to the documentation index and Wiki.

### Task 5: Implement deterministic Wiki tooling

**Files:**
- Create: `scripts/render-github-wiki.mjs`
- Create: `scripts/check-doc-links.mjs`
- Modify: `package.json`
- Create: `.github/workflows/wiki.yml`

- [ ] Render each managed source to a stable Wiki filename and rewrite relative links.
- [ ] Fail on broken repository documentation links.
- [ ] Add `docs:check` and `docs:wiki` scripts.
- [ ] Publish rendered pages on `main` without deleting unmanaged Wiki content.

### Task 6: Verify and publish

- [ ] Run `npm run docs:check`.
- [ ] Render into a temporary directory and inspect `Home.md`, `_Sidebar.md`, `Code-Architecture.md`, and `Generated-Backends.md`.
- [ ] Run `npm run check`.
- [ ] Commit only documentation/tooling files, push `cli`, and update the active PR into `main`.
