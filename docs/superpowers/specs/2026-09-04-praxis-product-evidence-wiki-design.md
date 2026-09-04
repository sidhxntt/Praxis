# Praxis and Praxis Pro evidence Wiki design

## Goal

Make the Praxis GitHub Wiki a defensible companion to the two project entries
in the résumé. Readers can open **Praxis** or **Praxis Pro** and find a
self-contained product path that explains the product, its feature-by-feature
engineering challenges, authoritative implementation sources, tests, and the
evidence needed to substantiate the reported outcomes.

## Scope and navigation

GitHub Wiki has one flat page repository, so it cannot host a repository inside
another repository. The rendered Wiki will instead provide two product entry
points:

1. **Praxis Flow** — a new `Praxis-Engineering-Evidence` page for the CLI and
   standard-project generator.
2. **Praxis Pro** — the existing `Praxis-Pro` page becomes a Pro-specific home
   with a local navigation list and a new `Praxis-Pro-Engineering-Evidence`
   page.

The global sidebar will expose both entry points before lower-level architecture
pages. The Pro home links only to the Pro capability, Django, Gin, Compose,
Kubernetes, Terraform, generated-backend, and Pro-evidence pages, so a reader
can use it as a focused Wiki-within-the-Wiki.

## Evidence model

Each product-evidence page uses the same ledger row shape:

| Field | Meaning |
| --- | --- |
| Résumé statement | Exact relevant claim from the résumé. |
| Product and engineering evidence | Concrete generator behavior, architecture constraint, and source/manifests that implement it. |
| Automated verification | Existing contract, configuration, generation, or runtime test that verifies the generated behavior. |
| Outcome-measurement evidence | The reproducible data required to justify an outcome number. |
| Evidence status | `implementation verified` for repository-backed behavior; `measurement record required` for an outcome with no checked-in measurement artifact. |

The pages never translate availability of a template into a promised throughput,
latency, uptime, productivity, scalability, onboarding, or observability
improvement. Such claims remain visible exactly as résumé-reported outcomes,
but are explicitly marked `measurement record required` until an owner adds a
dated methodology, environment/configuration, sample population or workload,
raw results, and calculation.

## Praxis Flow coverage

The Praxis Flow ledger covers the exact résumé statement: “Saved 20+ dev hours
per project and accelerated SaaS prototyping by 70% by building a CLI
scaffolding tool that generates modular Next.js/Vite.js + Node.js (Express)
apps in JS/TS — preconfigured with PostgreSQL/MongoDB, Prisma ORM, JWT Auth,
Redis, BullMQ, Dockerized Prometheus/Grafana monitoring, and prebuilt
Auth/CRUD/OAuth/LemonSqueezy routes; delivering ~1,500 QPS, <200ms latency, and
99.95% reliability with 80% less boilerplate.”

Its engineering rows cover questionnaire/configuration validation, deterministic
module/manifest/overlay composition, standard framework and language support,
data/auth/cache/job/observability capability wiring, deployment topology, and
atomic generated-project creation. The output and contract tests identify what
is generated; benchmark logs, a load profile, deployment SLO data, and a
before/after study are required for the numerical claims.

## Praxis Pro coverage

The Praxis Pro ledger covers the exact résumé statement: “Reduced backend
setup by 50%, onboarding by 35%, and manual infra setup by 80% by building an
enterprise-grade Django REST Framework boilerplate with built-in ORM, JWT auth,
Gunicorn + Nginx containerization, and Redoc/Swagger docs; automated Kubernetes
orchestration (Pods, Ingress, Services via Kubectl/Minikube) boosting
scalability by 40%, and bash-scripted ELK stack (Elasticsearch, Logstash,
Kibana) + Sentry integration improving observability by 60%.”

Its engineering rows cover Pro schema/capability closure, Django and Gin
selection, framework-native runtime wiring, authentication, containers and
traffic controls, generated API documentation, Kubernetes resources, ELK/Sentry
observability modules, and separate Compose/Kubernetes/Terraform lifecycle
boundaries. Time studies, onboarding cohorts, infrastructure task records,
capacity/load experiment outputs, and incident-detection/diagnosis data are
required before the numerical outcomes can be considered verified.

## Rendering and publication

The new source pages are registered in `scripts/render-github-wiki.mjs`, named
in `docs/wiki-publishing.md`, linked from `docs/_Sidebar.md`, and included in
the explicit Wiki publication allowlist in `.github/workflows/wiki.yml`.
`docs/praxis-pro.md` gains the Pro-only navigation and links to the evidence
page. `README.md` links to both evidence paths.

The existing documentation contract test is extended first to prove the
renderer, sidebar, and publication workflow include both pages. The expected
failure precedes the renderer/workflow/sidebar implementation. Documentation
links and the renderer then validate the generated Wiki pages.

## Failure handling

- A missing source, test, manifest, or resolver link makes the implementation
  evidence incomplete; the claim stays out of the verified column.
- A missing benchmark or study never becomes an inferred metric; it remains
  `measurement record required`.
- A failed Wiki contract or link check blocks publication.
- Generated application behavior stays distinct from customer deployment
  outcomes, which depend on selected capabilities and operator-owned runtime
  configuration.

## Verification

1. Add the Wiki-registration test and observe it fail before registration.
2. Implement the page map, sidebar, publication allowlist, and links.
3. Run `npm run docs:check` and inspect rendered `Praxis-Engineering-Evidence`,
   `Praxis-Pro`, and `Praxis-Pro-Engineering-Evidence` pages.
4. Run the targeted docs test and the CLI generator test suites that the
   evidence pages cite.
5. Verify the final diff and push the isolated branch.
