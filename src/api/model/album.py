from django.db import models
from django.utils.translation import gettext_lazy as _
from django.db.models.signals import post_save, pre_save, pre_delete, post_delete
from django.dispatch import receiver
from django.core.exceptions import ValidationError
from django.core.validators import MinLengthValidator
from .utils.TimestampMixin import TimestampMixin
from django.contrib.auth import get_user_model

User = get_user_model()
class Album(TimestampMixin):
    """
    Album model that stores album information
    with a foreign key relationship to a User.
    """
    title = models.CharField(
        max_length=255,
        validators=[
            MinLengthValidator(3, _("Album title must be at least 3 characters"))
        ],
        verbose_name=_("Album Title"),
        help_text=_("Unique title for your Album"),
        unique=True,
        default=_("My Photos")
    )
    category = models.CharField(
        max_length=50,
        validators=[
            MinLengthValidator(2, _("Category must be at least 2 characters"))
        ],
        verbose_name=_("Album Category"),
        help_text=_("What kind of pictures this album will contain"),
        default=_("Favourites"),
        blank=True,
        null=True
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='albums',
        verbose_name=_("User")
    )

    class Meta:
        verbose_name = _("Album")
        verbose_name_plural = _("Albums")
        indexes = [
            models.Index(fields=['category']),
            models.Index(fields=['title'])
        ]
        ordering = ['user__username']

    def __str__(self):
        """
        Provides a readable representation of the album.
        """
        return f"{self.title} ({self.category or 'Uncategorized'})"

    def album_info(self):
        """
        Return a formatted string with album metadata
        """
        return f"Album: {self.title} | Category: {self.category or 'Uncategorized'} | User: {self.user.username}"

    def clean(self):
        """
        Perform cross-field validation for the Album model.
        """
        errors = {}
        
        # Validate title uniqueness per user
        if Album.objects.filter(user=self.user, title=self.title).exclude(pk=self.pk).exists():
            errors['title'] = _("You already have an album with this title")
        
        # Validate that default title is only used once per user
        if self.title == "My Photos" and Album.objects.filter(
            user=self.user, title="My Photos"
        ).exclude(pk=self.pk).exists():
            errors['title'] = _("You can only have one default 'My Photos' album")
            
        # Raise all validation errors at once
        if errors:
            raise ValidationError(errors)
        
        super().clean()


# Signal handlers for Album model
@receiver(pre_save, sender=Album)
def album_pre_save_handler(sender, instance, **kwargs):
    """
    Normalize field data before saving
    """
    if instance.title:
        instance.title = instance.title.strip()
    
    if instance.category:
        instance.category = instance.category.capitalize()


@receiver(post_save, sender=Album)
def album_post_save_handler(sender, instance, created, **kwargs):
    """
    Log when an album is created or updated
    """
    action = 'New Album created' if created else 'Album updated'
    print(f'{action}: {instance.album_info()}')



@receiver(post_delete, sender=Album)
def album_post_delete_handler(sender, instance, **kwargs):
    """
    Log after album deletion
    """
    print(f'Album deleted for user: {instance.user.username}')