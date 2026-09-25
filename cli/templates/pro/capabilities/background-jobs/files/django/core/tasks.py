from celery import shared_task


@shared_task(  # type: ignore[misc]
    autoretry_for=(Exception,),
    retry_backoff=True,
    retry_backoff_max=300,
    retry_jitter=True,
    max_retries=5,
    acks_late=True,
)
def example_task(resource_id: str) -> dict[str, str]:
    """Idempotent example: replace with an upsert keyed by resource_id."""
    return {"resource_id": resource_id, "status": "processed"}
