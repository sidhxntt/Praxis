# Operations

## Deployment and rollback

Use readiness for traffic admission, liveness only for process recovery, and startup during migrations. Run migrations as a reviewed one-shot operation before rolling out application replicas. Deploy immutable image digests with a rolling or canary strategy. Record the previous digest and migration compatibility before release; rollback the workload only when the database change is backward compatible.

## Backup, restore, and disaster recovery

Enable encrypted PostgreSQL backups and point-in-time recovery. Perform a restore into an isolated environment at least quarterly, verify row counts and application smoke tests, and retain the evidence. Define recovery-time and recovery-point objectives, owners, communication paths, DNS/traffic failover, and a disaster recovery exercise schedule. Never treat an untested backup as recoverable.

## Secrets and access

Deliver secrets from an approved secret manager. Practice secret rotation for database, JWT, OAuth, SMTP, object-storage, Kafka, and observability credentials; support overlap windows where providers permit. Review production access quarterly and after role changes. `.env.example` contains names only and must never contain real credentials.

## Scaling and cost

Measure latency, saturation, queue depth, database connections, and error rate before changing replicas or limits. Validate autoscaling under load and budget for stateful managed services, log retention, cross-region transfer, NAT, and backup storage.

## Production-readiness checklist

- CI formatting, static analysis, tests, migration checks, Gitleaks, Trivy, Checkov, and Syft gates pass.
- Alerts, dashboards, synthetic checks, audit retention, and on-call ownership are verified.
- Backup restore, rollback, secret rotation, capacity, and disaster recovery procedures were exercised.
- Kubernetes policies and Terraform plans received independent review.
- The SBOM, image digest, configuration, migration version, and release approval are retained.
