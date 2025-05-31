from ..models import Image
from ..serializer.images import ImageSerializer
from .baseView import BaseModelViewSet
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page

class ImageViewSet(BaseModelViewSet):
    serializer_class = ImageSerializer
    queryset = Image.objects.select_related('album', 'user', 'album__user').all()
    filterset_fields = ['album']
    search_fields = ['title', 'album__title']
    ordering_fields = ['id', 'created_at', 'title', 'album__title']
    ordering = ['-created_at']

    def get_queryset(self):
        """
        Users can view images in albums they have access to
        """
        return Image.objects.select_related('album', 'user').filter(
            user=self.request.user
        )
        
    @method_decorator(cache_page(60 * 15))  # Cache for 15 minutes
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)