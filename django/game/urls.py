from django.urls import path
from . import views

urlpatterns = [
    path('', views.GameCreate.as_view()),
    path('games/', views.GameList.as_view()),
    path('<int:pk>/', views.GameDetail.as_view()),
]

