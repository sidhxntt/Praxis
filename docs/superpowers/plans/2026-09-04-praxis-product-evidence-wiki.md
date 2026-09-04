# Praxis Product Evidence Wiki Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish dedicated Praxis Flow and Praxis Pro evidence paths that connect every résumé claim to implementation evidence and clearly identify unrecorded metrics.

**Architecture:** Add two source Markdown pages to the rendered Wiki. `Praxis-Pro.md` becomes the Pro mini-Wiki home. The renderer, sidebar, publication allowlist, README, and docs contract test register both pages.

**Tech Stack:** Markdown, Node.js ESM, Node test runner, GitHub Actions, GitHub Wiki renderer.

**Spec:** `docs/superpowers/specs/2026-09-04-praxis-product-evidence-wiki-design.md`

## Global Constraints

- Preserve the exact résumé claims from the spec.
- Mark source/test-backed behavior `implementation verified` and all outcome numbers `measurement record required` until a dated measurement artifact exists.
- Do not infer generated-project runtime outcomes from a selected template.
- Keep Praxis Flow and Praxis Pro as separate Wiki paths; update renderer, sidebar, workflow, and test together.

---

### Task 1: Register product evidence pages

**Files:**
- Create: `docs/praxis-engineering-evidence.md`, `docs/praxis-pro-engineering-evidence.md`
- Modify: `tests/docs/template-context.test.mjs`, `scripts/render-github-wiki.mjs`, `.github/workflows/wiki.yml`, `docs/_Sidebar.md`, `docs/wiki-publishing.md`

**Interfaces:**
- Produces: rendered `Praxis-Engineering-Evidence.md` and `Praxis-Pro-Engineering-Evidence.md` pages and matching Wiki publication entries.

- [ ] **Step 1: Write the failing test**

```js
test("product evidence pages are rendered and published", async () => {
  const renderer = await readFile(path.join(root, "scripts/render-github-wiki.mjs"), "utf8");
  const workflow = await readFile(path.join(root, ".github/workflows/wiki.yml"), "utf8");
  const sidebar = await readFile(path.join(root, "docs/_Sidebar.md"), "utf8");
  for (const page of ["Praxis-Engineering-Evidence.md", "Praxis-Pro-Engineering-Evidence.md"]) {
    assert.match(renderer, new RegExp(escapeRegExp(page)));
    assert.match(workflow, new RegExp(escapeRegExp(page)));
  }
  assert.match(sidebar, /Praxis-Engineering-Evidence/);
  assert.match(sidebar, /Praxis-Pro-Engineering-Evidence/);
});
```

- [ ] **Step 2: Verify red**

Run: `node --test tests/docs/template-context.test.mjs --test-name-pattern "product evidence pages"`

Expected: FAIL because the pages are unregistered.

- [ ] **Step 3: Implement registration**

Add these renderer tuples immediately after `praxis-pro.md`:

```js
["praxis-engineering-evidence.md", "Praxis-Engineering-Evidence.md"],
["praxis-pro-engineering-evidence.md", "Praxis-Pro-Engineering-Evidence.md"],
```

Add both filenames to the workflow `git add` list. Add a Praxis Flow evidence link and a dedicated `Praxis Pro Wiki` sidebar section with Pro home, evidence, capabilities, Django, Gin, Compose, Kubernetes, Terraform, and generated-backend links. Register the source/output pairs in `docs/wiki-publishing.md`.

- [ ] **Step 4: Verify green and commit**

Run: `node --test tests/docs/template-context.test.mjs --test-name-pattern "product evidence pages"`

Expected: PASS.

```bash
git add tests/docs/template-context.test.mjs scripts/render-github-wiki.mjs .github/workflows/wiki.yml docs/_Sidebar.md docs/wiki-publishing.md
git commit -m "docs: register product evidence Wiki pages"
```

### Task 2: Publish the Praxis Flow evidence ledger

**Files:**
- Modify: `README.md`, `docs/index.md`
- Create: `docs/praxis-engineering-evidence.md`

