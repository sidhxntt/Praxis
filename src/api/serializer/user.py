from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()
class UserSerializer(serializers.ModelSerializer):
    """Minimal nested user representation."""
    
    class Meta:
        model = User
        fields = ['id', 'username']
        read_only_fields = ['id', 'username']