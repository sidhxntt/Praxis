# File: core/logging/api_audit.py
import os
import json
import time
import uuid
import socket
import logging
import logging.handlers
from datetime import datetime
from django.conf import settings
from django.utils.deprecation import MiddlewareMixin
from pathlib import Path

# Configure logging
BASE_DIR = Path(__file__).resolve().parent.parent.parent
LOG_DIR = os.path.join(BASE_DIR, 'logs', 'request_logs')
if not os.path.exists(LOG_DIR):
    os.makedirs(LOG_DIR)
    
# Create and configure logger
request_logger = logging.getLogger('request_logger')
request_logger.setLevel(logging.INFO)

# Configure file handler with rotation
file_handler = logging.handlers.TimedRotatingFileHandler(
    os.path.join(LOG_DIR, 'requests.log'),
    when='midnight',
    interval=1,  # Rotate daily
    backupCount=30,  # Keep logs for a month
    encoding='utf-8'
)

# Create JSON formatter for structured logs
class JsonFormatter(logging.Formatter):
    def format(self, record):
        if isinstance(record.msg, dict):
            log_entry = record.msg
        else:
            log_entry = {
                'message': record.getMessage()
            }
            
        # Add basic log record attributes
        log_entry.update({
            'timestamp': datetime.utcnow().isoformat(),
            'level': record.levelname,
            'logger': record.name,
            'host': socket.gethostname(),
        })
        
        # Add optional attributes if they exist
        for attr in ['module', 'funcName', 'lineno']:
            if hasattr(record, attr):
                log_entry[attr] = getattr(record, attr)
                
        # Add process and thread info
        log_entry['process'] = {
            'id': record.process,
            'name': record.processName
        }
        log_entry['thread'] = {
            'id': record.thread,
            'name': record.threadName
        }
                
        return json.dumps(log_entry)

file_handler.setFormatter(JsonFormatter())
request_logger.addHandler(file_handler)

# Add console handler in development mode
if getattr(settings, 'DEBUG', False):
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(JsonFormatter())
    request_logger.addHandler(console_handler)

# Configuration constants
DEFAULT_LOG_LEVEL = getattr(settings, 'REQUEST_LOGGING_LEVEL', logging.INFO)
DEFAULT_COLORIZE = getattr(settings, 'REQUEST_LOGGING_COLORIZE', False)
DEFAULT_MAX_BODY_LENGTH = getattr(settings, 'REQUEST_LOGGING_MAX_BODY_LENGTH', 1000)
SENSITIVE_HEADERS = getattr(settings, 'REQUEST_LOGGING_SENSITIVE_HEADERS', 
                           ['Authorization', 'Proxy-Authorization', 'Cookie', 'Set-Cookie'])
SENSITIVE_BODY_FIELDS = getattr(settings, 'REQUEST_LOGGING_SENSITIVE_BODY_FIELDS', 
                              ['password', 'token', 'secret', 'key', 'credit_card', 'cvv'])
EXEMPT_PATHS = getattr(settings, 'REQUEST_LOGGING_EXEMPT_PATHS', 
                      ['/health/', '/metrics/', '/static/', '/media/'])
EXEMPT_USER_AGENTS = getattr(settings, 'REQUEST_LOGGING_EXEMPT_USER_AGENTS', 
                            ['ELB-HealthChecker', 'kube-probe'])
LOG_METRICS = getattr(settings, 'REQUEST_LOGGING_LOG_METRICS', True)
LOG_BODY = getattr(settings, 'REQUEST_LOGGING_LOG_BODY', True)
LOG_HEADERS = getattr(settings, 'REQUEST_LOGGING_LOG_HEADERS', True)

