from rest_framework import serializers
from ..model.post import Post 
from .user import UserSerializer
from django.contrib.auth import get_user_model

User = get_user_model()
class PostSerializer(serializers.ModelSerializer):
    """Serializer for Post model with user, summary, and validation"""

    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source='user',
        write_only=True,
        required=False
    )
    summary = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Post
        fields = [
            'id', 'title', 'body', 'summary',
            'user', 'user_id', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

        extra_kwargs = {
            'title': {'required': True, 'trim_whitespace': True},
            'body': {'required': True, 'trim_whitespace': True}
        }

    def get_summary(self, obj):
        """Get the summary from the model method"""
        return obj.summary()

    def validate_title(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Title cannot be empty.")
        return value

    def to_representation(self, instance):
        """Clean nulls or customize output if needed"""
        rep = super().to_representation(instance)
        return rep
