package jobs

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/hibiken/asynq"
)

const TypeExample = "example:process"

type ExamplePayload struct {
	ResourceID string `json:"resource_id"`
}

func EnqueueExample(client *asynq.Client, payload ExamplePayload) (*asynq.TaskInfo, error) {
	encoded, err := json.Marshal(payload)
	if err != nil {
		return nil, fmt.Errorf("encode example task: %w", err)
	}
	return client.Enqueue(
		asynq.NewTask(TypeExample, encoded),
		asynq.MaxRetry(5),
		asynq.Timeout(5*time.Minute),
		asynq.Unique(5*time.Minute),
	)
}

func HandleExample(ctx context.Context, task *asynq.Task) error {
	var payload ExamplePayload
	if err := json.Unmarshal(task.Payload(), &payload); err != nil {
		return fmt.Errorf("decode example task: %w: %v", asynq.SkipRetry, err)
	}
	if payload.ResourceID == "" {
		return fmt.Errorf("resource_id is required: %w", asynq.SkipRetry)
	}
	return nil
}
