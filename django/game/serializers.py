from rest_framework import serializers
from .models import Game
from user.models import User

class GameSerializer(serializers.ModelSerializer):
    paddleOne = serializers.SerializerMethodField()
    paddleTwo = serializers.SerializerMethodField()

    class Meta:
        model = Game
        fields = ['id', 'paddleOne', 'player1_score', 'paddleTwo', 'player2_score', 'winner']  # Include other fields as needed
    def get_paddleOne(self, obj):
        return obj.player1.username
    def get_paddleTwo(self, obj):
        return obj.player2.username

