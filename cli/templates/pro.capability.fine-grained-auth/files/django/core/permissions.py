from typing import Any

from rest_framework.permissions import BasePermission
from rest_framework.request import Request


class HasScopedPermission(BasePermission):
    """Require every permission declared by a view's required_permissions tuple."""

    def has_permission(self, request: Request, view: Any) -> bool:
        if not request.user or not request.user.is_authenticated:
            return False
        required_permissions = tuple(getattr(view, "required_permissions", ()))
        return request.user.has_perms(required_permissions)
