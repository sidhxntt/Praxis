# Praxis Flow ⚡️

Praxis Flow is an interactive, composable CLI for scaffolding modern frontend, backend, and fullstack JavaScript or TypeScript projects.

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

If template mode is selected, the normalized design guide is copied to `DESIGN.md` in a frontend-only project or `frontend/DESIGN.md` in a fullstack project. This preserves the chosen design language for future development. Plain starter mode does not add a design guide.

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
npm run dev
npm test
npm run build
npm run check
```

The bundled manifest templates are included in the npm package, so a fixed Praxis Flow version and configuration resolve to the same source tree.

## License

MIT
