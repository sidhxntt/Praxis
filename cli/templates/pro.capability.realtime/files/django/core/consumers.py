import re

from channels.generic.websocket import AsyncJsonWebsocketConsumer

ROOM_PATTERN = re.compile(r"^[a-zA-Z0-9_-]{1,64}$")


class RoomConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self) -> None:
        room = self.scope["url_route"]["kwargs"]["room"]
        if not ROOM_PATTERN.fullmatch(room):
            await self.close(code=4400)
            return
        self.room_group_name = f"room.{room}"
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code: int) -> None:
        if hasattr(self, "room_group_name"):
            await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive_json(self, content: dict[str, object], **kwargs: object) -> None:
        message = content.get("message")
        if not isinstance(message, str) or not message or len(message) > 4096:
            await self.close(code=4400)
            return
        await self.channel_layer.group_send(
            self.room_group_name,
            {"type": "room.message", "message": message},
        )

    async def room_message(self, event: dict[str, object]) -> None:
        await self.send_json({"message": event["message"]})
