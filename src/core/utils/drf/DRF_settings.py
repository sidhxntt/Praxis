def DRF(env):
    is_prod = env.get('prod', False)

    # Authentication classes:
    # - Prod: JWT only (and cookie JWT)
    # - Dev: JWT + Token + Session for browsable API
    if is_prod:
        authentication_classes = [
            'rest_framework_simplejwt.authentication.JWTAuthentication',
            'dj_rest_auth.jwt_auth.JWTCookieAuthentication',
        ]
        renderer_classes = [
            'rest_framework.renderers.JSONRenderer',
        ]
    else:
        authentication_classes = [
            'rest_framework_simplejwt.authentication.JWTAuthentication',
            'rest_framework.authentication.TokenAuthentication',
            'rest_framework.authentication.SessionAuthentication',
            'dj_rest_auth.jwt_auth.JWTCookieAuthentication',
        ]
        renderer_classes = [
            'rest_framework.renderers.JSONRenderer',
            'rest_framework.renderers.BrowsableAPIRenderer',
        ]

    return {
        'DEFAULT_PERMISSION_CLASSES': [
            'rest_framework.permissions.IsAuthenticated',
        ],
        'DEFAULT_AUTHENTICATION_CLASSES': authentication_classes,
        'DEFAULT_RENDERER_CLASSES': renderer_classes,
        'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
        'PAGE_SIZE': 20,
        'DEFAULT_FILTER_BACKENDS': [
            'django_filters.rest_framework.DjangoFilterBackend',
            'rest_framework.filters.SearchFilter',
            'rest_framework.filters.OrderingFilter',
        ],
        'DEFAULT_THROTTLE_CLASSES': [
            'rest_framework.throttling.AnonRateThrottle',
            'rest_framework.throttling.UserRateThrottle',
        ],
        'DEFAULT_THROTTLE_RATES': {
            'anon': '100/hour',
            'user': '1000/hour',
        },
        'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
        'EXCEPTION_HANDLER': 'core.utils.logging.exception_handler.custom_exception_handler',
    }
