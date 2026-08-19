# Praxis documentation

Praxis is a deterministic project generator. A user describes a desired project through the `praxiflow` CLI or a versioned JSON configuration; Praxis validates that intent, resolves a set of composable template modules, and atomically writes a complete source tree.

This directory is the documentation source of truth. The [Praxis GitHub Wiki](https://github.com/sidhxntt/Praxis/wiki) is rendered from these files so documentation changes travel through the same review history as code.

## Choose a reading path

### I am evaluating Praxis

1. [Overview](overview.md) — what Praxis is and is not.
2. [Architecture](architecture.md) — the major systems and data flow.
3. [Standard projects](standard-projects.md) or [Praxis Pro](praxis-pro.md) — what gets generated.

### I am changing Praxis

1. [Repository map](repository-map.md) — workspace and directory ownership.
2. [Code architecture](code-architecture.md) — TypeScript modules and abstractions.
3. [Generation pipeline](generation-pipeline.md) — the complete execution sequence.
4. [Manifest system](manifest-system.md) — how template modules compose.
5. [Testing](testing.md) — the evidence required for a safe change.

### I am an agent joining the repository

Start with the [agent guide](agent-guide.md). It maps common tasks to authoritative files, invariants, and verification commands. Do not infer generator behavior from template filenames alone: module selection and manifest selectors determine what reaches an output.

## Core documentation

| Page | Answers |
| --- | --- |
| [Terminology](terminology.md) | What do project, module, manifest, overlay, selector, capability, and scope mean? |
| [Code architecture](code-architecture.md) | Which modules own parsing, configuration, resolution, composition, UI selection, and generation? |
| [Generation pipeline](generation-pipeline.md) | How does a CLI answer become a generated directory? |
| [Manifest system](manifest-system.md) | How are files, packages, environment keys, and patches combined? |
| [Generated backends](generated-backends.md) | How do Express, Django, and Gin outputs work and tie together? |
| [UI templates](ui-templates.md) | How do 40 designs become native code across nine targets? |
| [Wiki publishing](wiki-publishing.md) | How are these files validated and published? |

## Accuracy contract

- Pages describe the current `main`/`cli` implementation unless marked **Future direction**.
- Repository-relative source links identify the implementation that supports a claim.
- A template existing on disk does not mean it is selected for every project.
- Frontend-only projects do **not** generate a backend. Backend and fullstack projects generate Express; `pro-backend` generates Django/DRF or Go/Gin.
- Generated projects are outputs, not runtime dependencies of the Praxis CLI.

