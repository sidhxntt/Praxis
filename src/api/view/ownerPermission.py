
from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission that allows read access to anyone but restricts write operations to the object's owner
    Checks if the request method is safe (GET, HEAD, OPTIONS) or if the requesting user owns the object
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed for any request
        if request.method in permissions.SAFE_METHODS:
            return True
        # Write permissions are only allowed to the owner
        return obj.user == request.user