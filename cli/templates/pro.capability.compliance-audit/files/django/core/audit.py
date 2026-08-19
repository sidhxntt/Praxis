import logging
from collections.abc import Callable
from datetime import UTC, datetime

from django.http import HttpRequest, HttpResponse

MUTATING_METHODS = frozenset({"POST", "PUT", "PATCH", "DELETE"})
audit_log = logging.getLogger("praxis.audit")


class AuditMiddleware:
    def __init__(self, get_response: Callable[[HttpRequest], HttpResponse]) -> None:
        self.get_response = get_response

    def __call__(self, request: HttpRequest) -> HttpResponse:
        response = self.get_response(request)
        if request.method in MUTATING_METHODS:
            user = getattr(request, "user", None)
            actor = str(user.pk) if user is not None and user.is_authenticated else "anonymous"
            event = {
                "event_type": "audit.http_mutation",
                "timestamp": datetime.now(UTC).isoformat(),
                "request_id": response.get(
                    "X-Request-ID", request.headers.get("X-Request-ID", "unknown")
                ),
                "actor": actor,
                "method": request.method,
                "path": request.path,
                "status": response.status_code,
            }
            audit_log.info("audit event", extra={"audit_event": event})
        return response
