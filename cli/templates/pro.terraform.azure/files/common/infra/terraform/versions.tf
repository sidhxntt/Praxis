terraform {
  required_version = ">= 1.15.0, < 2.0.0"
  required_providers {
    azurerm    = { source = "hashicorp/azurerm", version = "~> 4.77" }
    random     = { source = "hashicorp/random", version = "~> 3.7" }
    kubernetes = { source = "hashicorp/kubernetes", version = "~> 3.2" }
  }
  backend "azurerm" {}
}

provider "azurerm" {
  features {}
}

provider "kubernetes" {
  host                   = azurerm_kubernetes_cluster.this.kube_config[0].host
  client_certificate     = base64decode(azurerm_kubernetes_cluster.this.kube_config[0].client_certificate)
  client_key             = base64decode(azurerm_kubernetes_cluster.this.kube_config[0].client_key)
  cluster_ca_certificate = base64decode(azurerm_kubernetes_cluster.this.kube_config[0].cluster_ca_certificate)
}
