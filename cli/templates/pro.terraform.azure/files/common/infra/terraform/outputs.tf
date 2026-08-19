output "cluster_name" { value = azurerm_kubernetes_cluster.this.name }
output "database_fqdn" {
  value     = azurerm_postgresql_flexible_server.this.fqdn
  sensitive = true
}
output "registry_url" { value = azurerm_container_registry.this.login_server }
output "key_vault_id" { value = azurerm_key_vault.this.id }
