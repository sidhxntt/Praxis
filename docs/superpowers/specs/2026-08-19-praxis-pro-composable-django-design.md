# Praxis Pro Composable Django Backend Design

## Purpose

Praxis Pro will become an opinionated, production-grade Django backend generator inside the existing `praxiflow` CLI. It will no longer be a fixed repository snapshot. Users select production capabilities, not competing tools; each capability resolves to a maintained Praxis default. Terraform is the deliberate exception: selecting infrastructure asks the user to choose AWS, Azure, or GCP because the target cloud changes the generated resources and operating model.

The current `origin/pro` branch is reference material, not the generation mechanism. Pro modules will be versioned and bundled with Praxis Flow so generation is deterministic, testable, and available without cloning another branch.

## User experience

The existing flow remains:

1. Praxis splash
2. Project name
3. Project type

Project type gains `Production Django Backend (Pro)`. Choosing it starts a Pro-specific questionnaire:

1. Python/package settings
2. Authentication capabilities
3. Application capabilities
4. Observability capabilities
5. Reliability and security capabilities
6. Deployment capabilities
7. Terraform cloud provider when Terraform is selected
8. Install dependencies and initialize Git

Capabilities use multiselect prompts. Users do not choose vendors within a capability. For example, selecting error monitoring installs Sentry, and selecting distributed tracing installs OpenTelemetry.

The recommended optional set is preselected but fully deselectable:

- Sentry error monitoring
- Redis caching
- Celery background jobs
- Prometheus metrics
- OpenTelemetry tracing
- cloud secrets integration
- autoscaling
- high availability
- edge protection
- database resilience
- Nginx reverse proxy

Terraform selection automatically enables Kubernetes, autoscaling, high availability, edge protection, cloud secrets, and database resilience. The CLI explains these implied selections before generation.

## Always-included production core

Every Pro project includes:

- supported Python and Django versions;
- Django REST Framework;
- PostgreSQL configuration;
- split development/test/production settings;
- validated environment configuration with `.env.example` and no generated secrets;
- Gunicorn production server and ASGI readiness;
- secure production settings for HTTPS, cookies, hosts, CSRF, CORS, and security headers;
- request-size limits and DRF throttling defaults;
- database connection pooling and migration commands;
- structured JSON application logs with request/correlation IDs;
- security-sensitive audit events;
- liveness, readiness, and startup endpoints;
- graceful process shutdown;
- OpenAPI schema and interactive API documentation;
- consistent error response and exception handling;
- pagination, filtering, and API versioning foundations;
- idempotency-key and distributed-locking interfaces;
- non-root multi-stage container image;
- Docker Compose development environment;
- pytest unit/integration foundation with factories;
- linting, formatting, static typing, migration checks, and `manage.py check --deploy`;
- CI with Ruff, mypy, Bandit, pip-audit, Gitleaks, Trivy, Checkov, and Syft security/SBOM gates;
- backup/restore runbook and operational documentation.

## Optional capability catalog

### Authentication and access

- JWT authentication: SimpleJWT with rotation and revocation.
- Social authentication: django-allauth with Google and GitHub examples.
- Fine-grained authorization: object-level permission foundation.

### Application services

- Caching: Redis through django-redis.
- Background jobs: Celery using Redis, including retry/idempotency examples.
- Scheduled jobs: Celery Beat; selecting it implies background jobs.
- Email tasks: asynchronous production email example; implies background jobs.
- Object storage: django-storages and the chosen cloud’s object store when Terraform is enabled.
- Search: Elasticsearch integration with health checks and index commands.
- Realtime: Django Channels with Redis channel layer; implies Redis.
- Event streaming: Kafka producer/consumer foundation with schema/versioning examples.
- Feature flags: django-waffle with safe fallback behavior.
- Seed/demo data: explicitly development-only fixtures and commands.

### Observability and operations

- Error monitoring: Sentry.
- Metrics: Prometheus Django instrumentation and alert-rule examples.
- Distributed tracing: OpenTelemetry Django, database, Redis, HTTP, and Celery instrumentation with OTLP export.
- Log aggregation: ELK stack for local/self-managed operation.
- Synthetic uptime checks: Prometheus Blackbox Exporter definitions.
- Load testing: reproducible Locust API smoke and capacity scenarios.
- Compliance audit controls: configurable retention, redaction, actor/resource metadata, and immutable-export interface.

Structured logging remains in the core even when no optional observability capability is selected.

### Deployment and reliability

- Nginx reverse proxy.
- Kubernetes manifests.
- Terraform-managed infrastructure.
- Horizontal Pod Autoscaler and managed node autoscaling.
- Multiple replicas, topology spreading, anti-affinity, rolling updates, and PodDisruptionBudget.
- Cloud load balancer, managed TLS, WAF, and CDN edge protection.
- Automated PostgreSQL backups, point-in-time recovery, encryption, deletion protection, and maintenance settings.
- Optional multi-region disaster-recovery topology and documented failover procedure.

## Terraform and cloud mapping

Selecting Terraform requires one cloud provider and automatically enables Kubernetes.

### AWS

- VPC with public/private subnets across availability zones
- EKS and managed node groups
- RDS PostgreSQL
- ElastiCache Redis when a Redis-dependent capability is selected
- S3 when object storage is selected
- Elasticsearch on EKS through ECK when search is selected
- Secrets Manager
- ECR, ALB, ACM, WAF, CloudFront, Route 53 integration
- CloudWatch/OTLP integration where selected

### Azure

- Virtual Network and segmented subnets
- AKS and managed node pools
- Azure Database for PostgreSQL
- Azure Cache for Redis when required
- Blob Storage when selected
- Elasticsearch on AKS through ECK when search is selected
- Key Vault
- Azure Container Registry, Application Gateway/Load Balancer, certificates, WAF, Front Door, and DNS integration
- Azure Monitor/OTLP integration where selected

