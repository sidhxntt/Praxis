# Praxis Pro Production Backend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a production-grade, selectable Django/DRF or Go/Gin backend generator to the existing Praxis Flow CLI, with capability-driven Docker Compose, optional Kubernetes, and optional AWS/Azure/GCP Terraform output.

**Architecture:** Schema-v2 introduces a discriminated `pro-backend` configuration without changing schema-v1 projects. A resolver turns requested capabilities into deterministic implied capabilities and stack-specific module IDs. Shared capability contracts drive stack adapters and infrastructure renderers so Docker, Kubernetes, and Terraform remain consistent with generated application services.

**Tech Stack:** TypeScript CLI, Vitest, JSON template manifests, Python/Django/DRF/PDM, Go/Gin/pgx/sqlc, Docker Compose, Kubernetes, Terraform.

---

## File structure

- `src/config/schema.ts`: schema-v1 and schema-v2 discriminated configuration validation.
- `src/config/pro.ts`: Pro capability catalog, implications, defaults, and resolver.
- `src/workflow/answers.ts`: normal and Pro prompt answers converted into configs.
- `src/workflow/runCreate.ts`: stack and capability prompts with conditional cloud selection.
- `src/composer/manifest.ts`: stack/capability selectors and non-Node contribution types.
- `src/composer/compose.ts`: selector filtering and deterministic generic metadata/file composition.
- `templates/pro.*`: stack cores, capability adapters, Compose, Kubernetes, and Terraform modules.
- `tests/config/pro.test.ts`: schema and implication contract.
- `tests/workflow/proAnswers.test.ts`: answer/config mapping.
- `tests/generator/proMatrix.test.ts`: generated artifact presence and absence matrix.
- `tests/generator/proRuntime.test.ts`: generated Django and Go build/runtime checks.
- `tests/generator/proInfrastructure.test.ts`: Compose, Kubernetes, and Terraform validation.

### Task 1: Pro schema and capability resolver

**Files:**
- Create: `src/config/pro.ts`
- Modify: `src/config/schema.ts`
- Create: `tests/config/pro.test.ts`

- [ ] **Step 1: Write failing schema and resolution tests**

Test that `pro-backend` requires schema version 2, a `python-django | go-gin` stack, unique known capabilities, conditional cloud selection, and rejects legacy-only keys. Test deterministic implications: `terraform -> kubernetes, autoscaling, high-availability, edge-protection, cloud-secrets, database-resilience`; `realtime -> redis-cache`; `scheduled-jobs -> background-jobs`; `email-tasks -> background-jobs`.

- [ ] **Step 2: Verify RED**

Run: `npm test -- tests/config/pro.test.ts`
Expected: FAIL because Pro types and resolver do not exist.

- [ ] **Step 3: Implement the schema and resolver**

Export `ProStack`, `CloudProvider`, `ProCapability`, `ProConfig`, `resolveProCapabilities()`, and `recommendedProCapabilities`. Keep `LegacyPraxisConfig` unchanged and define `PraxisConfig = LegacyPraxisConfig | ProPraxisConfig`. Return capabilities in catalog order rather than input order.

- [ ] **Step 4: Verify GREEN and regressions**

