# Terraform architecture for AWS, Azure, and GCP

Terraform is an optional Praxis Pro capability. Selecting it requires an explicit cloud and implies Kubernetes, autoscaling, high availability, edge protection, database resilience, and cloud secrets.

## Output model

```text
infra/terraform/
  README.md
  versions.tf
  variables.tf
  main.tf
  outputs.tf
  backend.example.hcl
  cache.tf       # when Redis capability requires managed cache
  storage.tf     # when object storage is selected
  search.tf      # when search is selected
```

`pro.terraform.shared` contributes lifecycle guidance common to all clouds. Exactly one of `pro.terraform.aws`, `.azure`, or `.gcp` owns provider-specific resources.

## Cloud ownership

| Concern | AWS | Azure | GCP |
| --- | --- | --- | --- |
| Provider foundation | AWS provider/network/cluster/registry | AzureRM resource group/network/cluster/registry | Google project/network/cluster/registry |
| Managed database | provider-native PostgreSQL service | provider-native PostgreSQL service | Cloud SQL PostgreSQL |
| Cache/storage/search | conditional provider services/files | conditional provider services/files | conditional provider services/files |
| Secrets | provider secret service contract | provider secret service contract | provider secret service contract |

Exact resources and variables are authoritative in the generated `.tf` files; the Wiki describes ownership, not a promise of every cloud SKU.

## Lifecycle boundary

1. Configure remote state from `backend.example.hcl` using organization-owned credentials.
2. Run `terraform init`, validation, plan, review, and apply through the organization's workflow.
3. Build/push the generated application image separately.
4. Supply Terraform outputs to the Kubernetes deployment/secrets workflow.
5. Apply Kubernetes resources separately.
6. Run application migrations through an explicit job/process.

Terraform must not silently create credentials, execute migrations, or deploy application manifests. State, IAM policy, cost controls, backup/restore drills, and production review remain operator responsibilities.

## Capability coupling

Conditional cache/storage/search files are selected from the resolved capability set. Cloud secrets connect Kubernetes secret references to the provider's secret service. Database resilience/disaster recovery choices affect infrastructure configuration, but application transaction and retry semantics remain framework code concerns.

## Authoritative sources and tests

- Shared: [`cli/templates/pro.terraform.shared/`](../cli/templates/pro.terraform.shared/)
- Clouds: [`pro.terraform.aws/`](../cli/templates/pro.terraform.aws/), [`pro.terraform.azure/`](../cli/templates/pro.terraform.azure/), [`pro.terraform.gcp/`](../cli/templates/pro.terraform.gcp/)
- Matrix: [`cli/tests/generator/proMatrix.test.ts`](../cli/tests/generator/proMatrix.test.ts)
