data "azurerm_client_config" "current" {}

locals {
  name = "{{projectName}}-${var.environment}"
  tags = { application = "{{projectName}}", environment = var.environment, "managed-by" = "terraform" }
}

resource "azurerm_resource_group" "this" {
  name     = local.name
  location = var.location
  tags     = local.tags
  lifecycle { prevent_destroy = true }
}

resource "azurerm_virtual_network" "this" {
  name                = "${local.name}-vnet"
  address_space       = ["10.10.0.0/16"]
  location            = azurerm_resource_group.this.location
  resource_group_name = azurerm_resource_group.this.name
  tags                = local.tags
}
resource "azurerm_subnet" "aks" {
  name                 = "aks"
  resource_group_name  = azurerm_resource_group.this.name
  virtual_network_name = azurerm_virtual_network.this.name
  address_prefixes     = ["10.10.0.0/20"]
}
resource "azurerm_subnet" "database" {
  name                 = "database"
  resource_group_name  = azurerm_resource_group.this.name
  virtual_network_name = azurerm_virtual_network.this.name
  address_prefixes     = ["10.10.16.0/24"]
  delegation {
    name = "postgres"
    service_delegation {
      name    = "Microsoft.DBforPostgreSQL/flexibleServers"
      actions = ["Microsoft.Network/virtualNetworks/subnets/join/action"]
    }
  }
}

resource "azurerm_log_analytics_workspace" "this" {
  name                = "${local.name}-logs"
  location            = azurerm_resource_group.this.location
  resource_group_name = azurerm_resource_group.this.name
  sku                 = "PerGB2018"
  retention_in_days   = 30
  tags                = local.tags
}

resource "azurerm_kubernetes_cluster" "this" {
  name                              = local.name
  location                          = azurerm_resource_group.this.location
  resource_group_name               = azurerm_resource_group.this.name
  dns_prefix                        = local.name
  kubernetes_version                = var.kubernetes_version
  sku_tier                          = "Standard"
  local_account_disabled            = true
  role_based_access_control_enabled = true
  oidc_issuer_enabled               = true
  workload_identity_enabled         = true
  default_node_pool {
    name                 = "system"
    vm_size              = "Standard_D4s_v5"
    auto_scaling_enabled = true
    min_count            = 3
    max_count            = 10
    max_pods             = 50
    vnet_subnet_id       = azurerm_subnet.aks.id
    zones                = ["1", "2", "3"]
    upgrade_settings { max_surge = "33%" }
  }
  identity { type = "SystemAssigned" }
  network_profile {
    network_plugin    = "azure"
    network_policy    = "azure"
    load_balancer_sku = "standard"
  }
  oms_agent { log_analytics_workspace_id = azurerm_log_analytics_workspace.this.id }
  key_vault_secrets_provider { secret_rotation_enabled = true }
  tags = local.tags
  lifecycle { prevent_destroy = true }
}

resource "random_password" "database" {
  length  = 32
  special = true
}
resource "azurerm_private_dns_zone" "database" {
  name                = "${local.name}.postgres.database.azure.com"
  resource_group_name = azurerm_resource_group.this.name
}
resource "azurerm_private_dns_zone_virtual_network_link" "database" {
  name                  = "database"
  private_dns_zone_name = azurerm_private_dns_zone.database.name
  virtual_network_id    = azurerm_virtual_network.this.id
  resource_group_name   = azurerm_resource_group.this.name
}
resource "azurerm_postgresql_flexible_server" "this" {
  name                         = local.name
  resource_group_name          = azurerm_resource_group.this.name
  location                     = azurerm_resource_group.this.location
  version                      = "17"
  delegated_subnet_id          = azurerm_subnet.database.id
  private_dns_zone_id          = azurerm_private_dns_zone.database.id
  administrator_login          = "appadmin"
  administrator_password       = random_password.database.result
  sku_name                     = "GP_Standard_D4s_v3"
  storage_mb                   = 131072
  backup_retention_days        = 35
  geo_redundant_backup_enabled = true
  zone                         = "1"
  high_availability {
    mode                      = "ZoneRedundant"
    standby_availability_zone = "2"
  }
  authentication {
    active_directory_auth_enabled = true
    password_auth_enabled         = true
  }
  tags       = local.tags
  depends_on = [azurerm_private_dns_zone_virtual_network_link.database]
  lifecycle { prevent_destroy = true }
  # deletion_protection is enforced through prevent_destroy and an Azure resource lock.
}
resource "azurerm_management_lock" "database" {
  name       = "database-cannot-delete"
  scope      = azurerm_postgresql_flexible_server.this.id
  lock_level = "CanNotDelete"
}

resource "azurerm_container_registry" "this" {
  name                          = replace(local.name, "-", "")
  resource_group_name           = azurerm_resource_group.this.name
  location                      = azurerm_resource_group.this.location
  sku                           = "Premium"
  admin_enabled                 = false
  public_network_access_enabled = false
  zone_redundancy_enabled       = true
  tags                          = local.tags
}

resource "azurerm_key_vault" "this" {
  name                          = substr(replace(local.name, "-", ""), 0, 24)
  location                      = azurerm_resource_group.this.location
  resource_group_name           = azurerm_resource_group.this.name
  tenant_id                     = data.azurerm_client_config.current.tenant_id
  sku_name                      = "premium"
  rbac_authorization_enabled    = true
  purge_protection_enabled      = true
  soft_delete_retention_days    = 90
  public_network_access_enabled = false
  tags                          = local.tags
  lifecycle { prevent_destroy = true }
}
resource "azurerm_key_vault_secret" "database" {
  name         = "database-password"
  value        = random_password.database.result
  key_vault_id = azurerm_key_vault.this.id
}

resource "azurerm_web_application_firewall_policy" "this" {
  name                = local.name
  resource_group_name = azurerm_resource_group.this.name
  location            = azurerm_resource_group.this.location
  policy_settings {
    enabled = true
    mode    = "Prevention"
  }
  managed_rules {
    managed_rule_set {
      type    = "OWASP"
      version = "3.2"
    }
  }
  tags = local.tags
}
resource "azurerm_cdn_frontdoor_profile" "this" {
  name                = local.name
  resource_group_name = azurerm_resource_group.this.name
  sku_name            = "Premium_AzureFrontDoor"
  tags                = local.tags
}

resource "azurerm_consumption_budget_resource_group" "monthly" {
  name              = "${local.name}-monthly"
  resource_group_id = azurerm_resource_group.this.id
  amount            = var.monthly_budget_usd
  time_grain        = "Monthly"
  time_period {
    start_date = "2026-01-01T00:00:00Z"
    end_date   = "2036-01-01T00:00:00Z"
  }
  notification {
    enabled        = true
    threshold      = 80
    operator       = "GreaterThan"
    contact_emails = [var.budget_contact_email]
  }
}