Run: `npm test -- tests/config/pro.test.ts tests/config/schema.test.ts tests/config/load.test.ts tests/config/resolver.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

`git commit -m "feat: add Praxis Pro configuration model"`

### Task 2: Pro prompts, config loading, and module resolution

**Files:**
- Modify: `src/config/load.ts`
- Modify: `src/config/resolver.ts`
- Modify: `src/workflow/answers.ts`
- Modify: `src/workflow/runCreate.ts`
- Modify: `src/cli/help.ts`
- Create: `tests/workflow/proAnswers.test.ts`
- Modify: `tests/workflow/runCreate.test.ts`
- Modify: `tests/config/resolver.test.ts`

- [ ] **Step 1: Write failing prompt and resolver tests**

Assert that project type offers Pro, then asks stack, grouped multiselect capabilities, cloud only for Terraform, and common install/Git questions. Assert config-file round trips and module order: core, stack, capability adapters, Compose, Kubernetes, cloud Terraform.

- [ ] **Step 2: Verify RED**

Run: `npm test -- tests/workflow/proAnswers.test.ts tests/workflow/runCreate.test.ts tests/config/resolver.test.ts`
Expected: FAIL on missing Pro flow.

- [ ] **Step 3: Implement prompt mapping and resolution**

Use stable capability IDs from `src/config/pro.ts`. Show recommended items as initial multiselect values. Resolve implications before displaying a confirmation note. Do not ask language, JavaScript package manager, frontend, database vendor, auth vendor, or deployment-target questions in Pro mode.

- [ ] **Step 4: Verify GREEN and full CLI regression**

Run: `npm test -- tests/cli tests/workflow tests/config`
Expected: PASS.

- [ ] **Step 5: Commit**

`git commit -m "feat: add Praxis Pro interactive flow"`

### Task 3: Pro-aware composition contracts

**Files:**
- Modify: `src/composer/manifest.ts`
- Modify: `src/composer/compose.ts`
- Modify: `tests/composer/compose.test.ts`

- [ ] **Step 1: Write failing selector tests**

Cover `proStack`, `capability`, and `cloud` on overlays, patches, environments, and generic file contributions. Prove nonmatching contributions are absent and path confinement still applies.

- [ ] **Step 2: Verify RED**

Run: `npm test -- tests/composer/compose.test.ts`
Expected: FAIL because the new selectors are unsupported.

- [ ] **Step 3: Add shared selector matching**

Introduce one `ManifestSelector` used by every contribution. Match against resolved Pro config and preserve all legacy selector behavior. Add token values for `proStack`, `cloud`, and stack commands without allowing arbitrary template execution.

- [ ] **Step 4: Verify GREEN**

Run: `npm test -- tests/composer/compose.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

`git commit -m "feat: compose stack-aware Pro modules"`

### Task 4: Django/DRF production core

**Files:**
- Create: `templates/pro.core/manifest.json`
- Create: `templates/pro.django/manifest.json`
- Create: `templates/pro.django/files/**`
- Create: `tests/generator/proDjango.test.ts`

- [ ] **Step 1: Write failing generated-project assertions**

Assert PDM metadata, split settings, DRF, psycopg pooling, ASGI/Gunicorn, JSON correlation logging, OpenAPI, consistent errors, probes, migrations, non-root image, Compose PostgreSQL health gating, pytest, Ruff, mypy, Bandit, pip-audit, and CI/SBOM/security configuration.

- [ ] **Step 2: Verify RED**

Run: `npm test -- tests/generator/proDjango.test.ts`
Expected: FAIL because Django modules are missing.

- [ ] **Step 3: Add minimal complete Django core templates**

Generate a runnable `/api/v1/health/live`, `/ready`, and `/startup` service; a versioned example endpoint; production settings that fail closed; migrations; container entrypoint that migrates before Gunicorn; and Compose PostgreSQL with named volumes and health checks.

- [ ] **Step 4: Verify generated output**

Run generator assertions, install with PDM, then run `ruff check`, `mypy`, `bandit`, `pytest`, Django migrations check, `manage.py check --deploy`, `docker compose config`, and image build.

- [ ] **Step 5: Commit**

`git commit -m "feat: add Django production core"`

### Task 5: Go/Gin production core

**Files:**
- Create: `templates/pro.gin/manifest.json`
- Create: `templates/pro.gin/files/**`
- Create: `tests/generator/proGin.test.ts`

- [ ] **Step 1: Write failing generated-project assertions**

Assert Go modules, Gin, pgx/sqlc, golang-migrate, validator, slog correlation logging, oapi-codegen, consistent errors, probes, graceful lifecycle, non-root image, Compose PostgreSQL health gating, Testify/Testcontainers, golangci-lint, govulncheck, and gosec.

- [ ] **Step 2: Verify RED**

Run: `npm test -- tests/generator/proGin.test.ts`
Expected: FAIL because Go modules are missing.

- [ ] **Step 3: Add minimal complete Go core templates**

Generate `cmd/api`, bounded `internal` packages, contract-first routes, migrations, sqlc configuration, startup database verification, signal-safe shutdown, and a multi-stage distroless/non-root image.

- [ ] **Step 4: Verify generated output**

Run generator assertions, `go mod download`, `go generate`, `go test -race ./...`, `go vet ./...`, golangci-lint, govulncheck, gosec, migration validation, `docker compose config`, and image build.

- [ ] **Step 5: Commit**

`git commit -m "feat: add Go Gin production core"`

### Task 6: Capability adapters and Docker Compose