**Interfaces:**
- Consumes: standard config/resolver/composer/manifests and generator contract tests.
- Produces: a linked Praxis Flow evidence page.

- [ ] **Step 1: Write the evidence page**

Use the exact Praxis résumé claim. Map framework/language selection, deterministic configuration/resolution/composition, data/auth/cache/jobs/routes, Docker/Prometheus/Grafana, atomic generation, and generated-project independence to source paths and generator tests. List `20+ dev hours`, `70% prototyping`, `80% boilerplate`, `~1,500 QPS`, `<200ms latency`, and `99.95% reliability` as `measurement record required`, with the required before/after study, workload/configuration, raw benchmark result, or SLO window.

- [ ] **Step 2: Link and verify it**

Add evidence links in the README documentation section and the Praxis Flow path in `docs/index.md`.

Run: `npm run docs:links`

Expected: `Documentation links are valid.`

- [ ] **Step 3: Commit**

```bash
git add README.md docs/index.md docs/praxis-engineering-evidence.md
git commit -m "docs: add Praxis engineering evidence"
```

### Task 3: Publish the Praxis Pro mini-Wiki and evidence ledger

**Files:**
- Modify: `README.md`, `docs/index.md`, `docs/praxis-pro.md`
- Create: `docs/praxis-pro-engineering-evidence.md`

**Interfaces:**
- Consumes: Pro schema, capability closure, manifests, Django/Gin architecture, and Pro generator tests.
- Produces: a Pro-only Wiki navigation block and evidence page.

- [ ] **Step 1: Add the Pro home navigation**

At the top of `docs/praxis-pro.md`, add `## Praxis Pro Wiki` linking to Pro evidence, capabilities, Django/DRF, Go/Gin, Compose, Kubernetes, Terraform, and generated backends.

- [ ] **Step 2: Write the evidence page**

Use the exact Praxis Pro résumé claim. Map capability closure, Django/DRF and Go/Gin selection, ORM/JWT/API docs, Gunicorn/Nginx/Compose, Kubernetes resources and lifecycle, and ELK/Sentry/Prometheus to real manifests and Pro contract tests. Mark `50% setup`, `35% onboarding`, `80% manual infrastructure`, `40% scalability`, and `60% observability` `measurement record required` with the exact study, task record, load output, or incident-data artifact needed.

- [ ] **Step 3: Link, verify, and commit**

Add the Pro home/evidence links to the README and `docs/index.md`.

Run: `npm run docs:links`

Expected: `Documentation links are valid.`

```bash
git add README.md docs/index.md docs/praxis-pro.md docs/praxis-pro-engineering-evidence.md
git commit -m "docs: add Praxis Pro evidence Wiki"
```

### Task 4: Verify and publish

**Files:**
- Verify: all files above.

- [ ] **Step 1: Run complete documentation verification**

Run: `npm run docs:check`

Expected: links, docs tests, context validation, and Wiki rendering pass.

- [ ] **Step 2: Run the cited generator contracts**

Run: `npm --workspace cli test -- tests/generator/proCapabilities.test.ts tests/generator/proMatrix.test.ts tests/generator/proRuntime.test.ts tests/generator/matrix.test.ts`

Expected: PASS.

- [ ] **Step 3: Inspect rendered product pages**

```bash
evidence_wiki=$(mktemp -d /private/tmp/praxis-evidence-wiki.XXXXXX)
npm run docs:wiki -- "$evidence_wiki"
sed -n '1,120p' "$evidence_wiki/Praxis-Engineering-Evidence.md"
sed -n '1,120p' "$evidence_wiki/Praxis-Pro.md"
sed -n '1,120p' "$evidence_wiki/Praxis-Pro-Engineering-Evidence.md"
```

Expected: all pages render, and Pro home contains its focused navigation.

- [ ] **Step 4: Verify diff and push**

Run: `git diff main...HEAD --check && git status --short --branch`

Expected: no whitespace errors and only intended commits ahead of `main`.

```bash
git push -u origin docs/wiki-evidence
```
