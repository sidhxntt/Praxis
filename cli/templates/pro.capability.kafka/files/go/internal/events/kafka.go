package events

import (
	"context"
	"crypto/tls"
	"encoding/json"
	"errors"
	"os"
	"strings"

	"github.com/twmb/franz-go/pkg/kgo"
	"github.com/twmb/franz-go/pkg/sasl/plain"
)

func NewClient() (*kgo.Client, error) {
	brokers := strings.Split(environment("KAFKA_BROKERS", "localhost:19092"), ",")
	options := []kgo.Opt{kgo.SeedBrokers(brokers...), kgo.ClientID("{{projectName}}")}
	if group := os.Getenv("KAFKA_GROUP_ID"); group != "" {
		options = append(options, kgo.ConsumerGroup(group))
	}
	if username := os.Getenv("KAFKA_USERNAME"); username != "" {
		options = append(options, kgo.SASL(plain.Auth{User: username, Pass: os.Getenv("KAFKA_PASSWORD")}.AsMechanism()))
	}
	if os.Getenv("KAFKA_TLS") == "true" {
		options = append(options, kgo.DialTLSConfig(new(tls.Config))) // #nosec G402 -- system roots and TLS 1.2+ Go defaults
	}
	return kgo.NewClient(options...)
}

func Publish(ctx context.Context, client *kgo.Client, key string, payload any) error {
	encoded, err := json.Marshal(payload)
	if err != nil {
		return err
	}
	record := &kgo.Record{Topic: environment("KAFKA_TOPIC", "application-events"), Key: []byte(key), Value: encoded}
	return client.ProduceSync(ctx, record).FirstErr()
}

func Consume(ctx context.Context, client *kgo.Client, handle func(context.Context, []byte) error) error {
	client.AddConsumeTopics(environment("KAFKA_TOPIC", "application-events"))
	for {
		fetches := client.PollFetches(ctx)
		if err := fetches.Err(); err != nil {
			if errors.Is(err, context.Canceled) {
				return nil
			}
			return err
		}
		var handleErr error
		fetches.EachRecord(func(record *kgo.Record) {
			if handleErr == nil {
				handleErr = handle(ctx, record.Value)
			}
		})
		if handleErr != nil {
			return handleErr
		}
		if err := client.CommitRecords(ctx, fetches.Records()...); err != nil {
			return err
		}
	}
}

func environment(key string, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}
