package cache

import (
	"context"
	"fmt"

	"github.com/redis/go-redis/v9"
)

type Client struct {
	client *redis.Client
}

func Open(ctx context.Context, rawURL string) (*Client, error) {
	if rawURL == "" {
		rawURL = "redis://localhost:6379/0"
	}
	options, err := redis.ParseURL(rawURL)
	if err != nil {
		return nil, fmt.Errorf("parse Redis URL: %w", err)
	}
	client := redis.NewClient(options)
	wrapped := &Client{client: client}
	if err := wrapped.Ping(ctx); err != nil {
		_ = client.Close()
		return nil, fmt.Errorf("verify Redis connection: %w", err)
	}
	return wrapped, nil
}

func (client *Client) Ping(ctx context.Context) error {
	return client.client.Ping(ctx).Err()
}

func (client *Client) Close() error {
	return client.client.Close()
}
