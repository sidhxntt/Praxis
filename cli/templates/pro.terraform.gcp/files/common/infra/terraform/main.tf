locals {
  name   = "{{projectName}}-${var.environment}"
  labels = { application = "{{projectName}}", environment = var.environment, "managed-by" = "terraform" }
}

resource "google_project_service" "required" {
  for_each           = toset(["artifactregistry.googleapis.com", "compute.googleapis.com", "container.googleapis.com", "secretmanager.googleapis.com", "sqladmin.googleapis.com", "cloudkms.googleapis.com", "billingbudgets.googleapis.com"])
  project            = var.project_id
  service            = each.value
  disable_on_destroy = false
}

resource "google_compute_network" "this" {
  name                    = local.name
  auto_create_subnetworks = false
  routing_mode            = "REGIONAL"
  project                 = var.project_id
}
resource "google_compute_subnetwork" "this" {
  name                     = local.name
  ip_cidr_range            = "10.20.0.0/20"
  region                   = var.region
  network                  = google_compute_network.this.id
  private_ip_google_access = true
  secondary_ip_range {
    range_name    = "pods"
    ip_cidr_range = "10.24.0.0/14"
  }
  secondary_ip_range {
    range_name    = "services"
    ip_cidr_range = "10.28.0.0/20"
  }
}

resource "google_container_cluster" "this" {
  name                        = local.name
  location                    = var.region
  network                     = google_compute_network.this.id
  subnetwork                  = google_compute_subnetwork.this.id
  remove_default_node_pool    = true
  initial_node_count          = 1
  deletion_protection         = true
  enable_shielded_nodes       = true
  enable_intranode_visibility = true
  release_channel { channel = "STABLE" }
  workload_identity_config { workload_pool = "${var.project_id}.svc.id.goog" }
  ip_allocation_policy {
    cluster_secondary_range_name  = "pods"
    services_secondary_range_name = "services"
  }
  private_cluster_config {
    enable_private_nodes    = true
    enable_private_endpoint = false
    master_ipv4_cidr_block  = "172.16.0.0/28"
    master_global_access_config { enabled = false }
  }
  master_authorized_networks_config {
    cidr_blocks {
      cidr_block   = "10.0.0.0/8"
      display_name = "private-networks"
    }
  }
  network_policy {
    enabled  = true
    provider = "PROVIDER_UNSPECIFIED"
  }
  logging_service    = "logging.googleapis.com/kubernetes"
  monitoring_service = "monitoring.googleapis.com/kubernetes"
  resource_labels    = local.labels
  depends_on         = [google_project_service.required]
  lifecycle { prevent_destroy = true }
}

resource "google_container_node_pool" "application" {
  name       = "application"
  location   = var.region
  cluster    = google_container_cluster.this.name
  node_count = 3
  autoscaling {
    min_node_count  = 1
    max_node_count  = 10
    location_policy = "BALANCED"
  }
  management {
    auto_repair  = true
    auto_upgrade = true
  }
  node_config {
    machine_type = "e2-standard-4"
    disk_type    = "pd-balanced"
    disk_size_gb = 100
    image_type   = "COS_CONTAINERD"
    oauth_scopes = ["https://www.googleapis.com/auth/cloud-platform"]
    shielded_instance_config {
      enable_secure_boot          = true
      enable_integrity_monitoring = true
    }
    workload_metadata_config { mode = "GKE_METADATA" }
    labels = local.labels
  }
}

resource "random_password" "database" {
  length  = 32
  special = true
}
resource "google_sql_database_instance" "this" {
  name                = local.name
  region              = var.region
  database_version    = "POSTGRES_17"
  deletion_protection = true
  settings {
    tier              = "db-custom-2-7680"
    availability_type = "REGIONAL"
    disk_type         = "PD_SSD"
    disk_size         = 50
    disk_autoresize   = true
    backup_configuration {
      enabled                        = true
      point_in_time_recovery_enabled = true
      transaction_log_retention_days = 7
      backup_retention_settings {
        retained_backups = 35
        retention_unit   = "COUNT"
      }
    }
    ip_configuration {
      ipv4_enabled                                  = false
      private_network                               = google_compute_network.this.id
      enable_private_path_for_google_cloud_services = true
    }
    insights_config {
      query_insights_enabled  = true
      record_application_tags = true
      record_client_address   = false
    }
    user_labels = local.labels
  }
  lifecycle { prevent_destroy = true }
  depends_on = [google_project_service.required]
}
resource "google_sql_user" "application" {
  name     = "app"
  instance = google_sql_database_instance.this.name
  password = random_password.database.result
}
resource "google_sql_database" "application" {
  name     = "app"
  instance = google_sql_database_instance.this.name
}

resource "google_artifact_registry_repository" "this" {
  location               = var.region
  repository_id          = local.name
  format                 = "DOCKER"
  cleanup_policy_dry_run = false
  docker_config { immutable_tags = true }
  cleanup_policies {
    id     = "keep-recent"
    action = "KEEP"
    most_recent_versions { keep_count = 20 }
  }
  labels     = local.labels
  depends_on = [google_project_service.required]
}

resource "google_kms_key_ring" "this" {
  name     = local.name
  location = var.region
}
resource "google_kms_crypto_key" "this" {
  name            = local.name
  key_ring        = google_kms_key_ring.this.id
  rotation_period = "7776000s"
  lifecycle { prevent_destroy = true }
}
resource "google_secret_manager_secret" "application" {
  secret_id = "${local.name}-application"
  replication {
    auto {
      customer_managed_encryption { kms_key_name = google_kms_crypto_key.this.id }
    }
  }
  labels = local.labels
  lifecycle { prevent_destroy = true }
  depends_on = [google_project_service.required]
}

resource "google_compute_security_policy" "this" {
  name = local.name
  rule {
    action      = "deny(403)"
    priority    = 1000
    description = "SQL injection protection"
    match {
      expr { expression = "evaluatePreconfiguredWaf('sqli-v33-stable')" }
    }
  }
  rule {
    action   = "allow"
    priority = 2147483647
    match {
      versioned_expr = "SRC_IPS_V1"
      config { src_ip_ranges = ["*"] }
    }
  }
}
resource "google_compute_backend_service" "cdn" {
  name                  = local.name
  protocol              = "HTTP"
  load_balancing_scheme = "EXTERNAL_MANAGED"
  enable_cdn            = true
  security_policy       = google_compute_security_policy.this.id
  cdn_policy {
    cache_mode       = "CACHE_ALL_STATIC"
    default_ttl      = 3600
    client_ttl       = 3600
    max_ttl          = 86400
    negative_caching = true
    cache_key_policy {
      include_host         = true
      include_protocol     = true
      include_query_string = false
    }
  }
}

resource "google_billing_budget" "monthly" {
  count           = var.billing_account_id == "" ? 0 : 1
  billing_account = var.billing_account_id
  display_name    = "${local.name} monthly"
  budget_filter { projects = ["projects/${var.project_id}"] }
  amount {
    specified_amount {
      currency_code = "USD"
      units         = tostring(var.monthly_budget_usd)
    }
  }
  threshold_rules { threshold_percent = 0.8 }
  threshold_rules { threshold_percent = 1.0 }
}
