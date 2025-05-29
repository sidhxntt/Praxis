from ..models import Todo
from ..serializer.todo import TodoSerializer
from .baseView import BaseModelViewSet
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page

class TodoViewSet(BaseModelViewSet):
    serializer_class = TodoSerializer
    queryset = Todo.objects.select_related('user').all()
    filterset_fields = ['completed']
    search_fields = ['title']
    ordering_fields = ['id','created_at', 'title', 'completed']
    ordering = ['-created_at']

    def perform_create(self, serializer):
        """
        Set the user automatically when creating a todo item
        """
        serializer.save(user=self.request.user)
        
    @method_decorator(cache_page(60 * 5))  # Cache for 5 minutes
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)