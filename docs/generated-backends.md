# How generated backend code ties together

This page traces runtime relationships inside generated outputs. Praxis itself is not present at runtime.

## Standard Express backend

```mermaid
flowchart TD
    Entry[src/index] --> App[Express application]
    App --> Health[health/readiness routes]
    App --> API[application routes]
    API --> DB[optional database module]
    API --> Auth[optional auth middleware/client]
    API --> Cache[optional cache client]
    Entry --> Startup[connect dependencies]
    Entry --> Shutdown[signal handlers]
    Startup --> Listen[HTTP listen]
    Shutdown --> Close[close server/cache/database]
```

The base backend owns process lifecycle. Database/cache modules patch imports, startup readiness, example routes, and shutdown hooks into stable anchors. Authentication adds middleware/client setup appropriate to self-hosted, Clerk, or Supabase. Docker adds matching services and internal environment URLs.

Important invariant: dependency readiness occurs before the server announces readiness; shutdown stops accepting traffic before closing shared clients.

## Django/DRF Pro backend

```mermaid
flowchart TD
    Manage[manage.py / ASGI] --> Settings[config.settings]
    Settings --> Env[environment variables]
    Settings --> Apps[Django applications]
    Apps --> API[DRF URLs/views]
    API --> Domain[core services/models]
    Domain --> PG[(PostgreSQL)]
    API --> MW[auth/authorization/telemetry middleware]
    Celery[optional Celery worker] --> Tasks[task modules]
    Tasks --> Domain
    Beat[optional Celery beat] --> Tasks
    Celery --> Redis[(Redis broker/cache)]
    Compose[Docker Compose] --> API
    Compose --> PG
    Compose --> Celery
    Compose --> Redis
```

`pro.django` establishes project settings, URL routing, database configuration, migrations, health behavior, container files, and tests. Capability overlays add focused modules under the generated `core`/configuration packages. `pro.compose` adds only services required by resolved capabilities and wires them with health-conditioned dependencies.

Example request path with JWT and fine-grained authorization:

1. ASGI/Uvicorn receives the request.
2. Django middleware establishes request context and telemetry.
3. JWT authentication validates the token and creates an authenticated principal.
4. authorization policy evaluates the principal/resource/action.
5. the DRF view invokes domain/service code.
6. ORM work is committed/rolled back by Django transaction semantics.
7. audit/telemetry hooks record the outcome when selected.

## Go/Gin Pro backend

```mermaid
flowchart TD
    Main[cmd/api main] --> Config[configuration]
    Main --> DB[database pool/migrations]
    Main --> Router[Gin router]
    Router --> Middleware[middleware chain]
    Middleware --> Handlers[HTTP handlers]
    Handlers --> Services[domain services]
    Services --> Queries[query/repository layer]
    Queries --> PG[(PostgreSQL)]
    Main --> Signals[graceful shutdown]
    Worker[optional cmd/worker] --> Jobs[job services]
    Scheduler[optional scheduler] --> Jobs
    Jobs --> Redis[(Redis)]
```

`pro.gin` provides explicit constructor wiring in the API entry point. Capability patches add imports, clients, middleware, routes, and shutdown closers at named anchors. This is compile-time wiring: generated Go code directly owns the selected integrations; there is no plugin loader at runtime.

Example request path:

1. `cmd/api` loads validated environment configuration and dependencies.
2. Gin routes the request through recovery, request ID, logging, and selected auth/telemetry middleware.
3. a handler validates HTTP input and calls a service.
4. the service applies domain policy and calls typed database/integration interfaces.
5. the handler maps the result to an HTTP response.
6. signal handling drains the server before closing clients/pools.

## Infrastructure joins the application

```mermaid
flowchart LR
    Code[Generated application code] --> Image[Container image]
    Compose[Docker Compose] --> Image
    K8s[Kubernetes manifests] --> Image
    Terraform[Terraform] --> Cluster[Cloud cluster/services]
    Terraform --> Registry[Image registry]
    K8s --> Cluster
    K8s --> Managed[managed database/cache/secrets endpoints]
    Image --> Managed
```

Compose is developer/local production-shape wiring. Kubernetes expresses workload-level concerns. Terraform creates selected cloud foundations and managed services. They are related outputs but separate lifecycle tools; Terraform does not execute application migrations, and application code does not create cloud resources.

## Finding the exact generated file

1. Read `praxis.config.json` in the output.
2. Reproduce `resolveModules(config)` using [`cli/src/config/resolver.ts`](../cli/src/config/resolver.ts).
3. For each selected module, inspect matching entries in its `manifest.json`.
4. Follow the overlay `source` and output `scope`.
5. Search patches for the target file/anchor.
6. Confirm with the relevant generator test rather than relying on filenames alone.

Useful tests: [`cli/tests/generator/lifecycle.test.ts`](../cli/tests/generator/lifecycle.test.ts), [`cli/tests/generator/proRuntime.test.ts`](../cli/tests/generator/proRuntime.test.ts), and [`cli/tests/generator/proCapabilities.test.ts`](../cli/tests/generator/proCapabilities.test.ts).

