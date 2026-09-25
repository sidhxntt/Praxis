package auth

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

type PostgresRevocationStore struct {
	pool *pgxpool.Pool
}

func NewPostgresRevocationStore(pool *pgxpool.Pool) *PostgresRevocationStore {
	return &PostgresRevocationStore{pool: pool}
}

func (store *PostgresRevocationStore) Revoke(ctx context.Context, jti string, expiresAt time.Time) error {
	_, err := store.pool.Exec(ctx, `
		INSERT INTO revoked_jwt (jti, expires_at) VALUES ($1, $2)
		ON CONFLICT (jti) DO NOTHING
	`, jti, expiresAt)
	return err
}

func (store *PostgresRevocationStore) IsRevoked(ctx context.Context, jti string) (bool, error) {
	var revoked bool
	err := store.pool.QueryRow(ctx, `SELECT EXISTS(SELECT 1 FROM revoked_jwt WHERE jti = $1 AND expires_at > now())`, jti).Scan(&revoked)
	return revoked, err
}
