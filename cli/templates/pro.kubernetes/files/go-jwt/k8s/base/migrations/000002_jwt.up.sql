CREATE TABLE revoked_jwt (
    jti text PRIMARY KEY,
    expires_at timestamptz NOT NULL,
    revoked_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX revoked_jwt_expires_at_idx ON revoked_jwt (expires_at);
