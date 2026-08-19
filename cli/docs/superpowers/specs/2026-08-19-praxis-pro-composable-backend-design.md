# Praxis Pro Composable Production Backend Design

## Purpose

Praxis Pro will be an opinionated, production-grade backend generator inside the existing `praxiflow` CLI. It will not be a fixed repository snapshot. A user first chooses Python with Django/DRF or Go with Gin, then selects production capabilities rather than competing tools. Each capability resolves to a stack-specific Praxis default.

Terraform is the deliberate exception: selecting infrastructure asks for AWS, Azure, or GCP because the target cloud changes generated resources and operations. The current `origin/pro` branch is reference material, not a generation source. All Pro modules are bundled and versioned with Praxis Flow for deterministic offline composition.

## User experience

The common flow remains:

1. Praxis splash
2. Project name
3. Project type

Project type gains `Production Backend (Pro)`. Selecting it asks:

1. Backend stack: Python + Django/DRF or Go + Gin
2. Authentication capabilities
3. Application capabilities
4. Observability capabilities
5. Reliability and security capabilities
6. Deployment capabilities
7. Cloud provider when Terraform is selected
8. Install dependencies and initialize Git

Capabilities use multiselect prompts. Users do not select competing vendors inside a capability. Selecting error monitoring means Sentry; selecting tracing means OpenTelemetry. The chosen application stack determines the adapter.

The recommended optional set is preselected but fully deselectable:

- Sentry error monitoring
- Redis caching
- background jobs
- Prometheus metrics
- OpenTelemetry tracing
- cloud secrets
- autoscaling
- high availability
- edge protection
- database resilience
- Nginx reverse proxy

Terraform selection implies Kubernetes, autoscaling, high availability, edge protection, cloud secrets, and database resilience. The prompt explains these implications before generation.

## Always-included production core

Every Pro project includes:

- a pinned, supported application stack and dependency toolchain;
- PostgreSQL with pooling and migrations;
- development, test, and production configuration;
- validated environment configuration with `.env.example` and no generated secrets;
- a production HTTP server with timeouts, body limits, trusted-proxy rules, CORS, and security headers;
- structured JSON logging with correlation IDs and security audit events;
- liveness, readiness, and startup endpoints;
- graceful startup rollback and idempotent shutdown;
- OpenAPI schema and interactive documentation;
- consistent errors, pagination, filtering, and API versioning foundations;
- idempotency-key and distributed-locking interfaces;
- a non-root multi-stage container and Docker Compose development environment;
- unit and integration tests with containerized dependencies;
- stack-specific formatting, linting, static analysis, migration, and security checks;
- CI with Gitleaks, Trivy, Checkov, and Syft security/SBOM gates;
- backup, restore, rollback, and operations documentation.

## Application stack profiles

The stack is an explicit required selection. Capability names and operational contracts remain common, while application code and dependencies are stack-specific.

### Python + Django/DRF

- Python and Django pinned to supported releases at Praxis release time
- Django REST Framework
- PDM dependency and script management
- psycopg connection pooling
- Django migrations
- Gunicorn with an ASGI-capable application
- pytest, pytest-django, factory-boy, and Testcontainers
- Ruff, mypy, Bandit, and pip-audit

### Go + Gin

- Go pinned to a supported release at Praxis release time
- Gin, initially pinned to `v1.12.0`
- Go modules
- pgx and sqlc for PostgreSQL
- golang-migrate for versioned migrations
- go-playground/validator for request validation
- `log/slog` for structured logging
- oapi-codegen for contract-first OpenAPI handlers and models
- Testify and testcontainers-go
- golangci-lint, govulncheck, and gosec

Gin is the Praxis opinionated Go default. Its pinned version is reviewed during each Praxis release and never silently floats during generation.

## Optional capability catalog

### Authentication and access

- JWT authentication with rotation and revocation
- social authentication with Google and GitHub examples
- fine-grained authorization foundation

### Application services

- Redis caching
- Redis-backed background jobs with retry and idempotency examples
- scheduled jobs; implies background jobs
- asynchronous email; implies background jobs
- cloud object storage abstraction
- Elasticsearch search with health and index commands
- realtime WebSockets with Redis fan-out; implies Redis
- Kafka producer/consumer foundation with schema/versioning examples
- feature flags with safe fallbacks
- development-only seed data

### Observability and operations