class RequestLoggingMiddleware(MiddlewareMixin):
    """
    Production-grade request logging middleware that provides:
    1. Structured JSON logs of all requests and responses
    2. Performance metrics for each request
    3. Privacy filtering for sensitive data
    4. Path and user-agent based filtering
    5. Configurable logging levels and options
    """
    
    def __init__(self, get_response=None):
        self.get_response = get_response
        super().__init__(get_response)
        
    def process_request(self, request):
        """Process the request and add timing and ID"""
        # Skip logging for exempt paths
        if any(path in request.path for path in EXEMPT_PATHS):
            return None
            
        # Skip logging for exempt user agents
        user_agent = request.META.get('HTTP_USER_AGENT', '')
        if any(agent in user_agent for agent in EXEMPT_USER_AGENTS):
            return None
            
        # Generate request ID if not already present
        request.id = request.META.get('HTTP_X_REQUEST_ID', str(uuid.uuid4()))
        request.META['HTTP_X_REQUEST_ID'] = request.id
        
        # Set start time for metrics
        request._start_time = time.time()
        
        # Preserve request body for later reading
        if request.method in ('POST', 'PUT', 'PATCH'):
            self._preserve_request_body(request)
            
        return None
    
    def _preserve_request_body(self, request):
        """Preserve the request body for multiple reads"""
        try:
            # Read and store the body content
            request._body_content = request.body
            # Create a new stream for the original body
            request._stream = io.BytesIO(request._body_content)
            # Reset the read state
            request._read_started = False
        except Exception as e:
            request_logger.warning(f"Failed to preserve request body: {str(e)}")
            
    def process_response(self, request, response):
        """Log the response details"""
        if not hasattr(request, '_start_time'):
            # Request was exempt from logging
            return response
            
        # Calculate request processing time
        processing_time = time.time() - request._start_time
        
        # Don't log favicon.ico requests
        if request.path == '/favicon.ico':
            return response
            
        # Build log data
        log_data = {
            'request': {
                'id': getattr(request, 'id', str(uuid.uuid4())),
                'method': request.method,
                'path': request.path,
                'query_params': self._clean_data(dict(request.GET)),
                'scheme': request.scheme,
                'endpoint': self._get_endpoint_name(request),
            },
            'response': {
                'status': response.status_code,
                'reason': self._get_response_reason(response),
                'content_type': response.get('Content-Type', ''),
                'content_length': response.get('Content-Length', ''),
            },
            'metrics': {
                'response_time': round(processing_time * 1000, 2),  # Convert to ms
                'timestamp': datetime.utcnow().isoformat(),
            },
            'client': {
                'ip': self._get_client_ip(request),
                'user_agent': request.META.get('HTTP_USER_AGENT', ''),
                'referer': request.META.get('HTTP_REFERER', ''),
            }
        }
        
        # Add user info if authenticated
        if hasattr(request, 'user') and request.user.is_authenticated:
            log_data['user'] = {
                'id': getattr(request.user, 'id', None),
                'username': getattr(request.user, 'username', None),
            }
            
        # Log request headers if enabled
        if LOG_HEADERS:
            log_data['request']['headers'] = self._get_headers(request)
            
        # Log request body if enabled
        if LOG_BODY and request.method in ('POST', 'PUT', 'PATCH'):
            log_data['request']['body'] = self._get_request_body(request)
            
        # Log response body for non-binary responses below 400 KB
        content_type = response.get('Content-Type', '')
        if (LOG_BODY and 
            'application/json' in content_type and 
            hasattr(response, 'content') and 
            len(response.content) < 400000):
            try:
                # Only try to decode JSON responses
                log_data['response']['body'] = self._clean_data(json.loads(response.content.decode('utf-8')))
            except (json.JSONDecodeError, UnicodeDecodeError):
                # Skip if not valid JSON or not decodable
                pass
            
        # Determine log level based on response status
        log_level = DEFAULT_LOG_LEVEL
        if response.status_code >= 500:
            log_level = logging.ERROR
        elif response.status_code >= 400:
            log_level = logging.WARNING
            
        # Log the request data
        request_logger.log(log_level, log_data)
            
        return response
        
    def _get_client_ip(self, request):
        """Extract the client IP address"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            # Return the first IP in the list
            return x_forwarded_for.split(',')[0].strip()
        return request.META.get('REMOTE_ADDR', '')
        
    def _get_endpoint_name(self, request):
        """Get the name of the endpoint that handled the request"""
        if hasattr(request, 'resolver_match') and request.resolver_match:
            if request.resolver_match.view_name:
                return request.resolver_match.view_name
            elif request.resolver_match.func:
                return request.resolver_match.func.__name__
            elif hasattr(request.resolver_match, '_func_path') and request.resolver_match._func_path:
                return request.resolver_match._func_path
        return 'unknown'
        
    def _get_response_reason(self, response):
        """Get a text reason for the response status code"""
        if hasattr(response, 'reason_phrase') and response.reason_phrase:
            return response.reason_phrase
            
        # Common HTTP status codes and their reasons
        status_reasons = {
            200: 'OK',
            201: 'Created',
            204: 'No Content',
            301: 'Moved Permanently',
            302: 'Found',
            304: 'Not Modified',
            400: 'Bad Request',
            401: 'Unauthorized',
            403: 'Forbidden',
            404: 'Not Found',
            405: 'Method Not Allowed',
            409: 'Conflict',
            413: 'Payload Too Large',
            429: 'Too Many Requests',
            500: 'Internal Server Error',
            502: 'Bad Gateway',
            503: 'Service Unavailable',
            504: 'Gateway Timeout',
        }
        
        return status_reasons.get(response.status_code, 'Unknown')
        
    def _get_headers(self, request):
        """Extract headers from the request, filtering sensitive ones"""
        headers = {}
        for header, value in request.META.items():
            if header.startswith('HTTP_'):
                header_name = header[5:].replace('_', '-').title()
                if header_name not in SENSITIVE_HEADERS:
                    headers[header_name] = value
                else:
                    headers[header_name] = '[FILTERED]'
        return headers
        
    def _get_request_body(self, request):
        """Extract and sanitize the request body"""
        if not hasattr(request, 'body'):
            return None
            
        try:
            # Handle standard JSON bodies
            if request.content_type == 'application/json':
                body = json.loads(request.body.decode('utf-8'))
                return self._clean_data(body)
                
            # Handle form data
            elif request.content_type == 'application/x-www-form-urlencoded':
                return self._clean_data(dict(request.POST))
                
            # Handle multipart forms, but don't log file contents
            elif 'multipart/form-data' in request.content_type:
                multipart_data = dict(request.POST)
                files = {}
                for key, file in request.FILES.items():
                    files[key] = f"[FILE: {file.name}, {file.size} bytes, {file.content_type}]"
                multipart_data.update(files)
                return self._clean_data(multipart_data)
                
            # For other content types, just indicate the size
            else:
                content_length = len(request.body)
                if content_length > DEFAULT_MAX_BODY_LENGTH:
                    return f"[BODY TOO LARGE: {content_length} bytes]"
                return f"[RAW BODY: {content_length} bytes]"
                
        except (json.JSONDecodeError, UnicodeDecodeError):
            # If we can't decode the body, just note its presence
            content_length = len(request.body)
            return f"[UNPROCESSABLE BODY: {content_length} bytes]"
            
    def _clean_data(self, data):
        """
        Clean sensitive data from dictionaries recursively
        """
        if not data or not isinstance(data, dict):
            return data
            
        cleaned = {}
        for key, value in data.items():
            if isinstance(key, str) and any(sensitive in key.lower() for sensitive in SENSITIVE_BODY_FIELDS):
                cleaned[key] = '[FILTERED]'
            elif isinstance(value, dict):
                cleaned[key] = self._clean_data(value)
            elif isinstance(value, list):
                cleaned[key] = [self._clean_data(item) if isinstance(item, dict) else item for item in value]
            else:
                if len(str(value)) > DEFAULT_MAX_BODY_LENGTH:
                    cleaned[key] = f"[CONTENT TOO LARGE: {len(str(value))} chars]"
                else:
                    cleaned[key] = value
                    
        return cleaned
