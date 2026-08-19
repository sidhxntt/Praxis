# Operations

Use readiness for traffic admission, liveness only for process recovery, and startup during migrations. Deploy migrations as a controlled one-shot operation before rolling out application replicas. Back up PostgreSQL with point-in-time recovery, test restoration regularly, rotate secrets, retain an SBOM for each image, and document rollback ownership.
