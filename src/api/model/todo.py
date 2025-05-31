from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinLengthValidator
from django.core.exceptions import ValidationError
from django.db.models.signals import post_save, pre_save, pre_delete, post_delete
from django.dispatch import receiver
from .utils.TimestampMixin import TimestampMixin
from django.contrib.auth import get_user_model

User = get_user_model()
class Todo(TimestampMixin):
    """
    A todo item representing a task for a user.
    """
    title = models.CharField(
        max_length=255,
        validators=[
            MinLengthValidator(3, _("Todo title must be at least 3 characters"))
        ],
        verbose_name=_("Title"),
        help_text=_("Title of the todo item")
    )
    completed = models.BooleanField(
        default=False,
        verbose_name=_("Completed"),
        help_text=_("Mark as completed")
    )
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='todos',
        verbose_name=_("User"),
        help_text=_("User this task belongs to")
    )

    class Meta:
        verbose_name = _("Todo")
        verbose_name_plural = _("Todos")
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['completed']),
            models.Index(fields=['user']),
        ]

    def __str__(self):
        """
        Provides a readable representation of the todo item.
        """
        return f"[{'✓' if self.completed else ' '}] {self.title}"
    
    def days_since_creation(self):
        """
        Returns the number of days since this todo was created.
        """
        from django.utils import timezone
        delta = timezone.now() - self.created_at
        return delta.days
    
    def clean(self):
        """
        Perform cross-field validation for the Todo model.
        """
        errors = {}
        
        # Check for duplicate active todos
        if not self.completed and Todo.objects.filter(
            user=self.user, 
            title__iexact=self.title, 
            completed=False
        ).exclude(pk=self.pk).exists():
            errors['title'] = _("You already have an active todo with this title")
        
        # Prevent completing a todo without updating it
        if self.pk and self.completed:
            original = Todo.objects.get(pk=self.pk)
            if not original.completed and self.title == original.title:
                errors['title'] = _("Please update the todo description when marking as completed")
        
        # Raise all validation errors at once
        if errors:
            raise ValidationError(errors)
        
        super().clean()


# Signal handlers for Todo model
@receiver(pre_save, sender=Todo)
def todo_pre_save_handler(sender, instance, **kwargs):
    """
    Normalize field data before saving
    """
    if instance.title:
        instance.title = instance.title.strip()
        
        # Capitalize first letter of title
        if instance.title:
            instance.title = instance.title[0].upper() + instance.title[1:]


@receiver(post_save, sender=Todo)
def todo_post_save_handler(sender, instance, created, **kwargs):
    """
    Log when a todo is created or updated
    """
    if created:
        print(f'New Todo created: "{instance.title}" for {instance.user.username}')
    else:
        status = "completed" if instance.completed else "updated"
        print(f'Todo {status}: "{instance.title}" for {instance.user.username}')


@receiver(pre_delete, sender=Todo)
def todo_pre_delete_handler(sender, instance, **kwargs):
    """
    Log before todo deletion
    """
    status = "completed" if instance.completed else "incomplete"
    print(f'About to delete {status} todo: "{instance.title}" for {instance.user.username}')


@receiver(post_delete, sender=Todo)
def todo_post_delete_handler(sender, instance, **kwargs):
    """
    Log after todo deletion
    """
    print(f'Todo deleted: "{instance.title}" for {instance.user.username}')