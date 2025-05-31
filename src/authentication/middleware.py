# authentication/middleware.py
import logging
import time
from django.utils import timezone
from django.utils.deprecation import MiddlewareMixin
from django.contrib.auth import get_user_model
from .models import UserIPAddress

User = get_user_model()
logger = logging.getLogger(__name__)


class UserActivityMiddleware(MiddlewareMixin):
    """
    Middleware to track user activity and update last_active timestamp.
    """
    def process_request(self, request):
        request.start_time = time.time()
        
    def process_response(self, request, response):
        # Only track for authenticated users
        if hasattr(request, 'user') and request.user.is_authenticated:
            # Update last_active timestamp (but not too frequently)
            try:
                user = request.user
                current_time = timezone.now()
                
                # Only update if last_active is None or older than 15 minutes
                if not user.last_active or (current_time - user.last_active).total_seconds() > 900:  # 15 minutes
                    user.last_active = current_time
                    user.save(update_fields=['last_active'])
                
                # Log response time for performance monitoring
                if hasattr(request, 'start_time'):
                    duration = time.time() - request.start_time
                    if duration > 1.0:  # Log slow requests (> 1 second)
                        logger.warning(f"Slow response: {request.path} took {duration:.2f}s for user {user.email}")
                    
            except Exception as e:
                logger.error(f"Error in UserActivityMiddleware: {str(e)}")
        
        return response


class TimezoneMiddleware(MiddlewareMixin):
    """
    Middleware to set user's timezone for the current request.
    """
    def process_request(self, request):
        if hasattr(request, 'user') and request.user.is_authenticated:
            try:
                import pytz
                user_timezone = request.user.timezone
                timezone.activate(pytz.timezone(user_timezone))
            except Exception as e:
                logger.error(f"Error setting timezone: {str(e)}")
                timezone.deactivate()  # Use default timezone
        else:
            timezone.deactivate()  # Use default timezone


class IPTrackingMiddleware(MiddlewareMixin):
    """
    Middleware to track and log user IP addresses for security.
    Add this to your settings.py for tracking known IPs:
    
    # IP Tracking Settings
    TRACK_USER_IPS = True
    """
    def process_request(self, request):
        if not hasattr(request, 'user') or not request.user.is_authenticated:
            return
            
        from django.conf import settings
        if not getattr(settings, 'TRACK_USER_IPS', False):
            return
            
        try:
            user = request.user
            ip_address = self.get_client_ip(request)
            
            if not ip_address:
                return
                

            if not UserIPAddress.objects.filter(user=user, ip_address=ip_address).exists():
                UserIPAddress.objects.create(
                    user=user,
                    ip_address=ip_address,
                    first_seen=timezone.now(),
                    last_seen=timezone.now()
                )
                logger.info(f"New IP address {ip_address} detected for user {user.email}")
            else:
                # Update last_seen for existing IP
                UserIPAddress.objects.filter(user=user, ip_address=ip_address).update(
                    last_seen=timezone.now(),
                    use_count=models.F('use_count') + 1
                )
        except Exception as e:
            logger.error(f"Error in IPTrackingMiddleware: {str(e)}")
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0].strip()
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip