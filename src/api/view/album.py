from ..models import Album
from ..serializer.album import AlbumSerializer
from .baseView import BaseModelViewSet
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page

class AlbumViewSet(BaseModelViewSet):
    serializer_class = AlbumSerializer
    queryset = Album.objects.select_related('user')
    filterset_fields = ['category']
    search_fields = ['title']
    ordering_fields = ['created_at', 'title', 'category']
    ordering = ['-created_at']
    
    @method_decorator(cache_page(60 * 15))  # Cache for 15 minutes
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)