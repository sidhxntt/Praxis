import logging
import time
import uuid
from collections.abc import Callable

from django.http import HttpRequest, HttpResponse

request_log = logging.getLogger("praxis.http")


class CorrelationIdMiddleware:
    def __init__(self, get_response: Callable[[HttpRequest], HttpResponse]) -> None:
        self.get_response = get_response

    def __call__(self, request: HttpRequest) -> HttpResponse:
        correlation_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
        started = time.monotonic()
        response = self.get_response(request)
        response["X-Request-ID"] = correlation_id
        fields = {
            "request_id": correlation_id,
            "method": request.method,
            "path": request.path,
            "status": response.status_code,
            "duration_ms": round((time.monotonic() - started) * 1000),
        }
        request_log.info("http request", extra={"structured_fields": fields})
        if request.path.startswith("/api/v1/auth/") and response.status_code in {401, 403}:
            request_log.warning(
                "authentication rejected",
                extra={"structured_fields": fields | {"event_type": "security.auth_failure"}},
            )
        return response
