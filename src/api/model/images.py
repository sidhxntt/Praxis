from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinLengthValidator, URLValidator
from django.core.exceptions import ValidationError
from django.db.models.signals import post_save, pre_save, pre_delete, post_delete
from django.dispatch import receiver
from .album import Album
from .utils.TimestampMixin import TimestampMixin
from django.contrib.auth import get_user_model

User = get_user_model()
class Image(TimestampMixin):
    """
    Stores an image belonging to an album.
    """
    title = models.CharField(
        max_length=255,
        validators=[
            MinLengthValidator(3, _("Image title must be at least 3 characters"))
        ],
        verbose_name=_("Title"),
        help_text=_("Title or caption for the image")
    )
    url = models.URLField(
        validators=[
            URLValidator(message=_("Please enter a valid URL"))
        ],
        verbose_name=_("Image URL"),
        help_text=_("URL to the full-size image")
    )
    thumbnail_url = models.URLField(
        validators=[
            URLValidator(message=_("Please enter a valid thumbnail URL"))
        ],
        verbose_name=_("Thumbnail URL"),
        help_text=_("URL to the thumbnail version of the image")
    )

    album = models.ForeignKey(
        Album,
        on_delete=models.CASCADE,
        related_name='images',
        verbose_name=_("Album"),
        help_text=_("The album this image belongs to")
    )
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='images',
        verbose_name=_("User"),
        help_text=_("The User this image belongs to")
    )

    class Meta:
        verbose_name = _("Image")
        verbose_name_plural = _("Images")
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['album']),
            models.Index(fields=['title']),
        ]

    def __str__(self):
        """
        Provides a readable representation of the image.
        """
        return f"{self.title} (Album: {self.album.title})"

    def get_image_info(self):
        """
        Returns a dictionary of the image details.
        """
        return {
            "title": self.title,
            "url": self.url,
            "thumbnail_url": self.thumbnail_url,
            "album": self.album.title,
            "user": self.user.username
        }

    def clean(self):
        """
        Perform cross-field validation for the Image model.
        """
        errors = {}
        
        # Ensure the user owns the album
        if self.album and self.user and self.album.user.id != self.user.id:
            errors['album'] = _("You can only add images to your own albums")
        
        # Ensure URLs are different
        if self.url == self.thumbnail_url:
            errors['thumbnail_url'] = _("Thumbnail URL should be different from the main image URL")
        
        # Validate image URLs have common image extensions
        valid_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
        if self.url and not any(self.url.lower().endswith(ext) for ext in valid_extensions):
            errors['url'] = _("URL must point to an image file (jpg, png, etc.)")
        
        if self.thumbnail_url and not any(self.thumbnail_url.lower().endswith(ext) for ext in valid_extensions):
            errors['thumbnail_url'] = _("Thumbnail URL must point to an image file")
        
        # Raise all validation errors at once
        if errors:
            raise ValidationError(errors)
        
        super().clean()


# Signal handlers for Image model
@receiver(pre_save, sender=Image)
def image_pre_save_handler(sender, instance, **kwargs):
    """
    Normalize field data before saving
    """
    if instance.title:
        instance.title = instance.title.strip().title()
    
    # Ensure user consistency between album and image
    if instance.album and not instance.user_id:
        instance.user = instance.album.user


@receiver(post_save, sender=Image)
def image_post_save_handler(sender, instance, created, **kwargs):
    """
    Log when an image is created or updated
    """
    action = 'New Image uploaded' if created else 'Image updated'
    print(f'{action}: {instance.title} in album {instance.album.title}')


@receiver(pre_delete, sender=Image)
def image_pre_delete_handler(sender, instance, **kwargs):
    """
    Log before image deletion
    """
    print(f'About to delete image: {instance.title} from album {instance.album.title}')


@receiver(post_delete, sender=Image)
def image_post_delete_handler(sender, instance, **kwargs):
    """
    Log after image deletion
    """
    print(f'Image deleted: {instance.title} by user: {instance.user.username}')