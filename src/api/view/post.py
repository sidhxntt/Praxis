from ..models import Post
from ..serializer.post import PostSerializer
from .baseView import BaseModelViewSet
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page

class PostViewSet(BaseModelViewSet):
    serializer_class = PostSerializer
    queryset = Post.objects.select_related('user').all()
    filterset_fields = []
    search_fields = ['title', 'body']
    ordering_fields = ['created_at', 'title']
    ordering = ['-created_at']

    @method_decorator(cache_page(60 * 5))  # Cache for 5 minutes
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
