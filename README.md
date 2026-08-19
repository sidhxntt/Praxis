# Praxis Flow ⚡️

Praxis Flow is an interactive, composable CLI for scaffolding modern frontend, backend, and fullstack JavaScript or TypeScript projects.

It also includes Praxis Pro, a capability-driven production backend generator for Django/DRF and Go/Gin.

## Features

- Next.js or Vite frontends
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

```bash
npm install -g praxiflow
```

During local development:

```bash
npm install
npm run build
npm link
```

## Usage

Run Praxis Flow without arguments:

```bash
praxiflow
```

The splash appears first, followed by the project-name prompt and the complete custom questionnaire. This is the canonical Praxis Flow experience; there is no separate legacy workflow.

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
    "styling": "tailwind-shadcn"
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
npm run dev
npm test
npm run build
npm run check
```

The bundled manifest templates are included in the npm package, so a fixed Praxis Flow version and configuration resolve to the same source tree.

## License

MIT