### GCP

- VPC and regional subnets
- GKE and managed node pools
- Cloud SQL for PostgreSQL
- Memorystore when Redis is required
- Cloud Storage when selected
- Elasticsearch on GKE through ECK when search is selected
- Secret Manager
- Artifact Registry, external load balancer, Certificate Manager, Cloud Armor, Cloud CDN, and Cloud DNS integration
- Cloud Monitoring/OTLP integration where selected

Terraform emits only resources required by resolved selections. State backend configuration, provider constraints, module version constraints, least-privilege identities, encryption, tagging/labels, budgets, and variable validation are included. Generated infrastructure passes formatting, initialization, validation, linting, and security scanning without requiring live cloud credentials.

## Configuration model

`PraxisConfig` gains a Pro project type with a dedicated section rather than overloading the JavaScript backend shape. Conceptually:

```json
{
  "schemaVersion": 2,
  "name": "payments-api",
  "projectType": "pro-backend",
  "pro": {
    "capabilities": [
      "jwt-auth",
      "redis-cache",
      "celery",
      "sentry",
      "prometheus",
      "opentelemetry",
      "terraform"
    ],
    "cloud": "aws"
  },
  "packageManager": "pdm",
  "installDependencies": true,
  "initializeGit": true
}
```

The final schema will use stable string identifiers and deterministic ordering. `cloud` is required only with Terraform and forbidden otherwise. Configuration validation resolves implied capabilities, rejects unknown or incompatible combinations, and records both requested and resolved selections so automation is explainable.

Existing schema-version-1 JavaScript/TypeScript configurations continue to load unchanged. Pro introduces schema version 2 without changing existing generated-project behavior.

## Module architecture

Each Pro capability is a bundled manifest module with explicit contributions:

- file overlays;
- Python dependencies and PDM scripts;
- Django settings, URLs, middleware, and installed apps;
- environment keys;
- Docker services;
- Kubernetes resources;
- Terraform modules/resources;
- tests and documentation.

Composition is multi-phase: validate manifests and selectors, copy overlays, apply structured patches, merge Python metadata/settings, emit environment files, validate the resolved tree, and atomically rename staging output. Modules cannot write outside staging. Conflicting files, settings, dependencies, environment keys, or Terraform resource names fail generation with the responsible module identified.

Core and feature code is separated by bounded Django apps and settings fragments. Optional modules must not leave dead imports, URLs, services, environment requirements, or Docker dependencies when absent.

## Runtime and security standards

- Secrets are read from environment variables or the selected cloud secret manager and never committed.
- Production refuses weak/missing secrets and `DEBUG=True`.
- Authentication endpoints are throttled and security events are audited.
- Logs and telemetry redact credentials, tokens, cookies, and configured personal fields.
- Containers run as a non-root user with read-only filesystem guidance, health checks, resource constraints, and graceful termination.
- Kubernetes includes separate liveness/readiness/startup probes, resource requests/limits, network policies, autoscaling, disruption budgets, topology spreading, and service accounts.
- Terraform uses remote encrypted state configuration, locking where supported, least privilege, encryption at rest/in transit, deletion protection, and no plaintext secrets.
- Background-job examples are idempotent, retry with bounded exponential backoff, and expose failure/dead-letter operations.
- Database changes include migration checks, zero-downtime guidance, backups, restoration verification, and rollback procedures.

## Generated documentation

Every project documents:

- local setup and environment variables;
- selected and implied capabilities;
- API, worker, scheduler, cache, search, and telemetry operation;
- Docker and Kubernetes workflows;
- cloud prerequisites and Terraform state setup;
- deployment, migration, rollback, backup, restore, and disaster recovery;
- security assumptions and secret rotation;
- scaling and cost-sensitive defaults;
- troubleshooting and production-readiness checklist.

## Verification strategy

### Generator tests

- minimal Pro project;
- recommended defaults;
- every capability individually;
- dependency/implied-capability resolution;
- rejected invalid combinations;
- deterministic config round-trip;
- atomic cleanup and path confinement;
- absence tests proving unselected features leave no artifacts.

### Generated-project tests

- Python formatting, linting, typing, Django checks, migration checks, and pytest;
- `manage.py check --deploy` against production settings;
- Docker builds and Compose validation;
- health/readiness behavior with dependencies available/unavailable;
- authentication, throttling, audit redaction, task retry, graceful shutdown, and telemetry smoke tests;
- dependency and container vulnerability audits;
- SBOM generation and secret scanning.

### Infrastructure matrix

For AWS, Azure, and GCP:

- minimal Terraform/Kubernetes selection;
- recommended selection;
- maximal compatible selection;
- `terraform fmt -check`, `terraform init -backend=false`, `terraform validate`, TFLint, and Checkov/tfsec-equivalent scanning;
- Kubernetes schema validation, policy checks, Compose validation, and container build;
- assertions that unselected resources are absent.

CI uses bounded representative matrices on every pull request and a complete capability/cloud matrix on release workflows.

## Delivery sequence

1. Introduce Pro schema, resolver, prompts, help, and config-file support.
2. Build and verify the always-included Django production core.
3. Convert existing Pro features into isolated capability modules.
4. Add missing security, observability, reliability, and operations modules.
5. Add Kubernetes composition.
6. Add shared Terraform abstractions and AWS implementation.
7. Add Azure and GCP parity.
8. Add generated-project and infrastructure verification matrices.
9. Update documentation, package contents, migration guidance, and release checks.

Each phase must leave existing Praxis Flow generation green and produce a usable, verified Pro subset. No phase is considered complete solely because manifests compose; generated output must build and pass the relevant runtime/infrastructure validation.
