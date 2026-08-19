import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = "Idempotently seed the explicitly configured administrator account"

    def handle(self, *args: object, **options: object) -> None:
        email = os.getenv("SEED_ADMIN_EMAIL", "")
        password = os.getenv("SEED_ADMIN_PASSWORD", "")
        if not email or not password:
            raise CommandError("SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD are required")
        user_model = get_user_model()
        user, _ = user_model.objects.update_or_create(
            username=email,
            defaults={"email": email, "is_staff": True, "is_superuser": True},
        )
        user.set_password(password)
        user.save(update_fields=["password"])
        self.stdout.write(self.style.SUCCESS("Seed data applied"))
