variable "location" {
  type    = string
  default = "eastus2"
  validation {
    condition     = length(var.location) >= 4
    error_message = "location must be an Azure region name."
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
variable "monthly_budget_usd" {
  type    = number
  default = 500
  validation {
    condition     = var.monthly_budget_usd >= 10
    error_message = "monthly_budget_usd must be at least 10."
  }
}
variable "kubernetes_version" {
  type    = string
  default = "1.34"
}

variable "budget_contact_email" {
  type        = string
  description = "Email address for Azure budget alerts"
  validation {
    condition     = can(regex("^[^@]+@[^@]+\\.[^@]+$", var.budget_contact_email))
    error_message = "budget_contact_email must be a valid email address."
  }
}
