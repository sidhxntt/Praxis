from django_elasticsearch_dsl import Document, Index, fields
from django_elasticsearch_dsl.registries import registry
from ..model.post import Post  # adjust this import to match your project structure

# Define the Elasticsearch index
post_index = Index('posts')
post_index.settings(
    number_of_shards=1,
    number_of_replicas=0
)

@registry.register_document
class PostDocument(Document):
    user = fields.ObjectField(properties={
        'id': fields.IntegerField(),
        'username': fields.TextField(),
        'email': fields.TextField(),
    })

    class Index:
        name = 'posts'
        settings = {
            'number_of_shards': 1,
            'number_of_replicas': 0
        }

    class Django:
        model = Post
        fields = [
            'title',
            'body',
            'created_at',
            'updated_at',
        ]
