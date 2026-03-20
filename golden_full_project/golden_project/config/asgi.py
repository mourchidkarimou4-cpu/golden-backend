"""ASGI config for GOLDEN project (WebSocket ready)."""
import os
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.prod')

# Pour activer Django Channels (WebSocket) en Phase 2, remplacer par :
# from channels.routing import ProtocolTypeRouter, URLRouter
# from channels.auth import AuthMiddlewareStack
# from apps.messaging.routing import websocket_urlpatterns
#
# application = ProtocolTypeRouter({
#     "http": get_asgi_application(),
#     "websocket": AuthMiddlewareStack(URLRouter(websocket_urlpatterns)),
# })

application = get_asgi_application()
