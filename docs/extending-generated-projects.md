# Extending generated projects

Generated repositories are owned by their users. Extend them using their framework's native patterns while preserving the lifecycle and infrastructure contracts recorded in `praxis.config.json`.

## First inspection

1. Read `praxis.config.json`.
2. Resolve its [agent context](template-agent-guide.md).
3. Identify runtime entry points and selected integrations.
4. Read health/readiness/shutdown behavior.
5. Inspect Compose/Kubernetes/Terraform only if present.
6. Run the generated repository's tests before changing behavior.

## Standard Express

Keep routes thin, add services for reusable policy, isolate external integrations behind small modules, and register initialization/cleanup with the existing lifecycle. Do not connect clients during module import if failure cannot be rolled back.

## Django/DRF

Create bounded applications or focused core modules. Keep settings environment-specific, views transport-oriented, permission/domain policy explicit, and schema changes in migrations. Add Celery tasks only when the worker/broker topology exists.

## Go/Gin

Keep handlers transport-oriented, services policy-oriented, and persistence behind narrow typed interfaces. Wire implementations explicitly in command entry points, close every constructed dependency, and update sqlc queries/migrations together.

## Infrastructure

- Compose is local topology; do not treat it as cloud provisioning.
- Kubernetes owns workloads and rollout behavior; keep probes aligned with application semantics.
- Terraform owns cloud resources/state; do not place application migration or secret values in Terraform source.
- Changes crossing application and infrastructure layers require tests/evidence in every affected layer.

## Updating Praxis instead of one output

If the improvement belongs in future generated projects, change the relevant manifest/overlays and contract tests in Praxis. Preserve selectors and patch anchors, regenerate representative outputs, and verify unselected configurations remain clean. Start with the [Template Agent Guide](template-agent-guide.md).
