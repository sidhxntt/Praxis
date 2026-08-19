variable "region" {
  type        = string
  description = "AWS region"
  default     = "us-east-1"
  validation {
    condition     = can(regex("^[a-z]{2}-[a-z]+-[0-9]$", var.region))
    error_message = "region must be a valid AWS region."
  }
}

variable "environment" {
  type    = string
  default = "production"
  validation {
    condition     = contains(["staging", "production"], var.environment)
    error_message = "environment must be staging or production."
  }
}

variable "domain_name" {
  type        = string
  default     = ""
  description = "Optional application DNS name"
  validation {
    condition     = var.domain_name == "" || can(regex("^[a-z0-9.-]+$", var.domain_name))
    error_message = "domain_name must be empty or a DNS name."
  }
}

variable "monthly_budget_usd" {
  type    = number
  default = 500
  validation {
    condition     = var.monthly_budget_usd >= 10
    error_message = "monthly_budget_usd must be at least 10."
  }
}

variable "database_instance_class" {
  type    = string
  default = "db.t4g.medium"
}
variable "kubernetes_version" {
  type    = string
  default = "1.35"
}
