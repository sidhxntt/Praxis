import os

def elasti(BASE_DIR):
    if os.getenv("ENABLE_ELASTICSEARCH", "True").lower() == "true":
        ELASTICSEARCH_HOST = os.getenv('ELASTICSEARCH_HOST')
        ELASTICSEARCH_PORT = int(os.getenv('ELASTICSEARCH_PORT'))
        ELASTICSEARCH_USERNAME = os.getenv('ELASTICSEARCH_USERNAME')
        ELASTICSEARCH_PASSWORD = os.getenv('ELASTICSEARCH_PASSWORD')

        return {
            'default': {
                'hosts': f'https://{ELASTICSEARCH_HOST}:{ELASTICSEARCH_PORT}',
                'basic_auth': (ELASTICSEARCH_USERNAME, ELASTICSEARCH_PASSWORD), 
                'ca_certs': os.path.join(BASE_DIR, 'http_ca.crt'),
            }
        }