from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.contrib.auth.base_user import BaseUserManager
from phonenumber_field.modelfields import PhoneNumberField
import pyotp

# Create your models here.

class UserManager(BaseUserManager):
    def create_user(self, username, email="", phone_number="", password=None, is_42_oauth=False, otp_secret=""):
        if not username:
            raise ValueError('Username is required.')
        if not password:
            raise ValueError('Password is required.')
        # if not email:
        #     raise ValueError('Email Adress is required.')
        # if not phone_number:
        #     raise ValueError('Phone Number is required.')
        if phone_number and email:
            user = self.model(username=username,email=email, phone_number=phone_number, is_42_oauth=is_42_oauth, otp_secret=otp_secret)
        else:
            user = self.model(username=username, is_42_oauth=is_42_oauth, otp_secret=otp_secret)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, username, password=None):
        if not username:
            raise ValueError('Username is required.')
        if not password:
            raise ValueError('Password is required.')
        user = self.create_user(username, password)
        user.is_superuser = True
        user.save()
        return user

class User(AbstractBaseUser, PermissionsMixin):
    user_id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=20, unique=True)
    email = models.EmailField(max_length=100, null=True, blank=True, unique=True)
    phone_number = PhoneNumberField(null=True, blank=True, unique=True)
    is_42_oauth = models.BooleanField(default=False)
    is_auth = models.BooleanField(default=False)
    otp_secret = models.CharField(max_length=255, null=True, blank=True)
    otp = models.CharField(max_length=6, null=True, blank=True)

    USERNAME_FIELD = 'username'
    REQUIRED_FIEDS = ['username']
    objects = UserManager()
    def __str__(self):
        return self.username
