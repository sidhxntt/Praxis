from celery import shared_task
from django.conf import settings
from django.core.mail import send_mail


@shared_task(  # type: ignore[misc]
    autoretry_for=(Exception,),
    retry_backoff=True,
    retry_backoff_max=300,
    retry_jitter=True,
    max_retries=5,
    acks_late=True,
)
def send_email_task(subject: str, body: str, recipient: str) -> int:
    return send_mail(subject, body, settings.DEFAULT_FROM_EMAIL, [recipient], fail_silently=False)
