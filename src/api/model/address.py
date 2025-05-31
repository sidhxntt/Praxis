from django.db import models
from django.utils.translation import gettext_lazy as _
from django.db.models.signals import post_save, pre_save, pre_delete, post_delete, pre_migrate, post_migrate
from django.dispatch import receiver
from django.core.exceptions import ValidationError
from .utils.TimestampMixin import TimestampMixin
from django.core.validators import MinLengthValidator, RegexValidator
from django.contrib.auth import get_user_model

User = get_user_model()
class Address(TimestampMixin):
    """
    Stores the user's address information with a one-to-one relationship to User.
    """
    street = models.CharField(
        max_length=255,
        validators=[
            MinLengthValidator(5, _("Street address must be at least 5 characters")),
            RegexValidator(
                regex=r'\d',
                message=_("Street address must include a street number")
            )
        ],
        verbose_name=_("Street Address"),
        help_text=_("Street name and number")
    )
    suite = models.CharField(
        max_length=255,
        validators=[MinLengthValidator(5, _("Suite must be at least 5 characters"))],
        verbose_name=_("Suite/Apt"),
        help_text=_("Apartment, suite, unit, etc."),
        blank=True,
        null=True
    )
    city = models.CharField(
        max_length=255,
        validators=[MinLengthValidator(2, _("City must be at least 2 characters"))],
        verbose_name=_("City")
    )
    zipcode = models.CharField(
        max_length=20,
        validators=[
            MinLengthValidator(5, _("Zipcode must be at least 5 characters")),
            RegexValidator(
                regex=r'^\d+$',
                message=_("Zipcode must contain only digits")
            )
        ],
        verbose_name=_("ZIP/Postal Code")
    )
    state = models.CharField(
        max_length=100,
        validators=[MinLengthValidator(2, _("State must be at least 2 characters"))],
        verbose_name=_("State/Province"),
        blank=True,
        null=True
    )
    country = models.CharField(
        max_length=100,
        validators=[MinLengthValidator(2, _("Country must be at least 2 characters"))],
        verbose_name=_("Country"),
        default="United States"
    )

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='address',
        verbose_name=_("User")
    )
    
    def clean(self):
        """
        Perform cross-field validation for the Address model.
        This method validates relationships between different fields
        and enforces business rules that involve multiple fields.
        """
        errors = {}
        
        # Validate zipcode format based on country
        if self.country == "United States" and self.zipcode:
            if not (self.zipcode.isdigit() and (len(self.zipcode) == 5 or len(self.zipcode) == 9)):
                errors['zipcode'] = _("US zip codes must be either 5 or 9 digits")
        
        # Validate state requirements
        if self.country == "United States" and not self.state:
            errors['state'] = _("State is required for US addresses")
        
        # Validate city-state relationship
        if self.city and self.city.lower() == "new york" and self.state != "NY":
            errors['state'] = _("The city New York must be in state NY")
        
        # Check for consistent relationship between suite and street
        if self.suite and not self.street:
            errors['street'] = _("Street address is required when suite is provided")
        
        # Check for logical city-zipcode relationship
        if self.zipcode and self.zipcode.startswith('100') and self.city.lower() != "new york":
            errors['city'] = _("Zipcode starting with 100 must be in New York City")
        
        # Add more business rules as needed
        
        # Raise all validation errors at once
        if errors:
            raise ValidationError(errors)
        
        # Always call parent's clean method
        super().clean()
    class Meta:
        verbose_name = _("Address")
        verbose_name_plural = _("Addresses")
        ordering = ['user__username']
        indexes = [
            models.Index(fields=['zipcode']),
            models.Index(fields=['city', 'state']),
        ]

    def __str__(self):
        """
        Provides a readable representation of the address.
        """
        return f"{self.street}, {self.city}, {self.state or ''} {self.zipcode}"

    def address_info(self):
        """
        Return a formatted full address.
        """
        parts = [self.street]
        if self.suite:
            parts.append(f"Suite {self.suite}")
        city_state_zip = ", ".join(filter(None, [self.city, self.state, self.zipcode]))
        parts.append(city_state_zip)
        parts.append(self.country)
        return ", ".join(parts)


# Signal handlers for Address model
@receiver(pre_save, sender=Address)
def address_pre_save_handler(sender, instance, **kwargs):
    """
    Normalize field data before saving
    """
    if instance.city:
        instance.city = instance.city.title()
    
    if instance.state:
        instance.state = instance.state.upper()


@receiver(post_save, sender=Address)
def address_post_save_handler(sender, instance, created, **kwargs):
    """
    Log when an address is created or updated
    """
    action = 'New Address created' if created else 'Address updated'
    print(f'{action}: {instance.address_info()}')


@receiver(pre_delete, sender=Address)
def address_pre_delete_handler(sender, instance, **kwargs):
    """
    Log before address deletion
    """
    print(f'About to delete address: {instance.address_info()}')


@receiver(post_delete, sender=Address)
def address_post_delete_handler(sender, instance, **kwargs):
    """
    Log after address deletion
    """
    print(f'Address record deleted for user: {instance.user.username}')


# Application-level migration signals
@receiver(pre_migrate)
def before_migrate_handler(sender, **kwargs):
    """
    Log before migrations
    """
    app_label = kwargs.get('app_config').label if kwargs.get('app_config') else 'unknown'
    print(f'Starting migrations for app: {app_label}')


@receiver(post_migrate)
def after_migrate_handler(sender, **kwargs):
    """
    Log after migrations
    """
    app_label = kwargs.get('app_config').label if kwargs.get('app_config') else 'unknown'
    print(f'Completed migrations for app: {app_label}')