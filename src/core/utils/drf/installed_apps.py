
import os

def installed_apps():
    # Core Django applications
    DJANGO_APPS = [
        'django.contrib.admin',
        'django.contrib.auth',
        'django.contrib.contenttypes',
        'django.contrib.sessions',
        'django.contrib.messages',
        'django.contrib.staticfiles',
        'django.contrib.sites', 
    ]

    # Third-party apps
    THIRD_PARTY_APPS = [
        # REST & Auth
        'rest_framework',
        'rest_framework_simplejwt',
        'rest_framework.authtoken',
        'dj_rest_auth',
        'dj_rest_auth.registration',
        'allauth',
        'allauth.account',
        'allauth.socialaccount',
        'allauth.socialaccount.providers.google',
        'allauth.socialaccount.providers.github',

        # Utilities & Monitoring
        'corsheaders',
        'django_filters',
        'django_redis',
        'storages',
        'whitenoise.runserver_nostatic',
        'drf_spectacular',
        'django_prometheus',

        # Health Checks
        'health_check',
        'health_check.db',
        'health_check.cache',
        'health_check.storage',

        # Celery
        'django_celery_results',
    ]

    # Optionally include Elasticsearch DSL
    if os.getenv("ENABLE_ELASTICSEARCH").lower() == "true":
        THIRD_PARTY_APPS.append('django_elasticsearch_dsl')

    # Local (project-specific) apps
    LOCAL_APPS = [
        'authentication',
        'api',
    ]

    return DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

