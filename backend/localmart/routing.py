from channels.routing import ProtocolTypeRouter, URLRouter
from chat.routing import websocket_urlpatterns
from chat.utils import TokenAuthMiddlewareStack

application = ProtocolTypeRouter({
    'websocket': TokenAuthMiddlewareStack(
        URLRouter(
            websocket_urlpatterns
        )
    ),
}) 