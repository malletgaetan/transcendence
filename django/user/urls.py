from django.urls import path
from . import views

urlpatterns = [
    path('', views.UserRegister.as_view()),
    path('login/', views.UserLogin.as_view()),
    path('authorize/', views.UserAuthorize.as_view()),
    path('token/', views.UserToken.as_view()),
    path('otp/', views.UserOTP.as_view()),
    path('otp/generate_qr_code/', views.UserQRCode.as_view()),
    path('otp/send-mail/', views.UserOTPMail.as_view()),
    path('otp/send-sms/', views.UserOTPSms.as_view())
]
