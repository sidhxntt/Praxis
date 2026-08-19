resource "kubernetes_manifest" "eck_operator" {
  manifest = {
    apiVersion = "helm.toolkit.fluxcd.io/v2"
    kind       = "HelmRelease"
    metadata   = { name = "eck-operator", namespace = "elastic-system" }
    spec = {
      interval = "30m"
      chart    = { spec = { chart = "eck-operator", version = "3.2.0", sourceRef = { kind = "HelmRepository", name = "elastic", namespace = "flux-system" } } }
      values   = { managedNamespaces = ["{{projectName}}"] }
    }
  }
  depends_on = [azurerm_kubernetes_cluster.this]
}
