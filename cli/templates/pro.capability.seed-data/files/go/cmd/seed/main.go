package main

import (
	"context"
	"log/slog"
	"os"

	"example.com/{{projectName}}/internal/config"
	"example.com/{{projectName}}/internal/database"
)

func main() {
	log := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	value := os.Getenv("SEED_METADATA_VALUE")
	if value == "" {
		log.Error("SEED_METADATA_VALUE is required")
		os.Exit(1)
	}
	cfg, err := config.Load()
	if err != nil {
		log.Error("invalid configuration", "error", err)
		os.Exit(1)
	}
	pool, err := database.Open(context.Background(), cfg.DatabaseURL)
	if err != nil {
		log.Error("database startup failed", "error", err)
		os.Exit(1)
	}
	defer pool.Close()
	_, err = pool.Exec(context.Background(), `
		INSERT INTO service_metadata (key, value)
		VALUES ('seed', $1)
		ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()
	`, value)
	if err != nil {
		log.Error("seed failed", "error", err)
		os.Exit(1)
	}
	log.Info("seed data applied")
}
