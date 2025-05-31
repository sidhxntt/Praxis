from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.core.validators import EmailValidator, URLValidator, RegexValidator
from django.utils.translation import gettext_lazy as _
from django.db.models.signals import post_save, pre_save, post_delete
from django.dispatch import receiver
from django.utils import timezone
import uuid
import logging
from .tasks import send_welcome_email

# Setup logger
logger = logging.getLogger(__name__)

class UserManager(BaseUserManager):
    """
    Custom user manager with comprehensive user creation and validation.
    Provides password hashing, email normalization, and validation.
    """
    def create_user(self, email, password=None, **extra_fields):
        """
        Creates and saves a User with the given email and password.
        """
        if not email:
            raise ValueError(_('The Email field must be set'))
        
        email = self.normalize_email(email)
        
        # Set default active status
        extra_fields.setdefault('is_active', True)
        
        # Set a default role if not provided
        if not extra_fields.get('role'):
            extra_fields.setdefault('role', 'user')
            
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """
        Creates and saves a superuser with the given email and password.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'admin')
        extra_fields.setdefault('is_active', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))
        
        return self.create_user(email, password, **extra_fields)
    
    def get_by_natural_key(self, email):
        """
        Enable authentication with case-insensitive email.
        """
        return self.get(email__iexact=email)


class User(AbstractBaseUser, PermissionsMixin):
    """
    Production-grade custom user model with comprehensive fields and validation.
    
    AbstractBaseUser: Basic user model with password management
    PermissionsMixin: Provides permissions & groups support
    """
    # Core identity fields
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(
        _('email address'),
        unique=True,
        validators=[EmailValidator(message=_("Enter a valid email address."))]
    )
    username = models.CharField(
        _('username'),
        max_length=150, 
        unique=True, 
        null=True, 
        blank=True,
        validators=[
            RegexValidator(
                regex=r'^[\w.@+-]+$',
                message=_("Enter a valid username. This value may contain only letters, "
                          "numbers, and @/./+/-/_ characters.")
            ),
        ]
    )
    
    # Contact information
    phone = models.CharField(
        _('phone number'),
        max_length=20, 
        unique=True, 
        null=True, 
        blank=True,
        validators=[
            RegexValidator(
                regex=r'^\+?1?\d{9,15}$',
                message=_("Phone number must be entered in the format: '+999999999'. "
                          "Up to 15 digits allowed.")
            ),
        ]
    )
    website = models.URLField(
        _('website'),
        unique=True, 
        null=True, 
        blank=True,
        validators=[URLValidator(message=_("Enter a valid URL."))]
    )
    
    # Personal information
    first_name = models.CharField(_('first name'), max_length=150, null=True, blank=True)
    last_name = models.CharField(_('last name'), max_length=150, null=True, blank=True)
    full_name = models.CharField(_('full name'), max_length=300, null=True, blank=True)
    
    # Profile information
    bio = models.TextField(_('biography'), max_length=500, null=True, blank=True)
    profile_image = models.ImageField(
        _('profile image'), 
        upload_to='profile_images/', 
        null=True, 
        blank=True
    )
    
    # Role and permissions
    ROLE_CHOICES = (
        ('admin', _('Administrator')),
        ('staff', _('Staff')),
        ('user', _('Regular User')),
    )
    role = models.CharField(
        _('role'),
        max_length=20, 
        choices=ROLE_CHOICES,
        default='user'
    )
    is_active = models.BooleanField(
        _('active status'),
        default=True,
        help_text=_('Designates whether this user should be treated as active. '
                   'Unselect this instead of deleting accounts.')
    )
    is_staff = models.BooleanField(
        _('staff status'),
        default=False,
        help_text=_('Designates whether the user can log into this admin site.')
    )
    
    # Account metadata
    date_joined = models.DateTimeField(_('date joined'), default=timezone.now)
    last_login = models.DateTimeField(_('last login'), null=True, blank=True)
    last_updated = models.DateTimeField(_('last updated'), auto_now=True)
    
    # Account security
    email_verified = models.BooleanField(_('email verified'), default=False)
    failed_login_attempts = models.PositiveIntegerField(_('failed login attempts'), default=0)
    last_failed_login = models.DateTimeField(_('last failed login'), null=True, blank=True)
    
    # Password management
    password_changed = models.DateTimeField(_('password last changed'), null=True, blank=True)
    password_reset_token = models.CharField(_('password reset token'), max_length=100, null=True, blank=True)
    password_reset_expires = models.DateTimeField(_('password reset expiration'), null=True, blank=True)
    
    # Account settings
    email_notifications = models.BooleanField(_('email notifications'), default=True)
    timezone = models.CharField(max_length=50, default='UTC')
    last_active = models.DateTimeField(null=True, blank=True)
    account_locked = models.BooleanField(default=False)
    account_locked_at = models.DateTimeField(null=True, blank=True)
    email_verification_token = models.CharField(max_length=100, null=True, blank=True)
    email_verification_sent = models.DateTimeField(null=True, blank=True)
    
    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    
    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')
        ordering = ['-date_joined']
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['username']),
            models.Index(fields=['is_active']),
            models.Index(fields=['role']),
        ]
        constraints = [
        models.UniqueConstraint(
            fields=['email'],
            name='unique_case_insensitive_email',
            # For PostgreSQL only - add this for case-insensitive constraint
            # For other databases, use the application-level validation
            # Remove this if not using PostgreSQL
            condition=models.Q(is_active=True)  # Optional: only enforce for active users
        )
    ]
    
    def __str__(self):
        """String representation of user"""
        return self.email
    
    def save(self, *args, **kwargs):
        """
        Override save method to perform additional operations:
        - Generate full_name from first_name and last_name if not provided
        - Normalize email address
        """
        # Auto-generate full_name if first_name and last_name are available
        if self.first_name and self.last_name and not self.full_name:
            self.full_name = f"{self.first_name} {self.last_name}"
        
        # Normalize email
        if self.email:
            self.email = self.email.lower().strip()
            
        # Generate username from email if not provided
        if not self.username and self.email:
            base_username = self.email.split('@')[0]
            username = base_username
            counter = 1
            
            # Check if username exists and generate a unique one
            while User.objects.filter(username=username).exclude(id=self.id).exists():
                username = f"{base_username}{counter}"
                counter += 1
            
            self.username = username
            
        super().save(*args, **kwargs)
    
    def get_full_name(self):
        """
        Return the full name if available, otherwise return email
        """
        if self.full_name:
            return self.full_name
        elif self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name}"
        return self.email
    
    def get_short_name(self):
        """
        Return the short name for the user.
        """
        return self.first_name if self.first_name else self.email.split('@')[0]
    
    def email_user(self, subject, message, from_email=None, **kwargs):
        """
        Send an email to this user
        """
        from django.core.mail import send_mail
        send_mail(subject, message, from_email, [self.email], **kwargs)
    
    def has_role(self, role):
        """
        Check if the user has a specific role
        """
        return self.role == role
    
    def lock_account(self):
        """
        Lock the account after too many failed login attempts
        """
        self.is_active = False
        self.save(update_fields=['is_active'])
        
    def register_failed_login(self):
        """
        Register a failed login attempt
        """
        self.failed_login_attempts += 1
        self.last_failed_login = timezone.now()
        self.save(update_fields=['failed_login_attempts', 'last_failed_login'])
        
        # Lock account after 5 failed attempts
        if self.failed_login_attempts >= 5:
            self.lock_account()
    
    def reset_failed_login_attempts(self):
        """
        Reset failed login attempts counter
        """
        if self.failed_login_attempts > 0:
            self.failed_login_attempts = 0
            self.save(update_fields=['failed_login_attempts'])


# Signal handlers for User model
@receiver(pre_save, sender=User)
def user_pre_save_handler(sender, instance, **kwargs):
    """
    Operations to perform before saving a user
    """
    # Check if this is a password change
    if instance.pk:
        try:
            old_instance = User.objects.get(pk=instance.pk)
            if old_instance.password != instance.password:
                instance.password_changed = timezone.now()
        except User.DoesNotExist:
            pass
    
    logger.debug(f"Pre-save operations for user: {instance.email}")

@receiver(post_save, sender=User)
def user_post_save_handler(sender, instance, created, **kwargs):
    """
    Operations to perform after saving a user
    - Send welcome email for new users
    - Create related models if needed
    """
    if created:
        logger.info(f"New user created: {instance.email} with role {instance.role}")
        # Queue email notification with Celery
        send_welcome_email.delay(
            user_id=str(instance.id),
            email=instance.email,
            full_name=instance.get_full_name()
        )
    else:
        logger.debug(f"User updated: {instance.email}")



@receiver(post_delete, sender=User)
def user_post_delete_handler(sender, instance, **kwargs):
    """
    Operations to perform after deleting a user
    - Clean up related data
    - Log the deletion
    """
    logger.info(f"User deleted: {instance.email}")
    
    # Clean up profile image if exists
    if instance.profile_image:
        try:
            storage, path = instance.profile_image.storage, instance.profile_image.path
            storage.delete(path)
        except Exception as e:
            logger.error(f"Error deleting profile image: {e}")


# Add to authentication/models.py

class UserIPAddress(models.Model):
    """
    Tracks IP addresses used by users for security monitoring.
    """
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='ip_addresses',
        verbose_name=_("User")
    )
    ip_address = models.GenericIPAddressField(
        _("IP Address"),
        help_text=_("IP address used by the user")
    )
    first_seen = models.DateTimeField(
        _("First Seen"),
        auto_now_add=True,
        help_text=_("When this IP was first used by this user")
    )
    last_seen = models.DateTimeField(
        _("Last Seen"),
        auto_now=True,
        help_text=_("When this IP was last used by this user")
    )
    use_count = models.PositiveIntegerField(
        _("Use Count"),
        default=1,
        help_text=_("Number of times this IP has been used by this user")
    )
    is_suspicious = models.BooleanField(
        _("Suspicious"),
        default=False,
        help_text=_("Marked as suspicious by system")
    )
    country = models.CharField(
        _("Country"),
        max_length=100,
        null=True,
        blank=True,
        help_text=_("Country derived from IP address")
    )
    city = models.CharField(
        _("City"),
        max_length=100,
        null=True,
        blank=True,
        help_text=_("City derived from IP address")
    )
    
    class Meta:
        verbose_name = _("User IP Address")
        verbose_name_plural = _("User IP Addresses")
        ordering = ['-last_seen']
        unique_together = ['user', 'ip_address']
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['ip_address']),
            models.Index(fields=['last_seen']),
        ]
    
    def __str__(self):
        return f"{self.user.email} - {self.ip_address}"
    
    def save(self, *args, **kwargs):
        # If first time saving, try to determine location
        if not self.pk and (not self.country or not self.city):
            self.geolocate_ip()
        super().save(*args, **kwargs)
    
    def geolocate_ip(self):
        """
        Attempt to determine the location of the IP address.
        Requires the geoip2 library and maxmind database.
        """
        try:
            from django.contrib.gis.geoip2 import GeoIP2
            g = GeoIP2()
            geo_data = g.city(self.ip_address)
            if geo_data:
                self.country = geo_data.get('country_name')
                self.city = geo_data.get('city')
        except Exception as e:
            logger.error(f"Error geolocating IP {self.ip_address}: {str(e)}")