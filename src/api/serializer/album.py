from rest_framework import serializers
from ..model.album import Album 
from .user import UserSerializer
from django.contrib.auth import get_user_model

User = get_user_model()
class AlbumSerializer(serializers.ModelSerializer):
    """
    Serializer for Album model with album metadata,
    nested user read, and user_id write support.
    """
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source='user',
        write_only=True,
        required=True
    )
    album_info = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Album
        fields = [
            'id',
            'title',
            'category',
            'user',  
            'user_id',
            'album_info',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
        extra_kwargs = {
            'title': {'required': True, 'trim_whitespace': True},
            'category': {'required': False, 'trim_whitespace': True}
        }

    def get_album_info(self, obj):
        """Returns the formatted album metadata."""
        return obj.album_info()

    def to_representation(self, instance):
        """Clean representation by replacing null category with empty string."""
        rep = super().to_representation(instance)
        rep['category'] = rep.get('category') or ""
        return rep
