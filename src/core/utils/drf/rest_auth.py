def auth(env):
    return {
        # Serializers
        'LOGIN_SERIALIZER': 'dj_rest_auth.serializers.LoginSerializer',
        'TOKEN_SERIALIZER': 'dj_rest_auth.serializers.TokenSerializer',
        'USER_DETAILS_SERIALIZER': 'dj_rest_auth.serializers.UserDetailsSerializer',
        'PASSWORD_RESET_SERIALIZER': 'dj_rest_auth.serializers.PasswordResetSerializer',
        'PASSWORD_RESET_CONFIRM_SERIALIZER': 'dj_rest_auth.serializers.PasswordResetConfirmSerializer',
        'PASSWORD_CHANGE_SERIALIZER': 'dj_rest_auth.serializers.PasswordChangeSerializer',
        'REGISTER_SERIALIZER': 'dj_rest_auth.registration.serializers.RegisterSerializer',

        # Permissions
        'REGISTER_PERMISSION_CLASSES': ('rest_framework.permissions.AllowAny',),

        # Session & Login
        'SESSION_LOGIN': True,
        'LOGOUT_ON_PASSWORD_CHANGE': False,

        # Token/JWT toggle
        'USE_JWT': env.get('prod'),

        # When using JWT in dj-rest-auth, these control how cookies are managed
        # but we’ll keep them `None` so they don’t interfere unless explicitly set
        'JWT_AUTH_COOKIE': 'access' if env.get('prod') else None,
        'JWT_AUTH_REFRESH_COOKIE': 'refresh' if env.get('prod') else None,
        'JWT_AUTH_COOKIE_USE_CSRF': False,
        'JWT_AUTH_COOKIE_ENFORCE_CSRF_ON_UNAUTHENTICATED': False,
    }