from rest_framework import serializers
from ..model.address import Address
from .user import UserSerializer
from django.contrib.auth import get_user_model

User = get_user_model()
class AddressSerializer(serializers.ModelSerializer):
    """
    Serializer for Address model with full address formatting,
    nested user read, and user_id write support.
    """
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source='user',
        write_only=True,
        required=True
    )
    full_address = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Address
        fields = [
            'id', 'street', 'suite', 'city', 'state', 'zipcode',
            'country', 'user', 'user_id', 'full_address',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'full_address', 'user']
        extra_kwargs = {
            'street': {'required': True, 'trim_whitespace': True},
            'suite': {'required': False, 'trim_whitespace': True},
            'city': {'required': True, 'trim_whitespace': True},
            'state': {'required': False, 'trim_whitespace': True},
            'zipcode': {'required': True, 'trim_whitespace': True},
            'country': {'required': False, 'trim_whitespace': True},
        }

    def get_full_address(self, obj):
        """Returns the formatted full address using the model method."""
        return obj.address_info()

    def validate_zipcode(self, value):
        """Field-level validation for zipcode."""
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Zipcode cannot be empty.")
        return value

    def validate(self, data):
        """Object-level validation."""
        country = data.get('country', 'United States')
        state = data.get('state')

        # If country is not United States and state is None, set it to empty string
        if country != 'United States' and not state:
            data['state'] = ''
        return data

    def to_representation(self, instance):
        """Clean representation by removing null values like suite=None."""
        rep = super().to_representation(instance)
        rep['suite'] = rep.get('suite') or ""  # Replace null suite with empty string
        return rep
