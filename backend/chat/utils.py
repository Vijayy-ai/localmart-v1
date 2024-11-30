from channels.auth import AuthMiddlewareStack
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth import get_user_model
from django.db import close_old_connections
from urllib.parse import parse_qs
from channels.db import database_sync_to_async

User = get_user_model()

class TokenAuthMiddleware:
    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        close_old_connections()
        
        # Get the token from query string
        query_string = scope.get('query_string', b'').decode()
        params = parse_qs(query_string)
        token = params.get('token', [None])[0]

        if token:
            try:
                # Verify the token and get the user
                access_token = AccessToken(token)
                user = await self.get_user(access_token['user_id'])
                if user:
                    scope['user'] = user
            except Exception as e:
                print(f"WebSocket auth error: {e}")
        
        return await self.inner(scope, receive, send)

    @database_sync_to_async
    def get_user(self, user_id):
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return None

def TokenAuthMiddlewareStack(inner):
    return TokenAuthMiddleware(AuthMiddlewareStack(inner)) 