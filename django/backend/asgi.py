"""
ASGI config for backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')


from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.urls import path
from django.core.asgi import get_asgi_application

django_asgi_app = get_asgi_application()

from game import consumers as game_consumers
from matchmaking import consumers as matchmaking_consumers

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AuthMiddlewareStack(
        URLRouter([
            path("game", game_consumers.GameConsumer.as_asgi()),
            path("matchmaking", matchmaking_consumers.MatchmakingConsumer.as_asgi()),
        ])
    )
})

