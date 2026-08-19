resource "google_redis_instance" "this" {
  name                    = local.name
  region                  = var.region
  tier                    = "STANDARD_HA"
  memory_size_gb          = 2
  redis_version           = "REDIS_7_2"
  authorized_network      = google_compute_network.this.id
  connect_mode            = "PRIVATE_SERVICE_ACCESS"
  auth_enabled            = true
  transit_encryption_mode = "SERVER_AUTHENTICATION"
  read_replicas_mode      = "READ_REPLICAS_ENABLED"
  replica_count           = 1
  maintenance_policy {
    weekly_maintenance_window {
      day = "SUNDAY"
      start_time {
        hours   = 3
        minutes = 0
        seconds = 0
        nanos   = 0
      }
    }
  }
  labels = local.labels
  lifecycle { prevent_destroy = true }
}
