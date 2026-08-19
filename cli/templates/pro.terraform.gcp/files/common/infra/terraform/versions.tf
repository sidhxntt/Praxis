terraform {
  required_version = ">= 1.15.0, < 2.0.0"
  required_providers {
    google     = { source = "hashicorp/google", version = "~> 7.40" }
    random     = { source = "hashicorp/random", version = "~> 3.7" }
    kubernetes = { source = "hashicorp/kubernetes", version = "~> 3.2" }
  }
  backend "gcs" {}
}

provider "google" {
  project = var.project_id
  region  = var.region
}
data "google_client_config" "current" {}
provider "kubernetes" {
  host                   = "https://${google_container_cluster.this.endpoint}"
  token                  = data.google_client_config.current.access_token
  cluster_ca_certificate = base64decode(google_container_cluster.this.master_auth[0].cluster_ca_certificate)
}
