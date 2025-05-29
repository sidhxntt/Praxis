from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)
from . import views
from .oauth.github import GitHubLogin
from .oauth.google import GoogleLogin

urlpatterns = [
    # Core & Home
    path('', views.home_view, name='home'),
    path('', include('django_prometheus.urls')),

    # Admin
    path('admin/', admin.site.urls),

    # Authentication
    path('auth/', include('dj_rest_auth.urls')),
    path('auth/registration/', include('dj_rest_auth.registration.urls')),
    path('auth/social/', include('allauth.socialaccount.urls')),
    path('auth/github/', GitHubLogin.as_view(), name='github_login'),
    path('auth/google/', GoogleLogin.as_view(), name='google_login'),

    # App-specific
    path('accounts/', include('authentication.urls')),  # Renamed from 'auth/'
    path('api/', include('api.urls')),

    # JWT Token
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),

    # Schema & Docs
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

    # Webhooks
    # re_path(r'webhook/lemonsqueezy/?$', views.lemonsqueezy_webhook, name='lemonsqueezy-webhook'),

]
