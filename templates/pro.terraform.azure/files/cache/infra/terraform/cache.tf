resource "azurerm_redis_cache" "this" {
  name                          = local.name
  location                      = azurerm_resource_group.this.location
  resource_group_name           = azurerm_resource_group.this.name
  capacity                      = 1
  family                        = "P"
  sku_name                      = "Premium"
  non_ssl_port_enabled          = false
  minimum_tls_version           = "1.2"
  public_network_access_enabled = false
  zones                         = ["1", "2", "3"]
  redis_configuration {
    aof_backup_enabled              = true
    aof_storage_connection_string_0 = azurerm_storage_account.cache.primary_blob_connection_string
  }
  tags = local.tags
  lifecycle { prevent_destroy = true }
}

resource "azurerm_storage_account" "cache" {
  name                          = substr("${replace(local.name, "-", "")}cache", 0, 24)
  resource_group_name           = azurerm_resource_group.this.name
  location                      = azurerm_resource_group.this.location
  account_tier                  = "Standard"
  account_replication_type      = "ZRS"
  min_tls_version               = "TLS1_2"
  public_network_access_enabled = false
  tags                          = local.tags
}
