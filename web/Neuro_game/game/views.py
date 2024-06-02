from django.shortcuts import render
from django.http import JsonResponse
import random

def index(request):
    return render(request, 'index.html')


def get_speed(request):
    speed = random.randint(1, 5)
    return JsonResponse({'speed': speed})
