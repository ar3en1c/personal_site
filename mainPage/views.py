from django.shortcuts import render
from django.views.generic import View
from . import models


# Create your views here.

class HomePageView(View):
    def get(self, request):
        person = models.Person.objects.first()
        return render(request, 'mainPage/index.html', {'person': person})


def header(request):
    return render(request, 'header.html')