**Files:**
- Create: `templates/pro.capability.*/manifest.json`
- Create: `templates/pro.capability.*/files/{django,go,compose}/**`
- Create: `tests/generator/proCapabilities.test.ts`
- Create: `tests/generator/proCompose.test.ts`

- [ ] **Step 1: Write a failing parity matrix**

For every approved capability, assert Django and Go adapters, dependency pins, environment keys, routes/workers, tests, documentation, and exact Docker services. Assert implication wiring and absence when unselected.

- [ ] **Step 2: Verify RED**

Run: `npm test -- tests/generator/proCapabilities.test.ts tests/generator/proCompose.test.ts`
Expected: FAIL because adapters are missing.

- [ ] **Step 3: Implement capability modules sequentially**

Add JWT, social auth, authorization, Redis, jobs, scheduler, email, storage, Elasticsearch, realtime, Kafka, flags, Sentry, Prometheus, OpenTelemetry, ELK, synthetic checks, load tests, compliance audit, Nginx, database resilience, and disaster recovery. Each selected dependency receives a Compose service or explicit external-service configuration, health checks, startup ordering, volumes, networks, resource defaults, and stack-specific runtime wiring.

- [ ] **Step 4: Verify each adapter before the next**

Run focused tests and generated Django/Go builds after every module. At task end run the maximal local stack with `docker compose config`, build, start, probe, and shut it down cleanly.

- [ ] **Step 5: Commit in capability-sized commits**

Use `feat(pro): add <capability> adapters` per capability group.

### Task 7: Kubernetes composition

**Files:**
- Create: `templates/pro.kubernetes/manifest.json`
- Create: `templates/pro.kubernetes/files/**`
- Create: `tests/generator/proKubernetes.test.ts`

- [ ] **Step 1: Write failing workload and absence tests**

Cover Deployments, Services, ConfigMaps, secret references, probes, jobs/workers, HPA, PDB, topology spread, anti-affinity, rolling updates, service accounts, network policies, resources, and capability-conditioned workloads.

- [ ] **Step 2: Verify RED, implement, then verify GREEN**

Run: `npm test -- tests/generator/proKubernetes.test.ts`
Expected before implementation: FAIL. Expected after implementation: PASS plus kubeconform and policy checks.

- [ ] **Step 3: Commit**

`git commit -m "feat: add Praxis Pro Kubernetes output"`

### Task 8: Terraform for AWS, Azure, and GCP

**Files:**
- Create: `templates/pro.terraform.shared/**`
- Create: `templates/pro.terraform.aws/**`
- Create: `templates/pro.terraform.azure/**`
- Create: `templates/pro.terraform.gcp/**`
- Create: `tests/generator/proTerraform.test.ts`

- [ ] **Step 1: Write failing cloud resource matrices**

Assert networking, managed Kubernetes, PostgreSQL, registry, identities, secrets, ingress/TLS/WAF/CDN/DNS, observability, optional cache/storage/search, remote-state examples, budgets, encryption, deletion protection, and absence for unselected capabilities.

- [ ] **Step 2: Verify RED and implement one cloud at a time**

For each cloud, run focused generation tests, `terraform fmt -check`, `terraform init -backend=false`, `terraform validate`, TFLint, and Checkov before proceeding to the next.

- [ ] **Step 3: Commit per cloud**

Use `feat(pro): add <cloud> Terraform output`.

### Task 9: Documentation and end-to-end release matrix

**Files:**
- Create: `tests/generator/proMatrix.test.ts`
- Create: `tests/generator/proRuntime.test.ts`
- Create: `tests/generator/proInfrastructure.test.ts`
- Modify: `README.md`
- Modify: `package.json`

- [ ] **Step 1: Add failing release-contract tests**

Cover minimal, recommended, and maximal-compatible output for both stacks; each capability individually; all three clouds; configuration round trips; unselected-feature absence; and packaged-template presence.

- [ ] **Step 2: Run and fix the full verification matrix**

Run root tests/build/audit, generated Django and Go checks, Compose validation/build/runtime probes, Kubernetes validation, all Terraform validators, secret scanning, image scanning, and SBOM creation.

- [ ] **Step 3: Perform the completion audit**

Map every section of `docs/superpowers/specs/2026-08-19-praxis-pro-composable-backend-design.md` to direct code, generated artifacts, and passing verification evidence. Treat missing evidence as incomplete work.

- [ ] **Step 4: Commit**

`git commit -m "docs: release composable Praxis Pro"`
