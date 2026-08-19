# Praxis Flow

Praxis Flow is a composable CLI for generating native frontend, backend, full-stack, and production-backend projects. It includes five frontend frameworks, JavaScript and TypeScript support, 40 landing-page design directions, Express projects, and Praxis Pro backends for Django/DRF or Go/Gin.

## Install from npm

Praxis Flow is public on npm and requires no registry configuration or authentication:

```bash
npm install --global praxiflow
praxiflow
```

Or run it without a permanent global installation:

```bash
npx praxiflow
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
