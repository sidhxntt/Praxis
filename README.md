# Praxis Flow ⚡️

Praxis Flow is an interactive, composable CLI for scaffolding modern frontend, backend, and fullstack JavaScript or TypeScript projects.

It also includes Praxis Pro, a capability-driven production backend generator for Django/DRF and Go/Gin.

## Repository layout

- `cli/` contains the publishable Praxis Flow CLI, Praxis Pro, generators, templates, tests, and CLI documentation.
- `web/` contains the Praxis website and its Next.js application.
- The repository root is a private npm workspace that owns shared commands, CI, and project documentation.

## Documentation

The complete human- and agent-friendly technical guide lives in the [repository documentation](docs/index.md) and is published to the [Praxis GitHub Wiki](https://github.com/sidhxntt/Praxis/wiki). It covers the system and code architecture, configuration-to-manifest generation flow, standard and Pro backend topology, UI template pipeline, extension points, and verification requirements.

Maintainer releases use separate repository and CLI tags. See [RELEASING.md](RELEASING.md) for the verified tagging and publishing workflow.

Repository Markdown is the source of truth; the Wiki is generated from it. See the [Wiki publishing guide](docs/wiki-publishing.md).

## Features

- Next.js, Vite (React), Vue, Astro, and Angular frontends
- JavaScript and TypeScript for every framework except Angular, which is TypeScript-only
- 40 original, multi-section landing-page styles with local visual previews
- Plain Tailwind + shadcn starter mode when no landing-page template is wanted
- Express backends
- Tailwind CSS and shadcn/ui
- PostgreSQL, MongoDB, or no database
- Redis, Memcached, or no cache
- Self-hosted auth, Clerk, Supabase Auth, or no auth
- Vercel, Railway, Render, and Docker deployment files
- npm, pnpm, Yarn, and Bun support
- Reproducible JSON configuration files
- Atomic generation: failed projects are cleaned up
- Praxis Pro production backends with Docker Compose and optional Kubernetes/Terraform

## Praxis Pro

Select **Production Backend (Praxis Pro)** in the normal `praxiflow` questionnaire. Pro asks for Django/DRF or Go/Gin, then lets you select capabilities such as authentication, authorization, caching, jobs, email, storage, search, realtime, Kafka, observability, security, Kubernetes, and Terraform. Tools are opinionated defaults; the user selects capabilities rather than vendors.

Terraform is opt-in. When selected, Praxis asks for AWS, Azure, or GCP and generates cloud-specific infrastructure. Kubernetes is implied by Terraform, while Docker Compose is always generated as the local production-shaped environment. Requested and implied capabilities are recorded separately in `praxis.config.json` and the generated README.

Example schema-version-2 configuration:

```json
{
  "schemaVersion": 2,
  "name": "payments-api",
  "projectType": "pro-backend",
  "pro": {
    "stack": "go-gin",
    "requestedCapabilities": [
      "jwt-auth",
      "redis-cache",
      "background-jobs",
      "prometheus",
      "terraform"
    ],
    "resolvedCapabilities": [
      "jwt-auth",
      "redis-cache",
      "background-jobs",
      "prometheus",
      "kubernetes",
      "autoscaling",
      "high-availability",
      "edge-protection",
      "cloud-secrets",
      "database-resilience",
      "terraform"
    ],
    "cloud": "aws"
  },
  "installDependencies": true,
  "initializeGit": true
}
```

The generated project contains pinned dependencies, health/readiness/startup probes, hardened containers, CI security gates, operational runbooks, selected service wiring, and deployment artifacts matching the effective capability set.

## Installation

Praxis Flow is published to GitHub Packages as `@sidhxntt/praxiflow`. Configure npm authentication for GitHub Packages in `~/.npmrc`:

```ini
@sidhxntt:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

The token must be a classic GitHub personal access token with `read:packages`.

```bash
npm install --global @sidhxntt/praxiflow
praxiflow
```

Or run it without a global installation:

```bash
npx @sidhxntt/praxiflow
```

During local development:

```bash
npm install
npm run build:cli
cd cli
npm link
```

## Usage

Run Praxis Flow without arguments:

```bash
praxiflow
```

The splash appears first, followed by the project-name prompt and the complete custom questionnaire. This is the canonical Praxis Flow experience; there is no separate legacy workflow.

For frontend and fullstack projects, the CLI asks for a language, then a framework, then whether to use a landing-page template. Angular is clearly labeled TypeScript-only; if it is selected after JavaScript, Praxis Flow offers to continue with TypeScript or return to framework selection.

## Frontend frameworks

| Framework | JavaScript | TypeScript |
| --- | --- | --- |
| Next.js | Yes | Yes |
| Vite (React) | Yes | Yes |
| Vue | Yes | Yes |
| Astro | Yes | Yes |
| Angular | No | Yes |

Every generated frontend includes Tailwind CSS and framework-native UI primitives. Next.js and Vite use shadcn/ui-compatible React primitives; Vue, Astro, and Angular receive equivalent native starter primitives.

## Landing-page templates

Template mode opens an offline visual gallery at a random `127.0.0.1` port. Nothing is uploaded: catalog metadata, screenshots, and artwork are bundled with the CLI and served only from a fixed local allowlist. Search by name or trait, open a desktop/mobile preview, and choose a style; the selection returns directly to the waiting CLI. In CI, headless environments, when browser launch is declined, or if it fails, Praxis Flow provides a terminal filter and selector instead.

The 40 available directions are:

- Airbnb inspired, Airtable inspired, Apple inspired, Binance inspired
- BMW M inspired, BMW inspired, Bugatti inspired, Cal inspired
- Claude inspired, Clay inspired, ClickHouse inspired, Coinbase inspired
- Cursor inspired, Dell 1996 inspired, Discord inspired, ElevenLabs inspired
- Expo inspired, Ferrari inspired, Figma inspired, Framer inspired
- HP inspired, Lamborghini inspired, Lovable inspired, Mastercard inspired
- Meta inspired, MongoDB inspired, Notion inspired, NVIDIA inspired
- Ollama inspired, Pinterest inspired, PlayStation inspired, Raycast inspired
- Revolut inspired, Sentry inspired, SpaceX inspired, Supabase inspired
- Tesla inspired, Uber inspired, Vercel inspired, Warp inspired

These names describe visual inspiration only. Praxis Flow is not affiliated with, endorsed by, or sponsored by the referenced companies. The generated pages use fictional brands, original copy, and locally bundled original artwork.

Each option generates a responsive, industry-style landing page with navigation, hero, supporting product/story sections, proof or metrics, a call to action, and footer. Templates do not include dashboards, application forms, or admin UI.

Every frontend includes a design guide: `DESIGN.md` in a frontend-only project or `frontend/DESIGN.md` in a fullstack project. A selected visual template contributes its specific design language; plain Tailwind and shadcn starter mode receives an adaptable design foundation.

The optional `create` command is a compatibility alias:

```bash
praxiflow create
praxiflow create my-app
```

### Help

```bash
praxiflow help
praxiflow --help
praxiflow -h
```

Help lists every supported command and flag without opening the interactive prompts.

### Quick generation

```bash
praxiflow my-app --quick
# Equivalent alias:
praxiflow create my-app --quick
```

Quick mode uses the recommended fullstack defaults and selects no cache, so it does not introduce an unexpected service.

### Configuration files

```bash
praxiflow --config praxis.config.json
praxiflow create --config praxis.config.json
```

Example:

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
  "deployment": ["vercel", "railway", "docker"],
  "packageManager": "npm",
  "installDependencies": true,
  "initializeGit": true
}
```

Existing schema-version-1 files without `backend.cache` remain supported and are interpreted as `"none"`. Newly generated configuration files always record the cache selection.

To select a landing-page style from configuration instead of the interactive gallery:

```json
{
  "schemaVersion": 1,
  "name": "my-site",
  "projectType": "frontend",
  "language": "typescript",
  "frontend": {
    "framework": "astro",
    "styling": "tailwind-shadcn",
    "ui": { "mode": "template", "style": "apple" }
  },
  "deployment": ["vercel"],
  "packageManager": "npm",
  "installDependencies": true,
  "initializeGit": true
}
```

Use `--no-install` to generate source without installing packages:

```bash
praxiflow my-app --quick --no-install
```

## Cache integration

Backend and fullstack projects can select:

- `redis` — official Redis client, default `redis://localhost:6379`
- `memcached` — Memjs client, default `localhost:11211`
- `none`

Selected cache modules include connection readiness, graceful shutdown, async get/set helpers, and an example `GET /api/cache` endpoint. Set a custom server in the generated backend `.env`:

```dotenv
CACHE_URL=redis://localhost:6379
```

or:

```dotenv
CACHE_URL=localhost:11211
```

When Docker is selected, Compose includes the matching cache service and configures the backend with the internal service URL automatically.

## Generated environment files

Praxis Flow writes `.env.example`, never real secrets. Copy it before local development:

```bash
cp .env.example .env
```

For a fullstack project, environment files live in the relevant `frontend` and `backend` directories.

## Development

```bash
npm install
npm run dev:cli
npm run dev:web
npm run test:cli
npm run build:cli
npm run build:web
npm run check
```

The bundled manifest templates are included in the npm package, so a fixed Praxis Flow version and configuration resolve to the same source tree.

## License

MIT
