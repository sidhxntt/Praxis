# documents.py

from django_elasticsearch_dsl import Document, Index, fields
from django_elasticsearch_dsl.registries import registry
from ..model.address import Address

# Define Elasticsearch index
address_index = Index('addresses')
address_index.settings(
    number_of_shards=1,
    number_of_replicas=0
)

@registry.register_document
class AddressDocument(Document):
    user_username = fields.TextField(attr='user.username')  # Denormalize username

    class Index:
        name = 'addresses'

    class Django:
        model = Address
        fields = [
            'street',
            'suite',
            'city',
            'zipcode',
            'state',
            'country',
            'created_at',   # from TimestampMixin
            'updated_at',   # from TimestampMixin
        ]
