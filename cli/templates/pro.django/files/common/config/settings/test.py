from .base import *  # noqa: F403

SECRET_KEY = "test-only-secret-key"  # noqa: S105  # nosec B105 -- test-only setting
ALLOWED_HOSTS = ["testserver"]
DATABASES = {"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}}
PASSWORD_HASHERS = ["django.contrib.auth.hashers.MD5PasswordHasher"]
CACHES = {"default": {"BACKEND": "django.core.cache.backends.locmem.LocMemCache"}}
