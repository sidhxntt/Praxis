# Praxis agent instructions

## Template work

Before creating, changing, reviewing, or debugging template behavior:

1. Read [`docs/template-agent-guide.md`](docs/template-agent-guide.md).
2. Resolve the exact bounded context with `node scripts/resolve-template-context.mjs --config <path-to-praxis.config.json>` or repeated `--bundle <id>` arguments.
3. Read every returned architecture page and inspect every returned authoritative source and contract test.
4. State the loaded bundle before editing and run every returned verification command before claiming completion.

For GitHub-only work, begin at the [Template Agent Guide](https://github.com/sidhxntt/Praxis/wiki/Template-Agent-Guide). The local `docs/` source is authoritative when available.

Do not infer output behavior from directory names alone. Validate configuration, resolver order, manifest selectors, overlays, patches, and tests. Preserve atomic composition, generated-project independence, framework-native architecture, requested/resolved capability separation, and Compose/Kubernetes/Terraform lifecycle boundaries.

## Repository boundaries

- `cli/` owns the publishable generator, templates, and generator tests.
- `web/` owns the independently deployed website.
- `docs/` owns Wiki source.
- Root `scripts/` owns repository documentation tooling.

Preserve unrelated dirty worktree changes. Use `rg` for discovery and `apply_patch` for edits.
