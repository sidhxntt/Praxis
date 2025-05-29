# authentication/managers.py
import logging
from django.contrib.auth.models import BaseUserManager
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
import uuid

logger = logging.getLogger(__name__)


class EmailVerificationManager:
    """
    Manager for handling email verification operations.
    """
    @staticmethod
    def generate_verification_token():
        """Generate a unique token for email verification"""
        return uuid.uuid4().hex
    
    @staticmethod
    def create_verification_link(request, token):
        """Create a verification URL with the given token"""
        from django.urls import reverse
        verify_url = reverse('verify_email', kwargs={'token': token})
        return f"{request.scheme}://{request.get_host()}{verify_url}"
    
    @staticmethod
    def send_verification_email(user, request):
        """Send verification email to a user"""
        from .tasks import send_email_verification
        
        # Generate verification token
        token = EmailVerificationManager.generate_verification_token()
        
        # Save token to user
        user.email_verification_token = token
        user.email_verification_sent = timezone.now()
        user.save(update_fields=['email_verification_token', 'email_verification_sent'])
        
        # Create verification URL
        verification_url = EmailVerificationManager.create_verification_link(request, token)
        
        # Send email via Celery
        send_email_verification.delay(
            user_id=str(user.id),
            email=user.email,
            verification_token=token,
            verification_url=verification_url
        )
        
        return True


class PasswordResetManager:
    """
    Manager for handling password reset operations.
    """
    @staticmethod
    def generate_reset_token():
        """Generate a unique token for password reset"""
        return uuid.uuid4().hex
    
    @staticmethod
    def create_reset_link(request, token):
        """Create a reset URL with the given token"""
        from django.urls import reverse
        reset_url = reverse('password_reset_confirm', kwargs={'token': token})
        return f"{request.scheme}://{request.get_host()}{reset_url}"
    
    @staticmethod
    def send_reset_email(user, request):
        """Send password reset email to a user"""
        from .tasks import send_password_reset_email
        
        # Generate reset token
        token = PasswordResetManager.generate_reset_token()
        
        # Set expiry time (24 hours from now)
        expiry = timezone.now() + timezone.timedelta(hours=24)
        
        # Save token and expiry to user
        user.password_reset_token = token
        user.password_reset_expires = expiry
        user.save(update_fields=['password_reset_token', 'password_reset_expires'])
        
        # Create reset URL
        reset_url = PasswordResetManager.create_reset_link(request, token)
        
        # Send email via Celery
        send_password_reset_email.delay(
            user_id=str(user.id),
            email=user.email,
            reset_token=token,
            reset_url=reset_url
        )
        
        return True
    
    @staticmethod
    def is_token_valid(user, token):
        """Check if a password reset token is valid"""
        if not user.password_reset_token:
            return False
        
        if user.password_reset_token != token:
            return False
        
        if not user.password_reset_expires:
            return False
        
        if timezone.now() > user.password_reset_expires:
            return False
        
        return True


class SecurityManager:
    """
    Manager for handling security-related operations.
    """
    @staticmethod
    def lock_account_and_notify(user):
        """Lock an account and send notification email"""
        from .tasks import send_account_locked_notification
        
        # Lock account
        user.is_active = False
        user.account_locked = True
        user.account_locked_at = timezone.now()
        user.save(update_fields=['is_active', 'account_locked', 'account_locked_at'])
        
        # Send notification
        send_account_locked_notification.delay(
            user_id=str(user.id),
            email=user.email
        )
        
        logger.warning(f"Account locked for user: {user.email}")
        return True
    
    @staticmethod
    def unlock_account(user):
        """Unlock a previously locked account"""
        user.is_active = True
        user.account_locked = False
        user.account_locked_at = None
        user.failed_login_attempts = 0
        user.save(update_fields=['is_active', 'account_locked', 'account_locked_at', 'failed_login_attempts'])
        
        logger.info(f"Account unlocked for user: {user.email}")
        return True