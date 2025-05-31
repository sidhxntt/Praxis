from django_elasticsearch_dsl import Document, Index, fields
from django_elasticsearch_dsl.registries import registry
from ..model.todo import  Todo  

# Define the Elasticsearch index
todo_index = Index('todos')
todo_index.settings(
    number_of_shards=1,
    number_of_replicas=0
)

@registry.register_document
class TodoDocument(Document):
    user = fields.ObjectField(properties={
        'id': fields.IntegerField(),
        'username': fields.TextField(),
        'email': fields.TextField(),
    })

    class Index:
        name = 'todos'
        settings = {
            'number_of_shards': 1,
            'number_of_replicas': 0
        }

    class Django:
        model = Todo
        fields = [
            'title',
            'completed',
            'created_at',
            'updated_at',
        ]
