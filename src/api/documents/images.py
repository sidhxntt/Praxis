from django_elasticsearch_dsl import Document, Index, fields
from django_elasticsearch_dsl.registries import registry
from ..model.images import Image  # adjust path based on your project layout

# Define the index
image_index = Index('images')
image_index.settings(
    number_of_shards=1,
    number_of_replicas=0
)

@registry.register_document
class ImageDocument(Document):
    user = fields.ObjectField(properties={
        'id': fields.IntegerField(),
        'username': fields.TextField(),
        'email': fields.TextField(),
    })
    album = fields.ObjectField(properties={
        'id': fields.IntegerField(),
        'title': fields.TextField(),
        'category': fields.TextField(),
    })

    class Index:
        name = 'images'
        settings = {
            'number_of_shards': 1,
            'number_of_replicas': 0
        }

    class Django:
        model = Image
        fields = [
            'title',
            'url',
            'thumbnail_url',
            'created_at',
            'updated_at',
        ]
