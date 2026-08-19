# Template Agent Guide

This is the canonical entry point for Codex, Claude Code, and other agents working on Praxis templates or generated repositories. A Wiki cannot force an agent to read every page, so Praxis provides a deterministic context-loading contract.

## Mandatory bootstrap sequence

1. **Read the agent instructions.** In a repository session, load `AGENTS.md`; Claude Code also loads `CLAUDE.md` and its shared import.
2. **Read the Template Agent Guide.** Finish this page before inspecting individual template directories.
3. **Resolve the context bundle.** Run the resolver against `praxis.config.json` or explicit bundle IDs.
4. **Read every required architecture page.** Follow the returned order; prerequisites appear before dependants.
5. **Inspect authoritative sources.** Read the returned configuration, manifests, overlays, runtime entry points, and contract tests.
6. **State the loaded context.** Before editing, name the bundle IDs and the behavior boundary being changed.
7. **Run every required verification command.** Fresh command output is required before completion claims.

## Resolve from a generated project

From the Praxis repository:

```bash
node scripts/resolve-template-context.mjs --config /path/to/generated/praxis.config.json
```

For machine consumption:

```bash
node scripts/resolve-template-context.mjs --config /path/to/generated/praxis.config.json --json
```

The JSON/text modes return identical ordered bundle membership plus local pages, public Wiki URLs, sources, tests, and verification commands. Unknown bundles and incomplete Terraform selections fail instead of returning partial context.

## Resolve an explicit concern

```bash
node scripts/resolve-template-context.mjs \
  --bundle pro-django \
  --bundle capability-background-jobs \
  --bundle pro-compose
```

Dependency expansion adds Redis context before background jobs. Use `node scripts/resolve-template-context.mjs --bundle pro-terraform-aws` for the shared Kubernetes/Terraform prerequisites plus AWS.

## Understand before editing

For each returned module:

1. read its `manifest.json` selectors and output scopes;
2. read the selected overlay directories, not every variant;
3. follow persistent patch anchors into the base stack;
4. trace request, startup, readiness, and shutdown paths;
5. check how Compose/Kubernetes/Terraform consume the same capability selection;
6. read the listed tests to learn the executable contract.

Do not call all stacks object-oriented. Express uses functional module composition; Django/DRF uses framework-driven OOP patterns; Go/Gin uses structs, interfaces, constructors, and explicit compile-time wiring.

## Context declaration

Before a template change, record a short declaration such as:

> Loaded `template-foundations`, `pro-django`, `capability-redis-cache`, `capability-background-jobs`, and `pro-compose`; inspected their manifests/overlays and the Pro capability/runtime tests. Scope: Django worker startup and Compose dependency wiring.

This makes missing prerequisites visible during review.

## Validate the context system

```bash
npm run docs:context:check
npm run docs:test
npm run docs:check
```

The context validator ensures selectable template families, Pro capabilities, Terraform clouds, dependencies, pages, source roots, and tests remain represented. The map is routing metadata; source and executable tests remain authoritative.

## GitHub-only sessions

Start at this Wiki page, use links returned by the context map, and inspect matching paths on `main`. When a repository checkout is available, prefer local `docs/` so documentation and source share one commit.
