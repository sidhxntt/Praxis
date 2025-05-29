from rest_framework import serializers
from ..model.images import Image, Album
from .user import UserSerializer
from .album import AlbumSerializer
from django.contrib.auth import get_user_model

User = get_user_model()
class ImageSerializer(serializers.ModelSerializer):
    """
    Serializer for Image model with image info formatting,
    nested user and album read, and user_id/album_id write support.
    """
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source='user',
        write_only=True,
        required=True
    )
    
    album = AlbumSerializer(read_only=True)
    album_id = serializers.PrimaryKeyRelatedField(
        queryset=Album.objects.all(),
        source='album',
        write_only=True,
        required=True
    )
    image_info = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Image
        fields = [
            'id', 'title', 'url', 'thumbnail_url',
            'user', 'user_id',
            'album', 'album_id',
            'image_info',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'user', 'album', 'image_info']
        extra_kwargs = {
            'title': {'required': True, 'trim_whitespace': True},
            'url': {'required': True},
            'thumbnail_url': {'required': True},
        }

    def get_image_info(self, obj):
        """Returns formatted image info from model method."""
        return obj.get_image_info()

    def to_representation(self, instance):
        """Clean representation by removing any nulls (if needed)."""
        rep = super().to_representation(instance)
        rep['thumbnail_url'] = rep.get('thumbnail_url') or ""
        return rep
