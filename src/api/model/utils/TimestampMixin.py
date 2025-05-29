from django.db import models
from django.utils.translation import gettext_lazy as _
from django.utils import timezone

class TimestampMixin(models.Model):
    created_at = models.DateTimeField(
           default=timezone.now,
           verbose_name=_("Created At")
        )
    updated_at = models.DateTimeField(
           auto_now=True,
           verbose_name=_("Updated At")
        )

    class Meta:
        abstract = True
