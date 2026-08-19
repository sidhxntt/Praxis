package main

import (
	"log/slog"
	"os"

	"example.com/{{projectName}}/internal/jobs"
	"github.com/hibiken/asynq"
)

func main() {
	log := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	redisURL := os.Getenv("REDIS_URL")
	if redisURL == "" {
		redisURL = "redis://localhost:6379/0"
	}
	redisOption, err := asynq.ParseRedisURI(redisURL)
	if err != nil {
		log.Error("invalid Redis URL", "error", err)
		os.Exit(1)
	}
	server := asynq.NewServer(redisOption, asynq.Config{
		Concurrency: 10,
		Queues:      map[string]int{"critical": 6, "default": 3, "low": 1},
	})
	mux := asynq.NewServeMux()
	mux.HandleFunc(jobs.TypeExample, jobs.HandleExample)
	if err := server.Run(mux); err != nil {
		log.Error("worker stopped", "error", err)
		os.Exit(1)
	}
}
