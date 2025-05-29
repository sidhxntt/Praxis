# api/urls.py
from django.urls import path, include  # Added the include import
from rest_framework.routers import DefaultRouter
from .views import AlbumViewSet, ImageViewSet, AddressViewSet, PostViewSet, TodoViewSet

router = DefaultRouter()
router.register('albums', AlbumViewSet) 
router.register('images', ImageViewSet)
router.register('posts', PostViewSet)
router.register('todos', TodoViewSet)
router.register('addresses', AddressViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

