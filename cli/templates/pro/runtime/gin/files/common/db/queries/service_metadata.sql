-- name: GetServiceMetadata :one
SELECT key, value, updated_at FROM service_metadata WHERE key = $1;
