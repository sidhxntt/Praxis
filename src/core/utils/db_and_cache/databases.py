import os
import dj_database_url
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv('DATABASE_URL')

def database_connections(env):
    db_config = {
        'default': dj_database_url.parse(DATABASE_URL)
    }

    if env.get('prod') or env.get('stage'):
        db_config['default']['OPTIONS'] = {
            **db_config['default'].get('OPTIONS', {}),
            'sslmode': 'require',
        }

    if env.get('prod'):
        db_config['default']['ENGINE'] = 'django_db_geventpool.backends.postgresql_psycopg2'
        db_config['default']['CONN_MAX_AGE'] = 0  # Use 0 with geventpool
        db_config['default']['OPTIONS'] = {
            **db_config['default'].get('OPTIONS', {}),
            'MAX_CONNS': 20,
        }

    return db_config
