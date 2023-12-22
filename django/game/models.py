from django.db import models
from django.contrib.auth import get_user_model

UserModel = get_user_model()

# https://docs.djangoproject.com/fr/4.2/ref/models/fields/#django.db.models.ForeignKey.on_delete
def get_sentinel_user():
    return UserModel.objects.get_or_create(username="deleted")[0]

class Game(models.Model):
    player1 = models.ForeignKey(UserModel, on_delete=models.SET(get_sentinel_user), related_name='games_as_player1')
    player1_score = models.IntegerField(default=0)
    player2 = models.ForeignKey(UserModel, on_delete=models.SET(get_sentinel_user), related_name='games_as_player2')
    player2_score = models.IntegerField(default=0)
    winner = models.ForeignKey(UserModel, null=True, on_delete=models.SET(get_sentinel_user))

    def __str__(self):
        return  f"Game between {self.player1.username} and {self.player2.username}"
