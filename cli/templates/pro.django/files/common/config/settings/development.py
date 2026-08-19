from .base import *  # noqa: F403

DEBUG = True
SECRET_KEY = SECRET_KEY or "local-development-only-secret-key"  # noqa: F405, S105
ALLOWED_HOSTS = ALLOWED_HOSTS or ["localhost", "127.0.0.1"]  # noqa: F405
