# Kubernetes operations

Render and review the exact deployment before applying it:

```sh
kubectl kustomize k8s/base
kubectl apply --server-side -k k8s/base
kubectl rollout status deployment/api -n {{projectName}}
```

The workloads intentionally reference a `praxis-secrets` Secret but never generate secret
values. Before deployment, create that Secret through your approved secret-delivery process.
The Django stack requires `django-secret-key` and `database-password`; the Go stack requires
`database-url`. Selected integrations can additionally require Sentry, object-storage, or other
capability keys documented in `.env.example`.

When Cloud Secrets is selected, install the External Secrets Operator and configure the
`praxis-cloud-secrets` `ClusterSecretStore` for the selected cloud. The generated
`ExternalSecret` then materializes `praxis-secrets`; do not also create it manually.

Images default to `ghcr.io/your-org/{{projectName}}:latest`. Replace this through a Kustomize
overlay or `kustomize edit set image`; immutable digests are recommended for production.

Use a dedicated namespace, inspect resource requests and limits against measured load, and run
policy, image, and manifest scanning in CI before applying changes. For rollback, run
`kubectl rollout undo deployment/api -n {{projectName}}` and verify readiness before restoring
traffic.

Review the generated default-deny network policy (`NetworkPolicy`) and add only the ingress and egress rules required
by selected dependencies. For disaster recovery, keep manifests and immutable image digests in the
release record, restore managed data first, apply the reviewed overlay in the recovery region, then
shift traffic only after startup/readiness probes and application smoke tests pass.
