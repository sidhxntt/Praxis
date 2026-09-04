# Praxis Flow engineering evidence

This is the evidence ledger for the Praxis Flow project entry. It separates
what the current generator and its tests demonstrate from outcomes that need a
dated measurement record. A generated project is independent of Praxis at
runtime; its selected configuration, deployment, workload, and operator
practice determine its production behavior.

## Résumé statement

> Saved 20+ dev hours per project and accelerated SaaS prototyping by 70% by
> building a CLI scaffolding tool that generates modular Next.js/Vite.js +
> Node.js (Express) apps in JS/TS — preconfigured with PostgreSQL/MongoDB,
> Prisma ORM, JWT Auth, Redis, BullMQ, Dockerized Prometheus/Grafana
> monitoring, and prebuilt Auth/CRUD/OAuth/LemonSqueezy routes; delivering
> ~1,500 QPS, <200ms latency, and 99.95% reliability with 80% less boilerplate.

The Peerlist Top 50 and Product Hunt Top 100 rankings shown alongside this
statement are external outcome claims. Preserve the dated public ranking URL,
export, or screenshot that identifies the product and rank before describing
either as verified.

## Implementation evidence

| Product area | Engineering challenge and implemented boundary | Authoritative implementation | Automated evidence | Status |
| --- | --- | --- | --- | --- |
| One CLI for many project shapes | Validate explicit project intent before generation, so an unsupported framework/language/integration combination never becomes a partly generated project. | [`schema.ts`](../cli/src/config/schema.ts), [`run.ts`](../cli/src/cli/run.ts) | [`config` tests](../cli/tests/config/), [`workflow` tests](../cli/tests/workflow/) | implementation verified |
| Modular frontend and Express output | Select only the frontend, backend, database, auth, cache, deployment, and UI modules named by the resolved configuration. | [`resolver.ts`](../cli/src/config/resolver.ts), [`frontend.next`](../cli/templates/frontend.next/), [`frontend.vite`](../cli/templates/frontend.vite/), [`backend.express`](../cli/templates/backend.express/) | [`matrix.test.ts`](../cli/tests/generator/matrix.test.ts) | implementation verified |
| PostgreSQL/MongoDB, Prisma, JWT, and Redis | Keep data/auth/cache contributions conditional and scoped to the selected output, rather than coupling every generated project to every service. | [`database.postgres`](../cli/templates/database.postgres/), [`database.mongo`](../cli/templates/database.mongo/), [`auth.self-hosted`](../cli/templates/auth.self-hosted/), [`cache.redis`](../cli/templates/cache.redis/) | [`matrix.test.ts`](../cli/tests/generator/matrix.test.ts), [`lifecycle.test.ts`](../cli/tests/generator/lifecycle.test.ts) | implementation verified for the selected modules |
| Docker and operational lifecycle | Make containers, internal service URLs, readiness, and shutdown agree with the selected generated services. | [`deployment.docker`](../cli/templates/deployment.docker/), [`compose.ts`](../cli/src/composer/compose.ts) | [`lifecycle.test.ts`](../cli/tests/generator/lifecycle.test.ts), [`matrix.test.ts`](../cli/tests/generator/matrix.test.ts) | implementation verified for selected Docker modules |
| Reproducible source generation | Apply manifests, overlays, packages, environment contributions, and patches in deterministic order; publish only a fully composed project. | [`compose.ts`](../cli/src/composer/compose.ts), [`manifest system`](manifest-system.md) | [`generator` tests](../cli/tests/generator/) | implementation verified |

## Claim reconciliation

The current repository is the authority for the following scope check. “Not
verified by current main” does not mean the idea is invalid; it means this Wiki
cannot use it as proof of the stated generator behavior without the matching
source revision, generated-project fixture, and contract test.

| Résumé detail | Current evidence status | What would make it verifiable |
| --- | --- | --- |
| Next.js/Vite.js + Express in JavaScript/TypeScript | implementation verified | Current resolver, manifests, and matrix tests. |
| PostgreSQL, MongoDB, Prisma, JWT auth, and Redis | implementation verified for selected modules | Current module manifests and generated-output/lifecycle tests. |
| BullMQ | not verified by current main | A selected standard job-queue module, generated runtime wiring, and a contract test. |
| Dockerized Prometheus/Grafana monitoring | not verified by current main | Selected standard observability modules, Compose wiring, and generated-output tests. |
| Prebuilt Auth/CRUD/OAuth/Lemon Squeezy routes | partially verified | Current self-hosted, Clerk, and Supabase auth modules are verified; each claimed CRUD, OAuth, and Lemon Squeezy route needs its own source, generated fixture, and test. |
| 20+ developer hours; 70% prototyping; 80% less boilerplate | measurement record required | A dated before/after task study with comparable project scope, participants or project sample, raw durations/line counts, and calculation. |
| ~1,500 QPS; <200ms latency | measurement record required | Versioned generated configuration, hardware/deployment topology, load profile, concurrency/duration, raw percentile report, and date. |
| 99.95% reliability | measurement record required | A defined SLI/SLO, monitoring source, incident/exclusion policy, service window, and availability calculation. |

## How to make a résumé claim defensible

Keep the implementation wording when it matches the current source and tests.
Attach a measurement record before adding any numerical outcome. The record
must name the Praxis version, generated configuration, dependency versions,
environment, workload or study protocol, collection dates, raw results, and
formula. Do not turn a template's availability into a production guarantee.

## Related Wiki paths

- [Praxis Flow overview](overview.md)
- [Generation pipeline](generation-pipeline.md)
- [Manifest composition](manifest-system.md)
- [Standard projects](standard-projects.md)
- [Praxis Pro Wiki](praxis-pro.md)