- Sentry error monitoring
- Prometheus metrics and alert rules
- OpenTelemetry application, database, cache, HTTP, and worker instrumentation with OTLP export
- ELK log aggregation for local/self-managed operation
- Prometheus Blackbox Exporter synthetic checks
- reproducible load and capacity tests
- compliance audit controls with redaction, actor/resource metadata, retention, and immutable-export interfaces

Structured logging remains core when no optional observability capability is selected.

### Deployment and reliability

- Nginx reverse proxy
- Kubernetes manifests
- Terraform-managed infrastructure
- Horizontal Pod Autoscaler and managed node autoscaling
- multiple replicas, topology spread, anti-affinity, rolling updates, and PodDisruptionBudget
- managed TLS, load balancer, WAF, and CDN edge protection
- PostgreSQL backups, point-in-time recovery, encryption, deletion protection, and maintenance settings
- optional multi-region disaster recovery and a documented failover procedure

## Capability implementation parity

Users select a capability once. Praxis resolves its implementation from the chosen stack.

| Capability | Django/DRF default | Go/Gin default |
|---|---|---|
| JWT authentication | SimpleJWT | golang-jwt/jwt |
| Social authentication | django-allauth | Goth |
| Fine-grained authorization | DRF permissions | Casbin |
| Redis caching | django-redis | go-redis |
| Background jobs | Celery | Asynq |
| Scheduled jobs | Celery Beat | Asynq Scheduler |
| Object storage | django-storages | cloud SDK storage adapter |
| Search | django-elasticsearch-dsl | official Elasticsearch Go client |
| Realtime | Django Channels | coder/websocket |
| Kafka | confluent-kafka-python | franz-go |
| Feature flags | django-waffle | OpenFeature Go SDK |
| Error monitoring | sentry-sdk | sentry-go |
| Metrics | django-prometheus | prometheus/client_golang |
| Tracing | OpenTelemetry Python | OpenTelemetry Go |
| Structured logging | Python JSON logging | slog JSON handler |
| Load testing | Locust | k6 |

The resolver rejects a requested capability if its adapter is unavailable. Praxis never emits placeholders or silently removes a selection.

## Terraform and cloud mapping

Terraform always targets managed Kubernetes and emits only resources required by resolved selections. Application stack affects image, command, port, and probe rendering, not the cloud architecture.

### AWS

- multi-AZ VPC and private/public subnets
- EKS and managed node groups
- RDS PostgreSQL
- ElastiCache when Redis is required
- S3 when object storage is selected
- Elasticsearch on EKS through ECK when search is selected
- Secrets Manager
- ECR, ALB, ACM, WAF, CloudFront, and Route 53 integration
- CloudWatch and OTLP integration when selected

### Azure

- Virtual Network and segmented subnets
- AKS and managed node pools
- Azure Database for PostgreSQL
- Azure Managed Redis when Redis is required
- Blob Storage when object storage is selected
- Elasticsearch on AKS through ECK when search is selected
- Key Vault
- Azure Container Registry, Application Gateway, certificates, WAF, Front Door, and DNS integration
- Azure Monitor and OTLP integration when selected

### GCP

- VPC and regional subnets
- GKE and managed node pools
- Cloud SQL for PostgreSQL
- Memorystore when Redis is required
- Cloud Storage when object storage is selected
- Elasticsearch on GKE through ECK when search is selected
- Secret Manager
- Artifact Registry, external load balancer, Certificate Manager, Cloud Armor, Cloud CDN, and Cloud DNS
- Cloud Monitoring and OTLP integration when selected

Terraform includes remote encrypted state configuration, provider/module constraints, least-privilege identities, encryption, tags/labels, budgets, and variable validation. Generated infrastructure must format, initialize without a remote backend, validate, lint, and pass security scanning without live cloud credentials.

## Configuration model

`PraxisConfig` gains a dedicated Pro section:

```json
{
  "schemaVersion": 2,
  "name": "payments-api",
  "projectType": "pro-backend",
  "pro": {
    "stack": "go-gin",
    "capabilities": [
      "jwt-auth",
      "redis-cache",
      "background-jobs",
      "sentry",
      "prometheus",
      "opentelemetry",
      "terraform"
    ],
    "cloud": "aws"
  },
  "installDependencies": true,
  "initializeGit": true
}
```

