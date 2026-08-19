# Praxis Flow

Praxis Flow is a composable CLI for generating native frontend, backend, full-stack, and production-backend projects. It includes five frontend frameworks, JavaScript and TypeScript support, 40 landing-page design directions, Express projects, and Praxis Pro backends for Django/DRF or Go/Gin.

## Install from GitHub Packages

GitHub Packages requires authentication for npm package downloads, including public packages. Create a classic GitHub personal access token with `read:packages`, then configure npm:

```ini
@sidhxntt:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

Save those lines in your user-level `~/.npmrc`, then install or run Praxis Flow:

```bash
npm install --global @sidhxntt/praxiflow
praxiflow
```

Or run it without a permanent global installation:

```bash
npx @sidhxntt/praxiflow
```

## Usage

```bash
praxiflow
praxiflow my-app --quick
praxiflow --config praxis.config.json
praxiflow help
```

Generated backend projects include `.env.example`; copy it to `.env` and configure every required value before starting the backend. Every generated project includes a README, and every generated frontend includes its selected `DESIGN.md`.

Full documentation is available in the [Praxis repository](https://github.com/sidhxntt/Praxis) and [GitHub Wiki](https://github.com/sidhxntt/Praxis/wiki).
