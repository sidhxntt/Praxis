locals {
  name = "{{projectName}}-${var.environment}"
  tags = { Application = "{{projectName}}", Environment = var.environment, ManagedBy = "Terraform" }
}

data "aws_availability_zones" "available" { state = "available" }

resource "aws_kms_key" "this" {
  description             = "${local.name} encryption"
  deletion_window_in_days = 30
  enable_key_rotation     = true
  lifecycle { prevent_destroy = true }
}

resource "aws_vpc" "this" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true
  tags                 = { Name = local.name }
}

resource "aws_internet_gateway" "this" { vpc_id = aws_vpc.this.id }

resource "aws_subnet" "public" {
  count                   = 2
  vpc_id                  = aws_vpc.this.id
  cidr_block              = cidrsubnet(aws_vpc.this.cidr_block, 8, count.index)
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = false
  tags                    = { Name = "${local.name}-public-${count.index + 1}", "kubernetes.io/role/elb" = "1" }
}

resource "aws_subnet" "private" {
  count             = 2
  vpc_id            = aws_vpc.this.id
  cidr_block        = cidrsubnet(aws_vpc.this.cidr_block, 8, count.index + 10)
  availability_zone = data.aws_availability_zones.available.names[count.index]
  tags              = { Name = "${local.name}-private-${count.index + 1}", "kubernetes.io/role/internal-elb" = "1" }
}

resource "aws_eip" "nat" {
  count  = 2
  domain = "vpc"
}
resource "aws_nat_gateway" "this" {
  count         = 2
  allocation_id = aws_eip.nat[count.index].id
  subnet_id     = aws_subnet.public[count.index].id
  depends_on    = [aws_internet_gateway.this]
}

resource "aws_route_table" "public" { vpc_id = aws_vpc.this.id }
resource "aws_route" "public" {
  route_table_id         = aws_route_table.public.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.this.id
}
resource "aws_route_table_association" "public" {
  count          = 2
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}
resource "aws_route_table" "private" {
  count  = 2
  vpc_id = aws_vpc.this.id
}
resource "aws_route" "private" {
  count                  = 2
  route_table_id         = aws_route_table.private[count.index].id
  destination_cidr_block = "0.0.0.0/0"
  nat_gateway_id         = aws_nat_gateway.this[count.index].id
}
resource "aws_route_table_association" "private" {
  count          = 2
  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private[count.index].id
}

data "aws_iam_policy_document" "eks_assume" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["eks.amazonaws.com"]
    }
  }
}
resource "aws_iam_role" "eks" {
  name               = "${local.name}-eks"
  assume_role_policy = data.aws_iam_policy_document.eks_assume.json
}
resource "aws_iam_role_policy_attachment" "eks" {
  role       = aws_iam_role.eks.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
}

resource "aws_eks_cluster" "this" {
  name     = local.name
  role_arn = aws_iam_role.eks.arn
  version  = var.kubernetes_version
  vpc_config {
    subnet_ids              = aws_subnet.private[*].id
    endpoint_private_access = true
    endpoint_public_access  = true
    public_access_cidrs     = ["0.0.0.0/0"]
  }
  access_config { authentication_mode = "API_AND_CONFIG_MAP" }
  encryption_config {
    provider { key_arn = aws_kms_key.this.arn }
    resources = ["secrets"]
  }
  enabled_cluster_log_types = ["api", "audit", "authenticator", "controllerManager", "scheduler"]
  depends_on                = [aws_iam_role_policy_attachment.eks]
  lifecycle { prevent_destroy = true }
}

data "aws_iam_policy_document" "nodes_assume" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}
resource "aws_iam_role" "nodes" {
  name               = "${local.name}-nodes"
  assume_role_policy = data.aws_iam_policy_document.nodes_assume.json
}
resource "aws_iam_role_policy_attachment" "nodes" {
  for_each   = toset(["AmazonEKSWorkerNodePolicy", "AmazonEC2ContainerRegistryReadOnly", "AmazonEKS_CNI_Policy"])
  role       = aws_iam_role.nodes.name
  policy_arn = "arn:aws:iam::aws:policy/${each.value}"
}
resource "aws_eks_node_group" "this" {
  cluster_name    = aws_eks_cluster.this.name
  node_group_name = "application"
  node_role_arn   = aws_iam_role.nodes.arn
  subnet_ids      = aws_subnet.private[*].id
  instance_types  = ["m7g.large"]
  scaling_config {
    desired_size = 3
    min_size     = 3
    max_size     = 10
  }
  update_config { max_unavailable_percentage = 25 }
  depends_on = [aws_iam_role_policy_attachment.nodes]
}

resource "aws_security_group" "database" {
  name   = "${local.name}-database"
  vpc_id = aws_vpc.this.id
  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = [aws_vpc.this.cidr_block]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
resource "aws_db_subnet_group" "this" {
  name       = local.name
  subnet_ids = aws_subnet.private[*].id
}
resource "aws_db_instance" "this" {
  identifier                   = local.name
  engine                       = "postgres"
  engine_version               = "17.6"
  instance_class               = var.database_instance_class
  allocated_storage            = 50
  max_allocated_storage        = 500
  storage_encrypted            = true
  kms_key_id                   = aws_kms_key.this.arn
  db_name                      = "app"
  username                     = "app"
  manage_master_user_password  = true
  multi_az                     = true
  backup_retention_period      = 35
  copy_tags_to_snapshot        = true
  deletion_protection          = true
  skip_final_snapshot          = false
  final_snapshot_identifier    = "${local.name}-final"
  db_subnet_group_name         = aws_db_subnet_group.this.name
  vpc_security_group_ids       = [aws_security_group.database.id]
  performance_insights_enabled = true
  auto_minor_version_upgrade   = true
  apply_immediately            = false
  lifecycle { prevent_destroy = true }
}

resource "aws_ecr_repository" "this" {
  name                 = local.name
  image_tag_mutability = "IMMUTABLE"
  encryption_configuration {
    encryption_type = "KMS"
    kms_key         = aws_kms_key.this.arn
  }
  image_scanning_configuration { scan_on_push = true }
}
resource "aws_secretsmanager_secret" "application" {
  name                    = "${local.name}/application"
  kms_key_id              = aws_kms_key.this.arn
  recovery_window_in_days = 30
  lifecycle { prevent_destroy = true }
}

resource "aws_wafv2_web_acl" "this" {
  name  = local.name
  scope = "REGIONAL"
  default_action {
    allow {}
  }
  rule {
    name     = "aws-managed-common"
    priority = 1
    override_action {
      none {}
    }
    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesCommonRuleSet"
        vendor_name = "AWS"
      }
    }
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "common"
      sampled_requests_enabled   = true
    }
  }
  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = local.name
    sampled_requests_enabled   = true
  }
}

resource "aws_budgets_budget" "monthly" {
  name         = "${local.name}-monthly"
  budget_type  = "COST"
  limit_amount = tostring(var.monthly_budget_usd)
  limit_unit   = "USD"
  time_unit    = "MONTHLY"
}
