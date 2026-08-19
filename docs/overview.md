# What Praxis is

Praxis Flow is an interactive and configuration-driven CLI for producing complete application repositories. It replaces a collection of branch-specific starters with one validated configuration model and one composable template engine.

Praxis has two generation families:

- **Standard Praxis Flow** generates frontend, backend, or fullstack JavaScript/TypeScript projects. Frontends may use Next.js, Vite React, Vue, Astro, or Angular; standard backends use Express.
- **Praxis Pro** is a project type inside the same CLI. It generates a production-oriented backend using Python with Django/DRF or Go with Gin, plus selected operational capabilities.

The repository also contains `web/`, the public Praxis website. The website explains the product; it does not run generation and is not shipped in the `@sidhxntt/praxiflow` GitHub package.

## The central idea

Praxis separates **intent** from **implementation**:

```mermaid
flowchart LR
    U[User answers or JSON] --> C[Validated PraxisConfig]
    C --> R[Module resolver]
    R --> M[Ordered manifest modules]
    M --> E[Composition engine]
    E --> O[Generated repository]
```

The configuration says what the user wants. The resolver converts that intent into module identifiers. Each module manifest declares conditional file overlays, package contributions, environment keys, and text patches. The composer applies those declarations in order inside a temporary directory and publishes the destination only after composition succeeds.

## What Praxis generates

| Project type | Frontend | Backend | Typical root layout |
| --- | --- | --- | --- |
| `frontend` | Selected framework | None | frontend files at root |
| `backend` | None | Express | backend files at root |
| `fullstack` | Selected framework | Express | `frontend/` and `backend/` |
| `pro-backend` | None | Django/DRF or Gin | production backend at root |

This distinction matters: not every template choice produces a backend. “Template” can also mean a UI style module, deployment module, database module, or capability overlay. See [Terminology](terminology.md).

Use [Praxis Core Internals](core-internals.md) for how the generator is implemented. Use [Praxis Template Architecture](template-architecture.md) for how generated code and infrastructure work together.

## Determinism and provenance

For a fixed Praxis version and a validated configuration, module resolution and composition are deterministic. Every output receives `praxis.config.json`, which records the effective selection. UI template outputs also receive the selected `DESIGN.md`. Pro outputs record both requested and implied capabilities.

Determinism does not mean dependency registries or external installers are immutable. Praxis pins or constrains generated dependencies, but `installDependencies` and package-manager behavior still involve external systems after the source tree has been composed.

## Product boundaries

Praxis is:

- a source generator;
- a catalog of maintained implementation modules;
- an offline UI preview gallery;
- a validator for supported combinations;
- an opinionated production-backend starting point.

Praxis is not:

- a hosted application builder or control plane;
- a runtime framework required by generated projects;
- a dashboard/form generator—the 40 UI styles are landing pages;
- a claim that every optional Pro capability is appropriate without review;
- a replacement for an application's own threat model, load testing, or operations review.

## Authoritative sources

- CLI entry and command routing: [`cli/src/index.ts`](../cli/src/index.ts), [`cli/src/cli/run.ts`](../cli/src/cli/run.ts)
- Configuration model: [`cli/src/config/schema.ts`](../cli/src/config/schema.ts)
- Module resolution: [`cli/src/config/resolver.ts`](../cli/src/config/resolver.ts)
- Composition: [`cli/src/composer/compose.ts`](../cli/src/composer/compose.ts)
- Public website: [`web/`](../web/)
