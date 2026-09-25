package locks

import (
	"context"
	"time"
)

type Lease interface {
	FencingToken() uint64
	Release(context.Context) error
}

type DistributedLock interface {
	Acquire(context.Context, string, time.Duration) (Lease, error)
}
