package idempotency

import (
	"context"
	"time"
)

type Record struct {
	Key                string
	RequestFingerprint string
	ResponseStatus     int
	ResponseBody       []byte
	ExpiresAt          time.Time
}

type Store interface {
	Get(context.Context, string) (Record, bool, error)
	PutIfAbsent(context.Context, Record) (bool, error)
}
