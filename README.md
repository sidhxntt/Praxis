# Praxis Flow

Praxis Flow is a configuration-driven CLI that generates standalone frontend, backend, fullstack, and production-backend repositories. A user’s choices become a validated `praxis.config.json` **intent record**; Praxis resolves maintained modules and composes them atomically into a project.

It does not clone a preassembled Git branch for every template combination. The published `praxiflow` package contains the CLI and its template catalog, while the configuration selects the modules that apply.

## Start here

- [Configuration-to-project summary](SUMMARY.md) — the short explanation of intent, validation, resolution, ordering, and staging.
- [Technical documentation](docs/index.md) — the source for the [Praxis GitHub Wiki](https://github.com/sidhxntt/Praxis/wiki).
- [Template Agent Guide](docs/template-agent-guide.md) — the bounded-context workflow for changing template behavior.
- [Release guide](RELEASING.md) — verified tagging and npm publishing.

## Install and run

```bash
npm install --global praxiflow
praxiflow
```

Or run without a global install:

```bash
npx praxiflow
```

For local development:

```bash
npm install
npm run build:cli
cd cli
npm link
```

## What Praxis can generate

| Project family | Output |
| --- | --- |
| Standard frontend | Next.js, Vite React, Vue, Astro, or Angular with JavaScript/TypeScript support where the framework permits it |
| Standard backend | Express with JavaScript or TypeScript |
| Standard fullstack | A selected frontend plus Express in `frontend/` and `backend/` |
| Praxis Pro | Django/DRF or Go/Gin with selected operational capabilities |

Standard projects can select PostgreSQL or MongoDB, Redis or Memcached, authentication, landing-page styles, and deployment files for Vercel, Railway, Render, or Docker. Praxis Pro always provides Docker Compose and can add capabilities for caching, jobs, observability, security, Kubernetes, and AWS/Azure/GCP Terraform.

## How generation works

```text
CLI answers or praxis.config.json
→ schema validation
→ ordered module IDs and capability closure
→ manifest-driven composition in staging
→ standalone generated repository
```

The resolver orders prerequisites before dependants. For example, Redis is resolved before background jobs, so cache configuration and environment keys exist before worker integration is applied. The composer then processes module manifests in that order:

- **Overlays** add framework-native files.
- **Package contributions** merge dependencies and scripts.
- **Environment contributions** extend `.env.example`.
- **Patches** integrate selected features at declared anchors.

All work happens in a temporary staging directory. Praxis publishes the destination only after every contribution succeeds; an undeclared collision or missing patch anchor leaves no partial project behind.

## Configuration files

Use a saved configuration for reproducible generation:

```bash
praxiflow --config praxis.config.json
```

```json
{
  "schemaVersion": 1,
  "name": "my-app",
  "projectType": "fullstack",
  "language": "typescript",
  "frontend": {
    "framework": "next",
    "styling": "tailwind-shadcn",
    "ui": { "mode": "starter" }
  },
  "backend": {
    "framework": "express",
    "database": "postgres",
    "auth": "self-hosted",
    "cache": "redis"
  },
  "deployment": ["docker"],
  "packageManager": "npm",
  "installDependencies": true,
  "initializeGit": true
}
```

The generated repository can retain the effective configuration for provenance. It is independent at runtime: Praxis is a generator, not an application dependency.

## Repository layout

| Path | Responsibility |
| --- | --- |
| `cli/` | Publishable generator, templates, UI catalog, and generator tests |
| `web/` | Independently deployed public website |
| `docs/` | Canonical Markdown source for the GitHub Wiki |
| `scripts/` | Documentation validation, context resolution, and Wiki rendering |

## Documentation checks

```bash
npm run docs:check
npm --workspace cli test
npm run build:cli
```

The context resolver is available for focused template work:

```bash
node scripts/resolve-template-context.mjs --config /path/to/praxis.config.json
```

For detailed architecture, runtime ownership, extension points, and verification boundaries, continue in the [technical documentation](docs/index.md).
