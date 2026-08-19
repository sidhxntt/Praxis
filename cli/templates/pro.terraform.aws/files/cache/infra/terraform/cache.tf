resource "aws_elasticache_subnet_group" "this" {
  name       = local.name
  subnet_ids = aws_subnet.private[*].id
}

resource "aws_security_group" "cache" {
  name   = "${local.name}-cache"
  vpc_id = aws_vpc.this.id
  ingress {
    from_port   = 6379
    to_port     = 6379
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

resource "aws_elasticache_replication_group" "this" {
  replication_group_id       = local.name
  description                = "${local.name} Redis"
  engine                     = "redis"
  node_type                  = "cache.t4g.small"
  num_cache_clusters         = 2
  automatic_failover_enabled = true
  multi_az_enabled           = true
  at_rest_encryption_enabled = true
  transit_encryption_enabled = true
  auth_token_update_strategy = "ROTATE"
  subnet_group_name          = aws_elasticache_subnet_group.this.name
  security_group_ids         = [aws_security_group.cache.id]
  snapshot_retention_limit   = 7
  apply_immediately          = false
  lifecycle { prevent_destroy = true }
}