`pro.stack` accepts `python-django` or `go-gin`. Toolchains are implied: PDM for Django and Go modules for Gin. `cloud` is required with Terraform and forbidden otherwise. Validation resolves implications, rejects unknown or incompatible combinations, and records requested and resolved capabilities for explainability. Existing schema-version-1 JavaScript/TypeScript configurations continue to load unchanged.

## Module architecture

Modules have three layers:

- shared capability contracts;
- Django and Go application adapters;
- shared Docker, Kubernetes, Terraform, documentation, and verification modules.

Each module can contribute overlays, structured patches, dependencies, commands, routes, middleware, workers, migrations, environment keys, services, infrastructure resources, tests, and documentation. Infrastructure consumes resolved contracts instead of application-language details. Kubernetes workload values are rendered from the selected stack profile.

Composition validates selectors and adapters, resolves implications, copies overlays, applies structured patches, merges stack metadata, emits environment and infrastructure files, validates the output, and atomically renames staging. Modules cannot write outside staging. Conflicting files, dependencies, environment keys, routes, or Terraform resource names fail with the responsible module identified.

Optional modules must leave no dead imports, routes, services, environment requirements, or Docker dependencies when absent. Application boundaries use Django apps or Go `internal` packages.

## Runtime and security standards

- Secrets come from environment variables or the selected cloud secret manager and are never committed.
- Django production rejects weak secrets and `DEBUG=True`; Go rejects development mode and unsafe proxy configuration.
- Authentication endpoints are throttled and security events audited.
- Logs and telemetry redact credentials, tokens, cookies, and configured personal fields.
- Containers run non-root and include read-only filesystem guidance, health checks, constraints, and graceful termination.
- Kubernetes includes distinct probes, requests/limits, network policies, autoscaling, disruption budgets, topology spread, and service accounts.
- Terraform uses encrypted remote state, locking where supported, least privilege, encryption, and deletion protection without plaintext secrets.
- Jobs are idempotent, use bounded exponential backoff, and expose failure/dead-letter operations.
- Database changes include zero-downtime migration guidance, backups, restoration verification, and rollback procedures.

## Generated documentation

Every project documents local setup, selected/implied capabilities, API and worker operation, Docker/Kubernetes workflows, Terraform state setup, deployment, migrations, rollback, backup/restore, disaster recovery, secret rotation, scaling, cost-sensitive defaults, troubleshooting, and a production-readiness checklist.

## Verification strategy

### Generator tests

- minimal, recommended, and maximal-compatible projects for both stacks
- every capability against both adapters
- implication resolution and rejected combinations
- deterministic configuration round trips
- atomic cleanup and path confinement
- absence tests for unselected features

### Generated-project tests

- Django: Ruff, mypy, Bandit, pip-audit, migration checks, pytest, and `manage.py check --deploy`
- Go: formatting, vet, golangci-lint, govulncheck, gosec, sqlc validation, migration checks, and race-enabled tests
- both: container builds, Compose validation, dependency failure health behavior, authentication, throttling, redaction, retries, shutdown, and telemetry smoke tests
- both: dependency/container audits, SBOM creation, and secret scanning

### Infrastructure matrix

For AWS, Azure, and GCP:

- minimal, recommended, and maximal-compatible selections for both stacks
- `terraform fmt -check`, `terraform init -backend=false`, `terraform validate`, TFLint, and Checkov
- Kubernetes schema/policy checks, Compose validation, and container builds
- assertions that unselected resources are absent

Pull-request CI runs representative projects for both stacks plus focused tests for every adapter. Release CI expands to the complete stack/cloud matrix. This bounds routine feedback without allowing a stack or cloud to drift.

## Delivery sequence

1. Add the shared Pro schema, stack prompt, resolver, help, and config-file support.
2. Build and verify the Django/DRF core.
3. Build and verify the equivalent Go/Gin core.
4. Convert features into shared contracts with Django and Go adapters.
5. Add security, observability, reliability, and operations adapters with parity tests.
6. Add shared Kubernetes composition with stack-specific workload rendering.
7. Add shared Terraform abstractions and AWS.
8. Add Azure and GCP parity.
9. Add generated-project and infrastructure matrices across both stacks.
10. Update package contents, documentation, migration guidance, and release checks.

Each phase must keep existing Praxis Flow generation green and produce a usable, verified Pro subset. A phase is not complete merely because manifests compose; generated output must build and pass its runtime and infrastructure validation.
