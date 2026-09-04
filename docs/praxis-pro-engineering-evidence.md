# Praxis Pro engineering evidence

This is the evidence ledger for the Praxis Pro project entry. Praxis Pro is a
capability-driven generator inside `praxiflow`, not a hosted platform and not a
guarantee that every generated project is production-ready without operator
review.

## Résumé statement

> Reduced backend setup by 50%, onboarding by 35%, and manual infra setup by
> 80% by building an enterprise-grade Django REST Framework boilerplate with
> built-in ORM, JWT auth, Gunicorn + Nginx containerization, and Redoc/Swagger
> docs; automated Kubernetes orchestration (Pods, Ingress, Services via
> Kubectl/Minikube) boosting scalability by 40%, and bash-scripted ELK stack
> (Elasticsearch, Logstash, Kibana) + Sentry integration improving
> observability by 60%.

## Implementation evidence

| Product area | Engineering challenge and implemented boundary | Authoritative implementation | Automated evidence | Status |
| --- | --- | --- | --- | --- |
| Capability selection | Expand requested capabilities into a verified, canonical closure so prerequisites are not forgotten and unselected services do not leak into output. | [`pro.ts`](../cli/src/config/pro.ts), [`schema.ts`](../cli/src/config/schema.ts), [`resolver.ts`](../cli/src/config/resolver.ts) | [`proCapabilities.test.ts`](../cli/tests/generator/proCapabilities.test.ts), [`proMatrix.test.ts`](../cli/tests/generator/proMatrix.test.ts) | implementation verified |
| Django/DRF foundation | Generate framework-native settings, migrations, ORM, DRF routing, health behavior, and container entry points without treating Django as a generic Node-style stack. | [`pro.django`](../cli/templates/pro.django/), [Django architecture](django-architecture.md) | [`proDjango.test.ts`](../cli/tests/generator/proDjango.test.ts), [`proRuntime.test.ts`](../cli/tests/generator/proRuntime.test.ts) | implementation verified |
| JWT and API documentation | Patch only selected authentication and API-schema contributions into named stack anchors, including JWT and OpenAPI/Swagger surfaces. | [`jwt-auth`](../cli/templates/pro.capability.jwt-auth/), [`pro.django`](../cli/templates/pro.django/), [`pro.gin`](../cli/templates/pro.gin/) | [`proCapabilities.test.ts`](../cli/tests/generator/proCapabilities.test.ts), [`proGin.test.ts`](../cli/tests/generator/proGin.test.ts) | implementation verified for selected modules |
| Containers and traffic | Keep application readiness separate from Compose orchestration; add Nginx only when selected and retain runtime lifecycle ownership in the application. | [`pro.compose`](../cli/templates/pro.compose/), [`nginx`](../cli/templates/pro.capability.nginx/), [Compose architecture](compose-architecture.md) | [`proCapabilities.test.ts`](../cli/tests/generator/proCapabilities.test.ts), [`proRuntime.test.ts`](../cli/tests/generator/proRuntime.test.ts) | implementation verified for selected modules |
| Kubernetes output | Generate Pods, Services, configuration, ingress-facing resources, jobs, probes, and selected capability workloads without claiming a cluster has been applied. | [`pro.kubernetes`](../cli/templates/pro.kubernetes/), [Kubernetes architecture](kubernetes-architecture.md) | [`proKubernetes.test.ts`](../cli/tests/generator/proKubernetes.test.ts), [`proMatrix.test.ts`](../cli/tests/generator/proMatrix.test.ts) | implementation verified for selected modules |
| ELK, Sentry, and Prometheus | Add observability code/configuration only for selected capabilities and keep a hosted Sentry integration distinct from locally composed services. | [`elk`](../cli/templates/pro.capability.elk/), [`sentry`](../cli/templates/pro.capability.sentry/), [`prometheus`](../cli/templates/pro.capability.prometheus/) | [`proCapabilities.test.ts`](../cli/tests/generator/proCapabilities.test.ts), [`proKubernetes.test.ts`](../cli/tests/generator/proKubernetes.test.ts) | implementation verified for selected modules |

## Claim reconciliation

| Résumé detail | Current evidence status | What would make it verifiable |
| --- | --- | --- |
| Django REST Framework, ORM, JWT, Gunicorn, Nginx, and API documentation | implementation verified for selected Pro modules | Current stack/capability manifests and generated-output contracts; deployment configuration remains operator-owned. |
| Kubernetes Pods, Services, ingress-facing resources, Kubectl/Minikube workflow | implementation verified for selected modules | Current Kubernetes manifest/output contracts plus a versioned applied-cluster record for deployment claims. |
| ELK and Sentry integration | implementation verified for selected modules | Current selected ELK/Sentry manifests and generated-output contracts. |
| 50% backend setup; 35% onboarding; 80% manual infrastructure setup | measurement record required | Dated before/after studies with comparable scope, task protocol, participant/project sample, raw task times, and calculation. |
| 40% scalability | measurement record required | Versioned generated configuration, deployment topology, load profile, concurrency/duration, raw capacity/latency results, and calculation. |
| 60% observability | measurement record required | Defined observability outcome, baseline and treatment period, incident/sample set, raw detection/diagnosis data, and calculation. |

## Operational boundary

Compose is the local production-shaped topology. Kubernetes emits workload
definitions. Terraform provisions selected cloud foundations. They have
different lifecycle owners: neither a template nor an infrastructure manifest
executes migrations, proves capacity, supplies secrets, or replaces security
and operations review. See [capability architecture](capability-architecture.md),
[Kubernetes architecture](kubernetes-architecture.md), and [Terraform clouds](terraform-architecture.md).

## Praxis Pro Wiki navigation

- [Praxis Pro home](praxis-pro.md)
- [Capability architecture](capability-architecture.md)
- [Django and DRF](django-architecture.md)
- [Go and Gin](gin-architecture.md)
- [Docker Compose](compose-architecture.md)
- [Kubernetes](kubernetes-architecture.md)
- [Terraform](terraform-architecture.md)
- [Generated backend comparison](generated-backends.md)
