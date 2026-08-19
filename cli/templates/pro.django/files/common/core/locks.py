from collections.abc import Iterator
from contextlib import AbstractContextManager, contextmanager
from typing import Protocol


class DistributedLock(Protocol):
    """Lease-based lock contract; implementations must use fencing tokens and bounded TTLs."""

    def acquire(self, name: str, ttl_seconds: int) -> AbstractContextManager[int]: ...


@contextmanager
def critical_section(lock: DistributedLock, name: str, ttl_seconds: int = 30) -> Iterator[int]:
    with lock.acquire(name, ttl_seconds) as fencing_token:
        yield fencing_token
