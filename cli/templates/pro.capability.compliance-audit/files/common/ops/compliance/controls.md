# Compliance audit operations

This scaffold emits structured audit events for state-changing HTTP methods without request bodies, query strings, authorization headers, cookies, or credentials. Route paths may contain identifiers; review route design against your data-classification policy.

## Control mapping

- SOC 2 CC6/CC7: authenticated actor, request correlation, action, resource path, result, and timestamp.
- ISO 27001 A.8.15: centralized, access-controlled audit logging and monitoring.
- GDPR security/accountability: data-minimized events and documented retention/deletion controls.

Set `AUDIT_RETENTION_DAYS` to the approved retention period (365 days by default). The log platform—not the application container—must enforce immutable/WORM storage, encryption, restricted access, deletion after retention, alerting for pipeline failure, and clock synchronization. Test restoration and evidence export quarterly.

Application audit events are evidence inputs, not automatic certification. Complete a threat model, access review, incident-response exercise, vendor assessment, and jurisdiction-specific legal review.
