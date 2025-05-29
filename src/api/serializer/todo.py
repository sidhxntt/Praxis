from rest_framework import serializers
from ..model.todo import Todo 
from .user import UserSerializer
from django.contrib.auth import get_user_model

User = get_user_model()
class TodoSerializer(serializers.ModelSerializer):
    """
    Serializer for the Todo model with user info and computed status display.
    """
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source='user',
        write_only=True,
        required=False
    )
    status_display = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Todo
        fields = [
            'id', 'title', 'completed', 'status_display',
            'user', 'user_id', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

        extra_kwargs = {
            'title': {'required': True, 'trim_whitespace': True},
        }

    def get_status_display(self, obj):
        """Display 'Completed' or 'Pending'."""
        return "Completed" if obj.completed else "Pending"

    def validate_title(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Title cannot be empty.")
        return value

    def to_representation(self, instance):
        """Clean up the serialized output."""
        rep = super().to_representation(instance)
        return rep
