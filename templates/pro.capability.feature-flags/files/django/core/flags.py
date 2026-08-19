from django.http import HttpRequest
from waffle import flag_is_active


def is_enabled(request: HttpRequest, name: str) -> bool:
    """Evaluate a database-managed flag with Waffle's user/group/percentage rules."""
    return bool(flag_is_active(request, name))
