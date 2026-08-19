import os

from django.core.asgi import get_asgi_application
# @praxis:imports

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.production")
# @praxis:startup
application = get_asgi_application()
