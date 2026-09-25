package config

import (
	"fmt"
	"os"
	"strings"

	"github.com/go-playground/validator/v10"
)

type Config struct {
	Environment    string `validate:"required,oneof=development test production"`
	DatabaseURL    string `validate:"required,url"`
	HTTPAddress    string `validate:"required"`
	TrustedProxies []string
}

func Load() (Config, error) {
	cfg := Config{
		Environment:    env("APP_ENV", "development"),
		DatabaseURL:    env("DATABASE_URL", "postgres://app:app@localhost:5432/app?sslmode=disable"),
		HTTPAddress:    env("HTTP_ADDRESS", ":8080"),
		TrustedProxies: split(os.Getenv("TRUSTED_PROXIES")),
	}
	if cfg.Environment == "production" && len(cfg.TrustedProxies) == 0 {
		return Config{}, fmt.Errorf("TRUSTED_PROXIES is required in production")
	}
	if err := validator.New().Struct(cfg); err != nil {
		return Config{}, fmt.Errorf("validate configuration: %w", err)
	}
	return cfg, nil
}

func env(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}

func split(value string) []string {
	if strings.TrimSpace(value) == "" {
		return nil
	}
	parts := strings.Split(value, ",")
	result := make([]string, 0, len(parts))
	for _, part := range parts {
		result = append(result, strings.TrimSpace(part))
	}
	return result
}
