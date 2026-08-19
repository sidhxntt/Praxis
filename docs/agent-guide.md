# Agent guide

This page is a deterministic orientation path for Claude, Codex, and other coding agents. Treat repository state and tests as authoritative; documentation narrows where to inspect but does not replace inspection.

## First five minutes

1. Read [`README.md`](../README.md) for supported product surface.
2. Read [Terminology](terminology.md), [Architecture](architecture.md), and [Code architecture](code-architecture.md).
3. Inspect `git status` before editing; this repository may be shared by concurrent sessions.
4. Identify whether the task belongs to `cli/`, `web/`, `docs/`, or root orchestration.
5. For generation behavior, trace configuration → resolver → selected manifests → composer → tests.

## Task routing

| Task | Start here | Then inspect |
| --- | --- | --- |
| Add/change CLI option | `cli/src/cli/command.ts`, `runCreate.ts` | schema, answers, help tests |
| Add standard framework/provider | `cli/src/config/schema.ts` | resolver, matching template manifests, matrix tests |
| Add Pro capability | `cli/src/config/pro.ts` | resolver, capability module, Compose/K8s/Terraform manifests, Pro tests |
| Fix generated file | output `praxis.config.json` | resolved modules, overlay source, all patches targeting file |
| Change UI style | `cli/scripts/ui/` | generated `ui.<style>`, previews, UI quality/matrix tests |
| Change local gallery | `cli/src/ui/` | `templates/ui.catalog`, gallery browser tests |
| Change website | `web/` | `web/package.json`, Vercel config, web build |
| Change Wiki | `docs/` | renderer, link checker, Wiki workflow |

## Generation trace algorithm

When asked “where did this generated code come from?”:

1. Validate/read the output's `praxis.config.json`.
2. Apply [`resolveModules`](../cli/src/config/resolver.ts) mentally or in a focused test.
3. Preserve module order.
4. For each module, filter manifest entries using AND selector semantics.
5. Map `root`/`frontend`/`backend` scope for the project type.
6. Find the first overlay that creates the file.
7. Find later overlays with `replace: true` and patches targeting it.
8. Include merged package/env contributions.
9. Confirm the conclusion with an existing or new generation test.

## Invariants not to break

- Validate before resolution and composition.
- Do not overwrite existing destination directories.
- Keep composition atomic and confined to staging/output roots.
- Keep module order deterministic.
- Reject dependency/script conflicts rather than silently winning.
- Make replacement explicit.
- Preserve reusable patch anchors when later modules depend on them.
- Record effective configuration in every output.
- Keep requested and resolved Pro capabilities distinct.
- Do not add Angular JavaScript output.
- Do not hand-edit generated UI matrices as the primary change.
- Do not include UI authoring design sources in the published npm package.
- Do not describe the legacy `pro` branch as architecture; Pro lives in `cli`.

## Common reasoning mistakes

### “Every template generates a backend”

False. `frontend` has no backend. `backend` and `fullstack` use Express. `pro-backend` uses Django or Gin. UI templates only replace frontend landing-page files.

### “A module directory means it is active”

False. Only resolver-selected modules and matching manifest entries contribute.

### “A capability is one file”

Usually false. A capability can span application code, env keys, package dependencies, Compose patches, Kubernetes resources, Terraform, tests, and docs.

### “Generated code uses a Praxis runtime”

False. Praxis writes standalone framework code; the CLI is not a runtime dependency.

### “Fix the generated artifact directly”

Often wrong. For UI artifacts, fix the canonical renderer/profile. For manifest outputs, fix the owning overlay or patch. Add a regression test at the source boundary.

## Safe change checklist

1. State the intended supported configuration(s).
2. Add/adjust a failing focused test.
3. Make the smallest source-of-truth change.
4. Generate a representative project and inspect the real files.
5. Run the focused test and applicable toolchain build.
6. Run the full relevant matrix/gate from [Testing](testing.md).
7. Update docs if configuration, module ownership, generated topology, or extension rules changed.
8. Stage only files belonging to the task.

## Machine-readable anchors

Agents should prefer these stable data sources over prose lists:

- supported standard values: exported constants/types in `cli/src/config/schema.ts`;
- Pro capability order/implications: `cli/src/config/pro.ts`;
- UI style IDs/metadata: `cli/src/ui/catalog.ts` and `cli/templates/ui.catalog/catalog.json`;
- module declarations: `cli/templates/*/manifest.json`;
- published package allowlist: `cli/package.json#files`;
- CI truth: `.github/workflows/ci.yml` and `ui-matrix.yml`.

