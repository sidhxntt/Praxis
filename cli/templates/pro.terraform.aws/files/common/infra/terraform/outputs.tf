output "cluster_name" { value = aws_eks_cluster.this.name }
output "cluster_endpoint" {
  value     = aws_eks_cluster.this.endpoint
  sensitive = true
}
output "database_endpoint" {
  value     = aws_db_instance.this.endpoint
  sensitive = true
}
output "registry_url" { value = aws_ecr_repository.this.repository_url }
output "application_secret_arn" { value = aws_secretsmanager_secret.application.arn }
