resource "azurerm_storage_account" "application" {
  name                              = substr("${replace(local.name, "-", "")}app", 0, 24)
  resource_group_name               = azurerm_resource_group.this.name
  location                          = azurerm_resource_group.this.location
  account_tier                      = "Standard"
  account_replication_type          = "GZRS"
  min_tls_version                   = "TLS1_2"
  public_network_access_enabled     = false
  shared_access_key_enabled         = false
  infrastructure_encryption_enabled = true
  blob_properties {
    versioning_enabled = true
    delete_retention_policy { days = 30 }
    container_delete_retention_policy { days = 30 }
  }
  tags = local.tags
  lifecycle { prevent_destroy = true }
}

resource "azurerm_storage_container" "application" {
  name                  = "praxis"
  storage_account_id    = azurerm_storage_account.application.id
  container_access_type = "private"
}
