# Documentation Bootstrap Unification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to execute this plan task-by-task.

**Goal:** Remove the deleted root agent bootstrap files from repository automation and unify the public documentation around the configuration-to-project model.

**Architecture:** `docs/template-agent-guide.md` remains the canonical guide for template work without depending on auto-discovered root instruction files. The Wiki workflow and documentation contracts watch and verify the guide and context tooling directly. The root README becomes a concise public entry point linking to the Summary, generation notes, and detailed docs.

**Tech Stack:** Markdown, Node.js documentation tests, GitHub Actions.

**Spec:** User request on 2026-09-25.

## Global Constraints

- Keep `scripts/resolve-template-context.mjs` and the template context map unchanged.
- Do not stage the unrelated `cli/gallery-app/next-env.d.ts` change or unrelated package-document deletion state.
- Verify with `npm run docs:check` before creating the pull request.

### Task 1: Remove root-bootstrap assumptions

**Files:**

- Modify: `.github/workflows/wiki.yml`
- Modify: `tests/docs/template-context.test.mjs`
- Modify: `docs/template-agent-guide.md`
- Modify: `docs/agent-guide.md`

- [ ] Replace `AGENTS.md` and `CLAUDE.md` workflow triggers with the canonical documentation pages.
- [ ] Replace the test that reads the deleted files with assertions that the Template Agent Guide documents the context command and complete loading sequence.
- [ ] Rewrite guide copy so repository users begin at the canonical guide, not missing root bootstrap files.
- [ ] Run `npm run docs:test` and confirm the documentation contract passes.

### Task 2: Make public documentation concise and connected

**Files:**

- Modify: `README.md`
- Modify: `SUMMARY.md`
- Modify: `note.md`

- [ ] Make the README a short public overview that links to the summary, beginner note, detailed documentation, Wiki, and release guidance.
- [ ] Keep terminology consistent: `praxis.config.json` is the intent record; the resolver selects ordered maintained modules; composition is staged and atomic.
- [ ] Run `npm run docs:check` and `git diff --check`.

### Task 3: Deliver through the protected-branch workflow

**Files:**

- Modify: the files listed above
- Delete: `AGENTS.md`, `CLAUDE.md`

- [ ] Stage only the scoped deletions and documentation/workflow/test changes.
- [ ] Commit the branch, push it, and create a pull request targeting `main`.
