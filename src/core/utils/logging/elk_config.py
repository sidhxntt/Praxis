# File: core/logging/elk_config.py
import os
import socket
import logging
import json
from datetime import datetime
from django.conf import settings

# Base directory for logs
LOG_DIR = getattr(settings, 'LOG_DIR', os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), 'logs'))
if not os.path.exists(LOG_DIR):
    os.makedirs(LOG_DIR)

# Application info for logs
APP_NAME = getattr(settings, 'APP_NAME', 'django_app')
ENVIRONMENT = getattr(settings, 'ENVIRONMENT', 'production')
HOST_NAME = socket.gethostname()

class JsonFormatter(logging.Formatter):
    """
    Formatter that outputs JSON strings after parsing the log record.
    """
    def __init__(self, *args, **kwargs):
        self.app_name = kwargs.pop('app_name', APP_NAME)
        self.environment = kwargs.pop('environment', ENVIRONMENT)
        super().__init__(*args, **kwargs)

    def format(self, record):
        """
        Format a log record into a JSON string.
        """
        log_data = {}
        
        # Include the message and standard attributes
        if isinstance(record.msg, dict):
            log_data.update(record.msg)
            if 'message' not in log_data:
                log_data['message'] = self.formatMessage(record)
        else:
            log_data['message'] = self.formatMessage(record)
        
        # Add standard fields
        log_data.update({
            '@timestamp': datetime.utcnow().isoformat(),
            'level': record.levelname,
            'logger': record.name,
            'path': record.pathname,
            'lineno': record.lineno,
            'function': record.funcName,
            'hostname': HOST_NAME,
            'app': self.app_name,
            'environment': self.environment,
        })
        
        # Add process and thread info
        log_data['process'] = {
            'id': record.process,
            'name': record.processName
        }
        log_data['thread'] = {
            'id': record.thread,
            'name': record.threadName
        }
        
        # Add exception info if available
        if record.exc_info:
            log_data['exception'] = {
                'type': record.exc_info[0].__name__,
                'message': str(record.exc_info[1]),
                'traceback': self.formatException(record.exc_info)
            }
            
        # Add extra fields from record
        if hasattr(record, 'extra_data') and record.extra_data:
            log_data.update(record.extra_data)
            
        if hasattr(record, 'request_id'):
            log_data['request_id'] = record.request_id
            
        return json.dumps(log_data)

def configure_logging():
    """
    Configure Django logging to work with ELK stack.
    This should be called in your Django settings after defining INSTALLED_APPS.
    """
    # Configure Django logging settings
    LOGGING = {
        'version': 1,
        'disable_existing_loggers': False,
        'formatters': {
            'json': {
                '()': 'core.logging.elk_config.JsonFormatter',
                'app_name': APP_NAME,
                'environment': ENVIRONMENT,
            },
            'verbose': {
                'format': '%(levelname)s %(asctime)s %(module)s %(process)d %(thread)d %(message)s'
            },
        },
        'handlers': {
            'console': {
                'level': 'DEBUG',
                'class': 'logging.StreamHandler',
                'formatter': 'verbose',
            },
            'file': {
                'level': 'INFO',
                'class': 'logging.handlers.TimedRotatingFileHandler',
                'filename': os.path.join(LOG_DIR, 'django.log'),
                'when': 'midnight',
                'interval': 1,
                'backupCount': 30,
                'formatter': 'json',
            },
            'error_file': {
                'level': 'ERROR',
                'class': 'logging.handlers.TimedRotatingFileHandler',
                'filename': os.path.join(LOG_DIR, 'error.log'),
                'when': 'midnight',
                'interval': 1,
                'backupCount': 30,
                'formatter': 'json',
            },
            'request_file': {
                'level': 'INFO',
                'class': 'logging.handlers.TimedRotatingFileHandler',
                'filename': os.path.join(LOG_DIR, 'requests.log'),
                'when': 'midnight',
                'interval': 1,
                'backupCount': 30,
                'formatter': 'json',
            },
            'exception_file': {
                'level': 'ERROR',
                'class': 'logging.handlers.TimedRotatingFileHandler',
                'filename': os.path.join(LOG_DIR, 'exceptions.log'),
                'when': 'midnight',
                'interval': 1,
                'backupCount': 30,
                'formatter': 'json',
            },
        },
        'loggers': {
            'django': {
                'handlers': ['console', 'file', 'error_file'],
                'level': 'INFO',
                'propagate': True,
            },
            'django.request': {
                'handlers': ['console', 'error_file'],
                'level': 'ERROR',
                'propagate': False,
            },
            'django.server': {
                'handlers': ['console', 'error_file'],
                'level': 'ERROR',
                'propagate': False,
            },
            'request_logger': {
                'handlers': ['console', 'request_file'],
                'level': 'INFO',
                'propagate': False,
            },
            'api_exceptions': {
                'handlers': ['console', 'exception_file'],
                'level': 'ERROR',
                'propagate': False,
            },
        }
    }
    
    return LOGGING