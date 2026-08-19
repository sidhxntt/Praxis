from dataclasses import dataclass
from datetime import datetime
from typing import Protocol


@dataclass(frozen=True)
class IdempotencyKey:
    key: str
    request_fingerprint: str
    response_status: int
    response_body: bytes
    expires_at: datetime


class IdempotencyKeyStore(Protocol):
    """Implement atomically with PostgreSQL or Redis before protecting mutation endpoints."""

    def get(self, key: str) -> IdempotencyKey | None: ...

    def put_if_absent(self, record: IdempotencyKey) -> bool: ...
