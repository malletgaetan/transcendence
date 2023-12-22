from rest_framework import serializers
from phonenumber_field.serializerfields import PhoneNumberField
from django.contrib.auth import get_user_model

UserModel = get_user_model()

class UserRegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=True, max_length=20)
    password = serializers.CharField(required=True, min_length=8)
    email = serializers.EmailField(required=True, max_length=100)
    phone_number = PhoneNumberField(required=True)
    class Meta:
        model = UserModel
        fields = ['username', 'password', 'email', 'phone_number']

class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True, max_length=20)
    password = serializers.CharField(required=True, min_length=8)
