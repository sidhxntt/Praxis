# Terraform operations

This directory provisions managed Kubernetes, PostgreSQL, registry, secret management, edge
protection, observability foundations, and only the optional services selected in Praxis.

Create the remote-state storage separately, copy the relevant values from
`backend.example.hcl`, then initialize without committing state credentials:

```sh
terraform init -backend-config=backend.example.hcl
terraform fmt -check -recursive
terraform validate
terraform plan -out=tfplan
terraform show -json tfplan > tfplan.json
```

Use workload identity from CI rather than static cloud keys. Review every plan, require approval
for production, scan with TFLint and Checkov, and apply immutable image digests separately through
the generated Kubernetes overlay. Database and cluster resources carry deletion safeguards;
removal requires an explicit reviewed lifecycle change.

The local `k8s/base` topology contains PostgreSQL and selected stateful services for a standalone
cluster. In cloud environments, point application secrets and configuration at the managed
Terraform outputs and omit those local StatefulSets in your production Kustomize overlay.
