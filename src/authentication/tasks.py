from celery import shared_task
from django.template.loader import render_to_string
from django.core.mail import send_mail
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

@shared_task
def send_welcome_email(user_id, email, full_name):
    """
    Send a welcome email to newly registered users.
    
    Args:
        user_id (str): UUID of the created user
        email (str): Email address of the user
        full_name (str): Full name of the user for personalization
    """
    try:
        subject = "Welcome to Our Platform!"
        
        # Using template for better email formatting
        context = {
            'full_name': full_name,
            'user_id': user_id,
        }
        
        # You can choose to use templates or a simple text message
        # If templates aren't set up yet, use a simple message
        try:
            html_message = render_to_string('email/welcome_email.html', context)
            plain_message = render_to_string('email/welcome_email_plain.txt', context)
        except Exception as template_error:
            logger.warning(f"Email templates not found, using fallback message: {template_error}")
            # Fallback to simple email if templates aren't found
            plain_message = f"""
Hello {full_name},

Thank you for joining our platform! We're excited to have you on board.

Your account has been created successfully. If you have any questions or need assistance,
please don't hesitate to contact our support team.

Best regards,
The Team
"""
            html_message = None  # No HTML message if templates aren't available
        
        # Get email settings from Django settings
        from_email = settings.DEFAULT_FROM_EMAIL
        
        # Send the email
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=from_email,
            recipient_list=[email],
            fail_silently=False,
            html_message=html_message,
        )
        
        logger.info(f"Welcome email sent successfully to {email} (User ID: {user_id})")
        return True
    
    except Exception as e:
        logger.error(f"Failed to send welcome email to {email} (User ID: {user_id}): {str(e)}")
        # Log detailed error for debugging
        import traceback
        logger.error(f"Error details: {traceback.format_exc()}")
        return False