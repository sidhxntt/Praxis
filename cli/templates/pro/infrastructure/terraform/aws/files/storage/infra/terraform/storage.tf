resource "aws_s3_bucket" "application" {
  bucket = "${local.name}-${data.aws_caller_identity.current.account_id}"
  lifecycle { prevent_destroy = true }
}

data "aws_caller_identity" "current" {}

resource "aws_s3_bucket_public_access_block" "application" {
  bucket                  = aws_s3_bucket.application.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_versioning" "application" {
  bucket = aws_s3_bucket.application.id
  versioning_configuration { status = "Enabled" }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "application" {
  bucket = aws_s3_bucket.application.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = "aws:kms"
      kms_master_key_id = aws_kms_key.this.arn
    }
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "application" {
  bucket = aws_s3_bucket.application.id
  rule {
    id     = "expire-noncurrent"
    status = "Enabled"
    filter {}
    noncurrent_version_expiration { noncurrent_days = 90 }
  }
}
