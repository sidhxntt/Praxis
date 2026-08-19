# Testing and verification

Praxis tests the generator at several boundaries because a passing TypeScript build does not prove that generated applications are valid.

## Test layers

| Layer | Primary evidence | Protects |
| --- | --- | --- |
| CLI/parser | `cli/tests/cli/` | argument grammar, help, routing |
| Config/workflow | `cli/tests/config/`, `cli/tests/workflow/` | validation, migrations, question order, Pro closure |
| Composer | `cli/tests/composer/` | overlays, scopes, conflicts, tokens, atomic cleanup |
| Standard generation | `matrix`, `frameworks`, `generate`, `lifecycle` tests | supported standard combinations and runtime lifecycle |
| Pro generation | `pro*.test.ts` | stacks, capabilities, Compose, Kubernetes, Terraform, runtime contracts |
| UI artifacts | `cli/tests/ui/` | catalog, nine adapters, previews, accessibility, responsiveness, visual structure |
| Complete UI matrix | `uiMatrix.test.ts`, `ui:matrix` | all 40 styles plus starter across every target |
| Packaging | `package.test.ts` | npm tarball contains runtime templates and excludes authoring sources |
| Website | `npm run build:web` | production Next.js build |
| Documentation | `npm run docs:check` | resolvable links and renderable Wiki pages |

## Local release gate

From the repository root:

```bash
npm ci
npm run docs:check
npm run test:cli
npm run build:cli
npm run build:web
npm --workspace cli run ui:verify
npm audit --workspace cli --omit=dev --audit-level=critical
```

When a retained Git worktree exists beneath `.worktrees/`, run Vitest from the `cli` workspace or explicitly exclude the worktree. Running an unscoped root search can discover duplicate test modules.

## UI framework build matrix

CI builds 41 projects per target: one starter and all 40 styles. Targets are `next-js`, `next-ts`, `vite-js`, `vite-ts`, `vue-js`, `vue-ts`, `astro-js`, `astro-ts`, and `angular-ts`.

To reproduce one shard:

```bash
npm --workspace cli run ui:matrix -- --target astro-ts --install --build
```

The matrix validates generated source with the generated project's actual framework toolchain; it is stronger evidence than string assertions alone.

## Pro evidence

The Pro suite checks:

- minimal, recommended, and maximal capability sets for both stacks;
- capability implication and absence contracts;
- Compose service wiring and health dependencies;
- Kubernetes topology and capability-conditioned resources;
- Terraform formatting/validation and cloud-specific resources;
- generated Django and Go lifecycle/toolchain checks where available;
- unresolved marker/token absence.

Run the focused suite with:

```bash
npm --workspace cli run test:pro
```

## Documentation evidence

`docs:check` scans repository Markdown links and renders every managed page into a temporary Wiki directory. A successful render proves page mapping and link rewriting execute; it does not prove the prose matches code. Reviewers must compare architecture claims with the authoritative source maps on each page.

## Change-to-test map

| Change | Minimum focused checks before full gate |
| --- | --- |
| Parser/help | CLI command/help tests |
| Schema/resolver | config tests plus standard and/or Pro matrix |
| Composer | composer tests and affected generated-project tests |
| One standard module | affected matrix configuration and lifecycle test |
| Pro capability | capability, Compose, Kubernetes/Terraform tests as applicable; both stacks |
| UI renderer/profile | `ui:generate`, `ui:previews`, `ui:verify`, affected target build, UI quality tests |
| Package contents | package test and `npm pack --dry-run` |
| Wiki/docs | `docs:check` and representative rendered-page inspection |

