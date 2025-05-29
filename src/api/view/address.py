from ..models import Address
from ..serializer.address import AddressSerializer
from .baseView import BaseModelViewSet

class AddressViewSet(BaseModelViewSet):
    serializer_class = AddressSerializer
    queryset = Address.objects.select_related('user').all()
    filterset_fields = ['city', 'state', 'zipcode', 'country']
    search_fields = ['street', 'city', 'zipcode']
    ordering_fields = ['created_at', 'city', 'state', 'zipcode']
    ordering = ['-created_at']