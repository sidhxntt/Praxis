def middlewares():
    return [
        'django_prometheus.middleware.PrometheusBeforeMiddleware',
        'django.middleware.security.SecurityMiddleware',
        'whitenoise.middleware.WhiteNoiseMiddleware',
        'django.contrib.sessions.middleware.SessionMiddleware',
        'corsheaders.middleware.CorsMiddleware',
        'django.middleware.common.CommonMiddleware',
        'django.middleware.csrf.CsrfViewMiddleware',
        'django.contrib.auth.middleware.AuthenticationMiddleware',
        'allauth.account.middleware.AccountMiddleware',
        'authentication.middleware.UserActivityMiddleware',
        'authentication.middleware.TimezoneMiddleware',
        'authentication.middleware.IPTrackingMiddleware',
        'django.contrib.messages.middleware.MessageMiddleware',
        'django.middleware.clickjacking.XFrameOptionsMiddleware',
        'core.utils.logging.api_audit.RequestLoggingMiddleware',
        'django_prometheus.middleware.PrometheusAfterMiddleware',
    ]
