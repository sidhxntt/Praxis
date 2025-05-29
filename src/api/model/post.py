from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinLengthValidator
from django.core.exceptions import ValidationError
from django.db.models.signals import post_save, pre_save, pre_delete, post_delete
from django.dispatch import receiver
from .utils.TimestampMixin import TimestampMixin
from django.contrib.auth import get_user_model

User = get_user_model()
class Post(TimestampMixin):
    """
    Blog post model associated with a user.
    """
    title = models.CharField(
        max_length=255,
        validators=[
            MinLengthValidator(5, _("Post title must be at least 5 characters"))
        ],
        verbose_name=_("Title"),
        help_text=_("Title of the blog post")
    )
    body = models.TextField(
        validators=[
            MinLengthValidator(20, _("Post body must be at least 20 characters"))
        ],
        verbose_name=_("Body"),
        help_text=_("Main content of the post")
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='posts',
        verbose_name=_("Author"),
        help_text=_("User who created the post")
    )

    class Meta:
        verbose_name = _("Post")
        verbose_name_plural = _("Posts")
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['title']),
            models.Index(fields=['user']),
        ]

    def __str__(self):
        """
        Provides a readable representation of the post.
        """
        return f"{self.title} by {self.user.username}"

    def summary(self):
        """
        Return the first 100 characters of the post body.
        """
        return self.body[:100] + "..." if len(self.body) > 100 else self.body
    
    def word_count(self):
        """
        Return the number of words in the post body.
        """
        return len(self.body.split())

    def clean(self):
        """
        Perform cross-field validation for the Post model.
        """
        errors = {}
        
        # Check for title in body
        if self.title and self.body and self.title.lower() not in self.body.lower():
            errors['body'] = _("Post body should contain the title somewhere in the content")
        
        # Validate minimum word count
        if self.body and len(self.body.split()) < 10:
            errors['body'] = _("Post must contain at least 10 words")
        
        # Check for duplicate titles by same user
        if Post.objects.filter(user=self.user, title=self.title).exclude(pk=self.pk).exists():
            errors['title'] = _("You already have a post with this title")
        
        # Raise all validation errors at once
        if errors:
            raise ValidationError(errors)
        
        super().clean()


# Signal handlers for Post model
@receiver(pre_save, sender=Post)
def post_pre_save_handler(sender, instance, **kwargs):
    """
    Normalize field data before saving
    """
    if instance.title:
        instance.title = instance.title.strip()
        
        # Capitalize first letter of each word in title
        instance.title = instance.title.title()


@receiver(post_save, sender=Post)
def post_post_save_handler(sender, instance, created, **kwargs):
    """
    Log when a post is created or updated
    """
    action = 'New Post created' if created else 'Post updated'
    word_count = len(instance.body.split())
    print(f'{action}: "{instance.title}" by {instance.user.username} ({word_count} words)')


@receiver(pre_delete, sender=Post)
def post_pre_delete_handler(sender, instance, **kwargs):
    """
    Log before post deletion
    """
    print(f'About to delete post: "{instance.title}" by {instance.user.username}')


@receiver(post_delete, sender=Post)
def post_post_delete_handler(sender, instance, **kwargs):
    """
    Log after post deletion
    """
    print(f'Post deleted: "{instance.title}" by {instance.user.username}')