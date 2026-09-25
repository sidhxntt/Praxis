resource "google_storage_bucket" "application" {
  name                        = "${var.project_id}-${local.name}"
  location                    = var.region
  uniform_bucket_level_access = true
  public_access_prevention    = "enforced"
  force_destroy               = false
  versioning { enabled = true }
  encryption { default_kms_key_name = google_kms_crypto_key.this.id }
  lifecycle_rule {
    condition {
      age        = 90
      with_state = "ARCHIVED"
    }
    action { type = "Delete" }
  }
  labels = local.labels
  lifecycle { prevent_destroy = true }
}
