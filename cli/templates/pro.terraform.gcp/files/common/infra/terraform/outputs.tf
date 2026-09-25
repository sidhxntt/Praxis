output "cluster_name" { value = google_container_cluster.this.name }
output "database_connection_name" {
  value     = google_sql_database_instance.this.connection_name
  sensitive = true
}
output "registry_url" { value = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.this.repository_id}" }
output "application_secret_id" { value = google_secret_manager_secret.application.secret_id }
