from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model

UserModel = get_user_model()

def custom_validation(data):
    username = data['username'].strip()
    password = data['password'].strip()

    if not username or UserModel.objects.filter(username=username).exists():
        raise ValidationError('bad username')
    if not password or len(password) < 8:
        raise ValidationError('bad password')
    return data
