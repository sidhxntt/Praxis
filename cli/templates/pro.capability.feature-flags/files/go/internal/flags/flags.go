package flags

import (
	"context"

	"github.com/open-feature/go-sdk/openfeature"
)

type Client struct {
	client *openfeature.Client
}

func New() *Client {
	return &Client{client: openfeature.NewClient("{{projectName}}")}
}

func (client *Client) Enabled(ctx context.Context, key string, fallback bool, subject string) (bool, error) {
	evaluationContext := openfeature.NewEvaluationContext(subject, map[string]any{})
	return client.client.BooleanValue(ctx, key, fallback, evaluationContext)
}
