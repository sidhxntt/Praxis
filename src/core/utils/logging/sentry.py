import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration
from django.core.exceptions import ImproperlyConfigured
import os

SENTRY_DSN = os.getenv('SENTRY_DSN')

def sentry ():
    if SENTRY_DSN:
        try:
            sentry_sdk.init(
                dsn=SENTRY_DSN,
                integrations=[DjangoIntegration()],
                traces_sample_rate=0.2 if os.getenv('DJANGO_ENV') == 'production' else 1.0,
                enable_tracing=True,
                send_default_pii=True,
                environment=os.getenv('DJANGO_ENV', 'development'),
                
                # Optional advanced configuration
                _experiments={
                    "profiles_sample_rate": 0.1,
                },
                
                # Release tracking (optional)
                release=os.getenv('RELEASE_VERSION', '1.0.0'),
                
                # Ignore specific exceptions (optional)
                ignore_errors=[KeyboardInterrupt],
            )
        except Exception as e:
            if os.getenv('DJANGO_ENV') == 'production':
                raise ImproperlyConfigured(f"Failed to initialize Sentry: {str(e)}")
            # In development, just print the error
            print(f"Sentry initialization error: {str(e)}")
