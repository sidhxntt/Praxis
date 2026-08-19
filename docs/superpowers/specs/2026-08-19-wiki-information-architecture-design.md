# Praxis Wiki information architecture redesign

## Goal

Reorganize the Praxis Wiki around two primary knowledge domains and replace the current index-like Home page with a strong architectural introduction. Readers should immediately understand what Praxis does, how generation works at a high level, and whether they need documentation about Praxis itself or about the projects Praxis generates.

## Primary navigation

The Wiki has two top-level domains:

1. **Praxis Core Internals** explains how the Praxis repository and generator are built.
2. **Praxis Template Architecture** explains how generated projects are structured and how selected template modules work together at runtime.

The sidebar, Home page, and cross-links must preserve this distinction. A page should not mix generator implementation with generated-application runtime architecture unless it is explicitly explaining the boundary between them.

## Home page

Home is an architectural gateway rather than a flat document listing. It contains:

1. A concise statement of what Praxis is and what it produces.
2. A high-level diagram from CLI/configuration through module resolution and composition to a standalone generated repository.
3. A clear explanation that Praxis is not a runtime dependency of generated projects.
4. Two prominent reading paths: Core Internals and Template Architecture.
5. A comparison of Standard Praxis and Praxis Pro outputs.
6. Task-oriented entry points for evaluators, generated-project users, contributors, and coding agents.
7. Links to authoritative source locations and verification guidance.

Home must be profound but concise: it establishes the mental model and routes readers to detailed pages instead of duplicating them.

## Praxis Core Internals

This domain covers:

- repository and workspace boundaries;
- CLI parsing and interactive/config-file workflows;
- configuration schemas and validation;
- Standard module resolution and Pro capability closure;
- manifest selectors, overlays, patches, package contributions, and environment contributions;
- atomic generation and post-generation operations;
- UI-template authoring and verification;
- test architecture, Wiki publication, and agent/contributor guidance.

Existing accurate material should be reorganized and cross-linked rather than duplicated. Core pages identify authoritative TypeScript files and tests.

## Praxis Template Architecture

This domain begins with a template-system overview explaining how a validated configuration resolves to modules and how those modules become independent runtime code. It then provides dedicated pages for:

- Standard frontend outputs;
- Standard Express backend outputs;
- Standard fullstack workspace integration;
- Django/DRF Praxis Pro outputs;
- Go/Gin Praxis Pro outputs;
- operational capability and dependency wiring;
- Docker Compose topology;
- Kubernetes workload architecture;
- Terraform architecture for AWS, Azure, and GCP;
- generated-project extension and operational responsibilities.

## Template-page contract

Each major generated backend page documents the same concerns so readers can compare stacks:

1. generated directory map;
2. runtime entry points;
3. request lifecycle;
4. domain, service, persistence, and integration boundaries;
5. dependency construction and wiring;
6. startup, readiness, and graceful shutdown;
7. authentication, authorization, cache, jobs, telemetry, and other selected capability integrations;
8. Docker Compose, Kubernetes, and Terraform relationships;
9. extension points and constraints;
10. authoritative template manifests, source overlays, and tests.

The prose must describe the actual programming model:

- Express uses functional modules and explicit lifecycle composition.
- Django/DRF uses framework-driven object-oriented patterns, applications, views, services, models, middleware, and settings.
- Go/Gin uses structs, interfaces, constructors, handlers, services, repositories, and explicit compile-time dependency wiring.

The Wiki must not label all generated stacks as object-oriented.

## Navigation and naming

The generated GitHub Wiki sidebar groups every managed page under **Praxis Core Internals** or **Praxis Template Architecture**, with Home and terminology available before both groups. Page titles should be descriptive rather than mirroring repository filenames.

Every detailed page links upward to its domain overview and laterally only to directly related material. Core pages link to template pages when explaining output semantics; template pages link back to Core only when explaining selection or composition.

## Accuracy and maintenance

- Markdown under `docs/` remains the source of truth.
- Wiki pages continue to be rendered and published by the existing scripts and workflow.
- All internal links must pass the documentation link checker.
- Architecture claims must cite authoritative source directories and contract tests.
- Mermaid diagrams must describe current implemented behavior, not planned features.
- Existing valuable content should be migrated without leaving competing duplicate explanations.

## Verification

The redesign is complete when:

- Home visibly establishes the two-domain mental model;
- the sidebar exposes both domains and their dedicated pages;
- Standard Express, Django/DRF, and Go/Gin each have detailed architecture pages satisfying the template-page contract;
- infrastructure pages explain how Compose, Kubernetes, and Terraform relate to application code;
- no managed documentation links are broken;
- the Wiki renderer includes every intended page exactly once;
- documentation tests and the repository check suite pass.
