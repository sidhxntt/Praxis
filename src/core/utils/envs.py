import os
from dotenv import load_dotenv
from django.core.exceptions import ImproperlyConfigured

load_dotenv()

def get_env_value(env_variable, default=None):
    try:
        return os.getenv(env_variable, default)
    except KeyError:
        if default is not None:
            return default
        error_msg = f'Set the {env_variable} environment variable'
        raise ImproperlyConfigured(error_msg)
    

ENVIRONMENT = get_env_value('DJANGO_ENV', 'development')
PRODUCTION = ENVIRONMENT == 'production'
STAGING = ENVIRONMENT == 'staging'
TESTING = ENVIRONMENT == 'testing'
DEVELOPMENT = ENVIRONMENT == 'development'


def get_env_stage():
    envs = {
        'env': ENVIRONMENT,
        'prod': PRODUCTION,
        'stage': STAGING,
        'test': TESTING,
        'dev': DEVELOPMENT,
    }
    return envs
