from django.urls import re_path

from .consumers import RoomConsumer

websocket_urlpatterns = [
    re_path(r"^ws/v1/rooms/(?P<room>[a-zA-Z0-9_-]{1,64})/$", RoomConsumer.as_asgi()),
]
