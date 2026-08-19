variable "project_id" {
  type    = string
  default = "your-project-id"
  validation {
    condition     = can(regex("^[a-z][a-z0-9-]{4,28}[a-z0-9]$", var.project_id))
    error_message = "project_id must be a valid GCP project ID."
  }
}
variable "region" {
  type    = string
  default = "us-central1"
  validation {
    condition     = can(regex("^[a-z]+-[a-z]+[0-9]$", var.region))
    error_message = "region must be a valid GCP region."
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
variable "billing_account_id" {
  type    = string
  default = ""
}
variable "monthly_budget_usd" {
  type    = number
  default = 500
  validation {
    condition     = var.monthly_budget_usd >= 10
    error_message = "monthly_budget_usd must be at least 10."
  }
}
