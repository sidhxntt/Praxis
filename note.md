# Praxis generation flow — beginner notes

This note explains what happens after a user chooses a project in the Praxis CLI.

## The short version

```text
User choices
→ PraxisConfig (in memory)
→ praxis.config.json (intent record, when saved)
→ schema validation
→ resolver
→ ordered module IDs
→ manifest-driven composition in staging
→ generated project
```

Praxis does not clone a Git branch for a selected template. The CLI package already contains the maintained modules in `cli/templates/`. A configuration selects the modules that apply, and the composer assembles them.

## Walkthrough: what a user experiences

Imagine the user selects:

- A **fullstack** project
- **Next.js** for the frontend
- **Express** for the backend
- **PostgreSQL** and **Redis**
- Self-hosted authentication
- Docker deployment

### 1. The CLI records the user's intent

The interactive questions first form a typed `PraxisConfig` in memory. This lets the CLI work without writing a file until it needs to.

The same information can be supplied in, or saved as, `praxis.config.json`:

```json
{
  "projectType": "fullstack",
  "framework": "next",
  "backend": "express",
  "database": "postgres",
  "cache": "redis",
  "auth": "self-hosted",
  "deployment": "docker"
}
```

This file is the **intent record**. It describes the project the user asked for; it is not the generated source code and it is not a Git branch name.

### 2. Praxis validates the configuration

The schema checks that every choice is supported and that the combination makes sense. An unsupported framework, a misspelled capability, or an incompatible Pro selection stops here with an error.

Nothing is generated when validation fails. This prevents a partially configured repository.

### 3. The resolver selects implementation modules

`resolver.ts` converts the valid configuration into stable module IDs. For the example above, the resolved set can include:

```text
base.workspace
frontend.next
styling.tailwind-shadcn
backend.express
database.postgres
auth.self-hosted
cache.redis
deployment.docker
```

These IDs identify maintained modules inside `cli/templates/`. They are fixed implementation references, not dynamic template branches from Git.

### 4. Praxis orders the modules

Order is important because some modules build on others.

For example, a background-jobs capability needs Redis. The resolver puts `pro.capability.redis-cache` before `pro.capability.background-jobs`, so Redis packages, environment keys, and infrastructure wiring exist before the worker integration is added.

The same rule applies to patches: a base runtime must create a settings file before a selected capability can patch that settings file.

### 5. The composer applies manifests

Each module has a `manifest.json`. The composer reads those manifests in resolver order and can:

- copy framework-native source files (**overlays**);
- merge dependencies and scripts (**package contributions**);
- add values to `.env.example` (**environment contributions**);
- integrate features at declared anchors (**patches**).

For example, the Express module provides the backend structure, PostgreSQL adds Prisma-related files and dependencies, Redis adds cache wiring, and Docker adds the files needed to run the selected output.

### 6. Composition is atomic

Praxis writes into a temporary staging directory first. Only when every overlay, package merge, environment contribution, and patch succeeds does it publish the destination project.

If anything fails—such as a missing patch anchor or an undeclared file conflict—the staging directory is discarded. The requested destination is not left as a half-generated project.

### 7. The result is independent

The generated repository is a normal standalone project. Praxis is not a runtime dependency. After composition, Praxis can optionally install dependencies and run `git init`; these are post-generation steps and do not fetch template code from Git.

Keeping the effective `praxis.config.json` in the generated repository makes the result inspectable and reproducible: it records which user choices and resolved capabilities produced the project.
