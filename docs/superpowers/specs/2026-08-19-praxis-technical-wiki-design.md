# Praxis Technical Wiki Design

## Purpose

Create a repository-owned technical wiki that explains Praxis to humans and coding agents from product concepts down to generated source files. The documentation must answer what Praxis is, how its repository and runtime architecture work, how configuration resolves into manifest modules, how overlays and patches compose a project, and how standard and Pro backend outputs fit together.

## Source of truth and publishing

- Markdown under `docs/` is authoritative and reviewed with code.
- GitHub Wiki is a rendered publication target, never the authoring source.
- `scripts/render-github-wiki.mjs` maps repository pages to Wiki-safe filenames and rewrites internal links.
- A GitHub Actions workflow validates documentation and publishes changed Wiki pages after successful pushes to `main`.
- The renderer never deletes unmanaged Wiki pages.

## Information architecture

The Wiki uses four reading paths:

1. **Product orientation:** Home, overview, system architecture, terminology.
2. **Implementation:** code architecture, generation pipeline, manifest system, repository map.
3. **Generated outputs:** standard projects, Praxis Pro, generated backends, UI templates.
4. **Maintenance:** testing, agent guide, Wiki publishing.

The Home page provides task-based routes for a first-time user, contributor, and agent. `_Sidebar.md` and `_Footer.md` provide persistent Wiki navigation and provenance.

## Documentation conventions

- Current code is authoritative. Future direction appears only in explicitly labeled sections.
- Mermaid diagrams describe repository boundaries, generation sequence, module dependency flow, and generated backend topology.
- Every code-level page contains an “authoritative source map” with repository-relative paths.
- Each subsystem documents inputs, outputs, invariants, failure behavior, and extension points.
- Agent-facing guidance includes deterministic reading order, change-impact tables, verification commands, and warnings against editing generated UI artifacts directly.
- The docs explicitly correct the assumption that every selection generates a backend: frontend-only projects do not; backend/fullstack projects generate Express; `pro-backend` generates Django/DRF or Go/Gin.

## Validation

- Check that every relative Markdown link resolves in the repository.
- Render all managed pages into a temporary Wiki directory.
- Validate that rendered Wiki links use Wiki page names or repository URLs.
- Run the existing CLI and web checks because documentation tooling changes root scripts and CI configuration.
- Inspect generated `Home.md`, `_Sidebar.md`, and representative architecture pages.

## Scope boundaries

This work documents the current `cli/` and `web/` workspaces, including the 40-style UI catalog and composable Pro generator. It does not redesign generator behavior, add new templates, or claim unimplemented runtime capabilities.
