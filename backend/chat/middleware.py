from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import AccessToken
from urllib.parse import parse_qs

User = get_user_model()

class WebSocketAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        # Get query parameters
        query_string = scope.get('query_string', b'').decode()
        params = parse_qs(query_string)
        
        # Get token from query parameters
        token = params.get('token', [None])[0]
        
        if token:
            try:
                # Verify token and get user
                access_token = AccessToken(token)
                user = await self.get_user(access_token['user_id'])
                if user:
                    scope['user'] = user
                    return await super().__call__(scope, receive, send)
            except Exception as e:
                print(f"WebSocket auth error: {e}")
        
        scope['user'] = AnonymousUser()
        return await super().__call__(scope, receive, send)

    @database_sync_to_async
    def get_user(self, user_id):
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return None 