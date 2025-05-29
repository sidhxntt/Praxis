from django_elasticsearch_dsl import Document, Index, fields
from django_elasticsearch_dsl.registries import registry
from ..model.album import Album  # adjust if model path differs

# Define the Elasticsearch index
album_index = Index('albums')
album_index.settings(
    number_of_shards=1,
    number_of_replicas=0
)

@registry.register_document
class AlbumDocument(Document):
    user = fields.ObjectField(properties={
        'id': fields.IntegerField(),
        'username': fields.TextField(),
        'email': fields.TextField(),
    })

    class Index:
        name = 'albums'
        settings = {
            'number_of_shards': 1,
            'number_of_replicas': 0
        }

    class Django:
        model = Album  # The model associated with this Document
        fields = [
            'title',
            'category',
            'created_at',
            'updated_at',
        ]
