from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import status, views, permissions
from .serializers import UserLoginSerializer, UserRegisterSerializer
from django.contrib.auth import get_user_model, authenticate
from django.db import IntegrityError
from django.shortcuts import redirect
from .utils import  generate_qr_code, \
                    generate_otp_code, \
                    validate_otp, \
                    send_otp_email, \
                    send_otp_sms,\
                    verify_otp_sms,\
                    create_user_token
import requests
import os
import pyotp

UserModel = get_user_model()

class UserRegister(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(data=serializer.error_messages,status=status.HTTP_400_BAD_REQUEST)
        try:
            UserModel.objects.create_user(
                username=serializer.validated_data['username'],
                password=serializer.validated_data['password'],
                email=serializer.validated_data['email'],
                phone_number=serializer.validated_data['phone_number']
            )
        except IntegrityError:
            return Response(status=status.HTTP_409_CONFLICT)
        return Response(status=status.HTTP_201_CREATED)


class UserLogin(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(status=status.HTTP_400_BAD_REQUEST)
        user = authenticate(username=serializer.validated_data['username'], password=serializer.validated_data['password'])
        if not user:
            return Response(status=status.HTTP_404_NOT_FOUND)
        user.is_auth = True
        user.save()
        return Response(status=status.HTTP_200_OK)
    
class UserAuthorize(views.APIView):
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        code = request.GET.get('code')
        error = request.GET.get('error')
        error_description = request.GET.get('error_description')
        if code is not None:
            json = {
                'grant_type': 'authorization_code',
                'client_id': os.environ.get('OAUTH_CLIENT_UID'),
                'client_secret': os.environ.get('OAUTH_CLIENT_SECRET'),
                'code': code,
                'redirect_uri': os.environ.get('OAUTH_REDIRECT_URL')
            }
            call = requests.post(os.environ.get('OAUTH_TOKEN_URL'), json=json)
            if (call.status_code == status.HTTP_200_OK):
                access_token = call.json().get('access_token')
                if access_token is not None:
                    info = requests.get(os.environ.get('API_USER_INFOS_URL'), params={'access_token': access_token})
                    if (info.status_code == status.HTTP_200_OK):
                        username = info.json().get('login')
                        user = authenticate(username=username, password="NULL")
                        if not user:
                            try:
                                user = UserModel.objects.create_user(
                                    username=username,
                                    password="NULL",
                                    is_42_oauth=True
                                )
                            except IntegrityError:
                                return Response(status=status.HTTP_409_CONFLICT)
                    token, created = Token.objects.get_or_create(user=user)
                    if token is None:
                        return Response(data={'reponse': 'token error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                return Response(status=status.HTTP_400_BAD_REQUEST, data=call.json())
        if error is not None and error_description is not None:
            return redirect(os.environ.get('FRONTEND_URL'))
        return redirect(f"{os.environ.get('FRONTEND_URL')}?username={username}&token={token.key}")
    
class UserToken(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        token = request.META.get('HTTP_AUTHORIZATION')
        if token is not None:
            token = token.split(" ", 1)
            user = Token.objects.get(key=token[1]).user
            if not user:
                return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            return Response(status=status.HTTP_200_OK, data={'username': user.username})
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserOTP(views.APIView):
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        user = authenticate(username=request.GET.get('username'), password=request.GET.get('password'))
        if not user:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        if user.otp_secret == "":
            user.otp_secret = pyotp.random_base32()
            user.save()
            qr_code = generate_qr_code(name=user.username, secret_otp=user.otp_secret)
            return Response(status=status.HTTP_200_OK, data={'response': 'QR Code Generating', 'qr_code': qr_code})
        else:
            return Response(status=status.HTTP_200_OK, data={'response': 'Enter your OTP code'})
    
    def post(self, request):
        otp = request.data['otp']
        user = authenticate(username=request.data['username'], password=request.data['password'])
        if not user:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        if not validate_otp(otp, secret_otp=user.otp_secret):
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        token = create_user_token(user)
        if not token:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(data={'token': token.key}, status=status.HTTP_200_OK)
    
class UserOTPMail(views.APIView):
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        user = authenticate(username=request.GET.get('username'), password=request.GET.get('password'))
        if not user:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        otp = generate_otp_code()
        user.otp = otp
        user.save()
        send_otp_email(user.email, otp)
        return Response(status=status.HTTP_200_OK)
    
    def post(self, request):
        otp = request.data['otp']
        user = authenticate(username=request.data['username'], password=request.data['password'])
        if not otp:
            return Response(data={'response': 'OTP Missing', 'otp': otp}, status=status.HTTP_400_BAD_REQUEST)
        if not user:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        if (user.otp == otp):
            user.otp = None
            user.save()
            token = create_user_token(user)
            if not token:
                return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            return Response(data={'token': token.key}, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        
class UserOTPSms(views.APIView):
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        user = authenticate(username=request.GET.get('username'), password=request.GET.get('password'))
        if not user:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        otp = generate_otp_code()
        user.otp = otp
        user.save()
        send_otp_sms(str(user.phone_number), otp)
        return Response(status=status.HTTP_200_OK)
    
    def post(self, request):
        otp = request.data['otp']
        user = authenticate(username=request.data['username'], password=request.data['password'])
        if not otp:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        if not user:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        if verify_otp_sms(user, otp) is False:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        token = create_user_token(user)
        if not token:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(data={'token': token.key}, status=status.HTTP_200_OK)


class UserQRCode(views.APIView):
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        user = authenticate(username=request.GET.get('username'), password=request.GET.get('password'))
        if not user:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        user.otp_secret = pyotp.random_base32()
        user.save()
        qr_code = generate_qr_code(name=user.username, secret_otp=user.otp_secret)
        return Response(status=status.HTTP_200_OK, data={'response': 'QR Code Generating', 'qr_code': qr_code})

