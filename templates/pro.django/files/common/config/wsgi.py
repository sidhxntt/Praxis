import os

from django.core.wsgi import get_wsgi_application
# @praxis:imports

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.production")
# @praxis:startup
application = get_wsgi_application()
