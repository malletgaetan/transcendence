from rest_framework.authtoken.models import Token
from django.core.mail import send_mail
from twilio.rest import Client
from twilio.base.exceptions import TwilioRestException
import pyotp
import qrcode
import qrcode.image.svg
import random
import string
import os

def generate_qr_code(name, secret_otp):
    totp = pyotp.TOTP(secret_otp)
    qr_uri = totp.provisioning_uri(
        name=name,
        issuer_name='2FA Transcendence 2042'
    )
    image_factory = qrcode.image.svg.SvgPathImage
    qr_code_image = qrcode.make(
        qr_uri,
        image_factory=image_factory
    )
    return qr_code_image.to_string().decode('utf_8')

def generate_otp_code():
    characters = string.digits
    otp = ''.join(random.choice(characters) for _ in range(6))
    return otp

def validate_otp(otp, secret_otp):
    totp = pyotp.TOTP(secret_otp)

    return totp.verify(otp)

def get_user_from_token(request):
    token = request.META.get('HTTP_AUTHORIZATION')
    if token is not None:
        token = token.split(" ", 1)
        user = Token.objects.get(key=token[1]).user
    if not user:
        return None
    else:
        return user

def create_user_token(user):
    token, created = Token.objects.get_or_create(user=user)
    return token

def send_otp_email(email, otp):
    subject = 'Your OTP for Login'
    message = f'Your OTP is: {otp}'
    from_email = os.environ.get('EMAIL_HOST_USER')
    recipient_list = [email]
    send_mail(subject, message, from_email, recipient_list)
    
def send_otp_sms(phone_number, code):
    try:  
        client = Client(os.environ.get('TWILIO_ACCOUNT_SID'), os.environ.get('TWILIO_AUTH_TOKEN'))
        message_body = f"Your OTP code is : {code}" 
        verification = client.verify.v2.services(os.environ.get('TWILIO_VERIFY_SID')) \
        .verifications \
        .create(to=phone_number, channel="sms")
    except TwilioRestException as e:
        print(f"Erreur Twilio: {e}")

def verify_otp_sms(user, otp):
    try:
        client = Client(os.environ.get('TWILIO_ACCOUNT_SID'), os.environ.get('TWILIO_AUTH_TOKEN'))
        verification_check = client.verify.v2.services(os.environ.get('TWILIO_VERIFY_SID')) \
        .verification_checks \
        .create(to=str(user.phone_number), code=otp)
        if verification_check.status == 'approved':
            return True
        else:
            return False
    except TwilioRestException as e:
        print(f"Erreur Twilio: {e}")
        return False