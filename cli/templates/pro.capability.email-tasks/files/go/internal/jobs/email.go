package jobs

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"strconv"
	"time"

	"github.com/hibiken/asynq"
	mail "github.com/wneessen/go-mail"
)

const TypeEmail = "email:send"

type EmailPayload struct {
	To      string `json:"to"`
	Subject string `json:"subject"`
	Body    string `json:"body"`
}

func NewEmailTask(payload EmailPayload) (*asynq.Task, error) {
	encoded, err := json.Marshal(payload)
	if err != nil {
		return nil, fmt.Errorf("encode email task: %w", err)
	}
	return asynq.NewTask(TypeEmail, encoded), nil
}

func EnqueueEmail(client *asynq.Client, payload EmailPayload) (*asynq.TaskInfo, error) {
	task, err := NewEmailTask(payload)
	if err != nil {
		return nil, err
	}
	return client.Enqueue(task, asynq.MaxRetry(5), asynq.Timeout(time.Minute), asynq.Queue("default"))
}

func HandleEmail(ctx context.Context, task *asynq.Task) error {
	var payload EmailPayload
	if err := json.Unmarshal(task.Payload(), &payload); err != nil {
		return fmt.Errorf("decode email task: %w: %v", asynq.SkipRetry, err)
	}
	if payload.To == "" || payload.Subject == "" {
		return fmt.Errorf("recipient and subject are required: %w", asynq.SkipRetry)
	}
	port, err := strconv.Atoi(environment("SMTP_PORT", "1025"))
	if err != nil {
		return fmt.Errorf("invalid SMTP_PORT: %w", asynq.SkipRetry)
	}
	message := mail.NewMsg()
	if err := message.From(environment("EMAIL_FROM", "noreply@example.com")); err != nil {
		return fmt.Errorf("set sender: %w", asynq.SkipRetry)
	}
	if err := message.To(payload.To); err != nil {
		return fmt.Errorf("set recipient: %w", asynq.SkipRetry)
	}
	message.Subject(payload.Subject)
	message.SetBodyString(mail.TypeTextPlain, payload.Body)
	tlsPolicy := mail.NoTLS
	if environment("SMTP_USE_TLS", "false") == "true" {
		tlsPolicy = mail.TLSMandatory
	}
	options := []mail.Option{mail.WithPort(port), mail.WithTLSPolicy(tlsPolicy)}
	if username := os.Getenv("SMTP_USERNAME"); username != "" {
		options = append(options, mail.WithUsername(username), mail.WithPassword(os.Getenv("SMTP_PASSWORD")))
	}
	client, err := mail.NewClient(environment("SMTP_HOST", "localhost"), options...)
	if err != nil {
		return fmt.Errorf("create SMTP client: %w", err)
	}
	if err := client.DialAndSendWithContext(ctx, message); err != nil {
		return fmt.Errorf("send email: %w", err)
	}
	return nil
}

func environment(key string, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}
