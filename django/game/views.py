from rest_framework import generics, mixins
from rest_framework import views
from rest_framework import permissions
from rest_framework import status
from rest_framework import renderers, parsers
from rest_framework.response import Response
from django.db.models import Q
from game.models import Game
from user.models import User
from .serializers import GameSerializer

class GameList(generics.ListAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Game.objects.all()
        player1 = None
        player2 = None
        try:
            if self.request.GET.get('player1'):
                # lol this shouldn't be needed but I don't fckin care
                player1 = User.objects.get(username=self.request.GET.get('player1'))
            if self.request.GET.get('player2'):
                player2 = User.objects.get(username=self.request.GET.get('player2'))
        except User.DoesNotExist:
            return None
        if player1 and not player2:
            queryset = queryset.filter(Q(player1=player1) | Q(player2=player1))
        if player2 and not player1:
            queryset = queryset.filter(Q(player1=player2) | Q(player2=player2))
        elif player1 and player2:
            queryset = queryset.filter(Q(player1=player1, player2=player2) | Q(player1=player2, player2=player1))
        if "done" in self.request.GET:
            queryset = queryset.filter(winner__isnull=False)
        return queryset


class GameCreate(views.APIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer
    permissions_classes = [permissions.IsAuthenticated]

    def post(self, request):
        if not "player1" in request.data:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        if not "player2" in request.data:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        if request.data["player1"] == request.data["player2"]:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        player1 = User.objects.get(username=request.data["player1"])
        if player1 is None:
            return Response(status=status.HTTP_404_BAD_REQUEST)
        player2 = User.objects.get(username=request.data["player2"])
        if player2 is None:
            return Response(status=status.HTTP_404_BAD_REQUEST)
        game = Game.objects.create(player1=player1, player2=player2)
        if game is None:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(status=status.HTTP_200_OK)

class GameDetail(generics.RetrieveAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer
    permission_classes = [permissions.AllowAny]
    renderer_classes = [renderers.JSONRenderer]
    parser_classes = [parsers.JSONParser]

