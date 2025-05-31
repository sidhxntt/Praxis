import warnings

def warning_suppressor():
    messages = [
        r"app_settings.USERNAME_REQUIRED is deprecated, use: app_settings.SIGNUP_FIELDS\['username'\]\['required'\]",
        r"app_settings.EMAIL_REQUIRED is deprecated, use: app_settings.SIGNUP_FIELDS\['email'\]\['required'\]",
    ]
    for msg in messages:
        warnings.filterwarnings(
            "ignore",
            message=msg,
            module="dj_rest_auth.registration.serializers"
        )
