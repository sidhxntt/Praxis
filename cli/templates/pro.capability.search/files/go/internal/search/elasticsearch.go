package search

import (
	"context"
	"fmt"

	"github.com/elastic/go-elasticsearch/v9"
)

func Open(ctx context.Context, address string) (*elasticsearch.Client, error) {
	client, err := elasticsearch.NewClient(elasticsearch.Config{Addresses: []string{address}})
	if err != nil {
		return nil, fmt.Errorf("create Elasticsearch client: %w", err)
	}
	response, err := client.Ping(client.Ping.WithContext(ctx))
	if err != nil {
		return nil, fmt.Errorf("ping Elasticsearch: %w", err)
	}
	defer response.Body.Close()
	if response.IsError() {
		return nil, fmt.Errorf("ping Elasticsearch: %s", response.Status())
	}
	return client, nil
}
