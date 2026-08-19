from django.core.cache import caches
from django.db import connection
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView


class LiveView(APIView):
    permission_classes = [AllowAny]
    authentication_classes: list[type] = []
    throttle_classes: list[type] = []

    def get(self, request: Request) -> Response:
        return Response({"status": "ok"})


class ReadyView(LiveView):
    def get(self, request: Request) -> Response:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            cursor.fetchone()
        caches["default"].get("praxis:readiness")
        return Response({"status": "ready"})


class StartupView(ReadyView):
    pass
