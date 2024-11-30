from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    
    if response is None:
        return Response({
            'error': str(exc),
            'detail': 'An unexpected error occurred'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    if hasattr(exc, 'get_full_details'):
        try:
            details = exc.get_full_details()
            response.data['details'] = details
        except AttributeError:
            response.data['details'] = {
                'message': str(exc),
                'code': 'error'
            }

    return response 