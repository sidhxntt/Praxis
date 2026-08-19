terraform {
  required_version = ">= 1.15.0, < 2.0.0"
  required_providers {
    aws        = { source = "hashicorp/aws", version = "~> 6.55" }
    kubernetes = { source = "hashicorp/kubernetes", version = "~> 3.2" }
  }
  backend "s3" {}
}

provider "aws" {
  region = var.region
  default_tags { tags = local.tags }
}

data "aws_eks_cluster_auth" "this" { name = aws_eks_cluster.this.name }

provider "kubernetes" {
  host                   = aws_eks_cluster.this.endpoint
  cluster_ca_certificate = base64decode(aws_eks_cluster.this.certificate_authority[0].data)
  token                  = data.aws_eks_cluster_auth.this.token
}
