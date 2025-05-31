from rest_framework import viewsets
from .ownerPermission import IsOwnerOrReadOnly

class BaseModelViewSet(viewsets.ModelViewSet):
    """
    Base viewset with common configurations (middlewares).
    """
    permission_classes = [IsOwnerOrReadOnly]
    
    def get_queryset(self):
        """
        This ensures that users can only see their own data by default.
        Override in child classes as needed.
        """
        model = self.queryset.model
        if hasattr(model, 'user'):
            return self.queryset.filter(user=self.request.user)
        return self.queryset