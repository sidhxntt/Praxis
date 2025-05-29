import os
import json
import traceback
import uuid
from datetime import datetime
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
import logging
import logging.handlers
from django.conf import settings
from pathlib import Path


# Configure logging
BASE_DIR = Path(__file__).resolve().parent.parent.parent
LOG_DIR = os.path.join(BASE_DIR, 'logs', 'error_logs')
if not os.path.exists(LOG_DIR):
    os.makedirs(LOG_DIR)

# Create and configure logger
logger = logging.getLogger('api_exceptions')
logger.setLevel(logging.ERROR)

# Configure file handler with rotation
file_handler = logging.handlers.RotatingFileHandler(
    os.path.join(LOG_DIR, 'error.log'),
    maxBytes=10*1024*1024,  # 10MB
    backupCount=10,
    encoding='utf-8'
)

# Formatter for structured logs
class JsonFormatter(logging.Formatter):
    def format(self, record):
        log_record = {
            'timestamp': datetime.utcnow().isoformat(),
            'level': record.levelname,
            'message': record.getMessage(),
            'module': record.module,
            'function': record.funcName,
            'line': record.lineno
        }
        
        # Add exception info if available
        if record.exc_info:
            log_record['exception'] = {
                'type': record.exc_info[0].__name__,
                'value': str(record.exc_info[1]),
                'traceback': traceback.format_exception(*record.exc_info)
            }
            
        # Add extra fields if available
        if hasattr(record, 'request_id'):
            log_record['request_id'] = record.request_id
            
        if hasattr(record, 'extra') and record.extra:
            log_record['extra'] = record.extra
            
        return json.dumps(log_record)

file_handler.setFormatter(JsonFormatter())
logger.addHandler(file_handler)

# Add console handler in development mode
if getattr(settings, 'DEBUG', False):
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(JsonFormatter())
    logger.addHandler(console_handler)

def extract_request_info(request):
    """Extract useful debugging information from the request"""
    if not request:
        return {}
        
    info = {
        'method': request.method,
        'path': request.path,
        'query_params': dict(request.GET),
        'content_type': request.content_type,
    }
    
    # Add client info
    info['client'] = {
        'ip': request.META.get('REMOTE_ADDR'),
        'user_agent': request.META.get('HTTP_USER_AGENT'),
    }
    
    # Add user info if available
    if hasattr(request, 'user') and request.user:
        info['user'] = {
            'id': getattr(request.user, 'id', None),
            'username': getattr(request.user, 'username', None),
            'is_authenticated': request.user.is_authenticated,
        }
    
    return info

def custom_exception_handler(exc, context):
    """
    Production-grade custom exception handler that:
    1. Provides structured error responses
    2. Logs detailed information about exceptions
    3. Generates and includes request IDs for tracking
    4. Handles various types of exceptions appropriately
    5. Masks sensitive information
    """
    # Generate a unique request ID for tracking this exception
    request_id = str(uuid.uuid4())
    
    # Call DRF's default handler first to get the standard response
    response = exception_handler(exc, context)
    
    # Get view info for context
    view = context.get('view', None)
    view_name = view.__class__.__name__ if view else 'UnknownView'
    
    # Extract request information
    request = context.get('request', None)
    request_info = extract_request_info(request)
    
    # Prepare log extra data
    extra_data = {
        'view': view_name,
        'request': request_info,
        'exception_type': exc.__class__.__name__,
    }
    
    # Log the exception with context
    logger.error(
        f"Exception in {view_name}: {str(exc)}",
        exc_info=True,
        extra={'request_id': request_id, 'extra': extra_data}
    )
    
    # Determine error details based on exception type
    if response is not None:
        # Standard DRF exceptions (400-level errors)
        error_data = {
            'success': False,
            'status_code': response.status_code,
            'request_id': request_id,
            'error': {
                'type': exc.__class__.__name__,
                'detail': response.data,
            }
        }
        return Response(error_data, status=response.status_code)
    
    # Handle different types of unhandled exceptions
    error_data = {
        'success': False,
        'request_id': request_id,
    }
    
    # Custom handling for specific exception types
    if isinstance(exc, KeyError):
        error_data.update({
            'status_code': status.HTTP_400_BAD_REQUEST,
            'error': {
                'type': 'KeyError',
                'detail': 'Missing required field or key.',
            }
        })
        return Response(error_data, status=status.HTTP_400_BAD_REQUEST)
    
    elif isinstance(exc, (ValueError, TypeError)):
        error_data.update({
            'status_code': status.HTTP_400_BAD_REQUEST,
            'error': {
                'type': exc.__class__.__name__,
                'detail': 'Invalid input provided.',
            }
        })
        return Response(error_data, status=status.HTTP_400_BAD_REQUEST)
    
    elif isinstance(exc, PermissionError):
        error_data.update({
            'status_code': status.HTTP_403_FORBIDDEN,
            'error': {
                'type': 'PermissionError',
                'detail': 'You do not have permission to perform this action.',
            }
        })
        return Response(error_data, status=status.HTTP_403_FORBIDDEN)
    
    elif isinstance(exc, TimeoutError):
        error_data.update({
            'status_code': status.HTTP_504_GATEWAY_TIMEOUT,
            'error': {
                'type': 'TimeoutError',
                'detail': 'The request timed out. Please try again later.',
            }
        })
        return Response(error_data, status=status.HTTP_504_GATEWAY_TIMEOUT)
    
    # Default fallback for unhandled exceptions (500 errors)
    error_data.update({
        'status_code': status.HTTP_500_INTERNAL_SERVER_ERROR,
        'error': {
            'type': 'ServerError',
            'detail': 'Something went wrong on our end. Please try again later.',
        }
    })
    
    # Add exception type in debug mode
    if getattr(settings, 'DEBUG', False):
        error_data['error']['debug'] = {
            'exception_type': exc.__class__.__name__,
            'message': str(exc),
        }
    
    return Response(error_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)