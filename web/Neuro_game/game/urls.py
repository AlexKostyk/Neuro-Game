from django.urls import path
from . import views

urlpatterns = [
    path('', views.index),
    path('get_speed/', views.get_speed, name='get_speed'),
]