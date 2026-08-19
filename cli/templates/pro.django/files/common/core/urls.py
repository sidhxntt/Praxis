from django.urls import path

from .views import LiveView, ReadyView, StartupView

urlpatterns = [
    path("health/live", LiveView.as_view(), name="health-live"),
    path("health/ready", ReadyView.as_view(), name="health-ready"),
    path("health/startup", StartupView.as_view(), name="health-startup"),
]
