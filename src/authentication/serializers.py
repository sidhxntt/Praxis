from rest_framework import serializers
from .models import User
from django.contrib.auth.password_validation import validate_password
from django.core import exceptions

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'first_name', 'last_name', 'full_name',
            'phone', 'website', 'bio', 'role', 'is_active', 'date_joined',
            'last_login', 'email_verified'
        ]
        read_only_fields = ['id', 'date_joined', 'last_login', 'email_verified']

class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    
    class Meta:
        model = User
        fields = ['email', 'password', 'first_name', 'last_name']
        
    def validate(self, data):
        user = User(**data)
        password = data.get('password')
        
        try:
            validate_password(password, user)
        except exceptions.ValidationError as e:
            raise serializers.ValidationError({'password': list(e.messages)})
            
        return data
        
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()
    new_password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    token = serializers.CharField(write_only=True)

class EmailVerificationSerializer(serializers.Serializer):
    token = serializers.CharField()

class UserActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['last_login', 'last_active']
        read_only_fields = fields