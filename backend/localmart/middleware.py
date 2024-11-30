from django.http import JsonResponse
from rest_framework import status
from django.utils.deprecation import MiddlewareMixin
import logging
from django.conf import settings
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth import get_user_model
from jwt import decode as jwt_decode
from rest_framework_simplejwt.exceptions import TokenError

logger = logging.getLogger(__name__)

class ErrorHandlingMiddleware(MiddlewareMixin):
    def process_exception(self, request, exception):
        logger.error(f"Error processing request: {exception}", exc_info=True)
        
        if request.path.startswith('/api/'):
            error_message = str(exception)
            if settings.DEBUG:
                error_detail = {
                    'error': error_message,
                    'type': exception.__class__.__name__,
                    'path': request.path,
                    'method': request.method,
                }
            else:
                error_detail = {
                    'error': 'An unexpected error occurred'
                }
            
            return JsonResponse(
                error_detail,
                status=getattr(exception, 'status_code', status.HTTP_500_INTERNAL_SERVER_ERROR)
            )
        return None

class AuthenticationMiddleware(MiddlewareMixin):
    def process_request(self, request):
        # Public endpoints that don't need auth
        PUBLIC_PATHS = [
            '/api/auth/login/',
            '/api/auth/register/',
            '/api/auth/token/',
            '/api/auth/token/refresh/',
            '/admin/',
            '/api/health-check/',
        ]

        # Skip auth for public endpoints
        if any(request.path.endswith(path) for path in PUBLIC_PATHS):
            return None

        # Skip auth for GET requests to products
        if request.method == 'GET' and '/api/products/' in request.path:
            return None

        # Check auth header for protected routes
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return JsonResponse({'error': 'Please login to continue'}, status=401)

        if not auth_header.startswith('Bearer '):
            return JsonResponse({'error': 'Invalid token format'}, status=401)

        try:
            token = auth_header.split(' ')[1]
            AccessToken(token)
            return None
        except Exception:
            return JsonResponse({'error': 'Invalid or expired token'}, status=401)

class TokenValidationMiddleware(MiddlewareMixin):
    def process_request(self, request):
        # Skip validation for non-API endpoints
        if not request.path.startswith('/api/'):
            return None

        # Public endpoints that don't require authentication
        PUBLIC_PATHS = [
            '/api/auth/',  # All auth endpoints
            '/api/users/register/',
            '/api/users/login/',
            '/api/products/',  # GET requests only
            '/api/categories/',
            '/api/health-check/',
        ]

        # Skip validation for public endpoints
        if any(request.path.startswith(path) for path in PUBLIC_PATHS):
            # Only validate token for non-GET product requests
            if request.path == '/api/products/' and request.method != 'GET':
                return self._validate_token(request)
            # Skip validation for all other public endpoints
            return None

        # Skip validation for OPTIONS requests (CORS preflight)
        if request.method == 'OPTIONS':
            return None

        return self._validate_token(request)

    def _validate_token(self, request):
        # Skip token validation for registration and login
        if request.path in ['/api/users/register/', '/api/users/login/']:
            return None

        auth_header = request.headers.get('Authorization')
        if not auth_header:
            logger.warning('No Authorization header found')
            return JsonResponse(
                {'error': 'Authentication required'}, 
                status=401
            )

        if not auth_header.startswith('Bearer '):
            logger.warning('Invalid Authorization header format')
            return JsonResponse(
                {'error': 'Invalid token format'}, 
                status=401
            )

        try:
            token = auth_header.split(' ')[1]
            AccessToken(token)
            return None
        except TokenError as e:
            logger.error(f'Token validation error: {str(e)}')
            return JsonResponse(
                {'error': 'Invalid or expired token'}, 
                status=401
            )
        except Exception as e:
            logger.error(f'Unexpected error in token validation: {str(e)}')
            return JsonResponse(
                {'error': 'Authentication error'}, 
                status=401
            )