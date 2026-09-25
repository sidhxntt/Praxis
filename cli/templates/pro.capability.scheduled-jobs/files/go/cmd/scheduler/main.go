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
	scheduler := asynq.NewScheduler(redisOption, nil)
	task, err := jobs.NewExampleTask(jobs.ExamplePayload{ResourceID: "scheduled-example"})
	if err != nil {
		log.Error("create scheduled task", "error", err)
		os.Exit(1)
	}
	if _, err := scheduler.Register("@every 5m", task); err != nil {
		log.Error("register scheduled task", "error", err)
		os.Exit(1)
	}
	if err := scheduler.Run(); err != nil {
		log.Error("scheduler stopped", "error", err)
		os.Exit(1)
	}
}
