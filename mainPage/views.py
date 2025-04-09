from django.shortcuts import render
from django.views.generic import View
from . import models
from sample.models import SampleList


# Create your views here.

class HomePageView(View):
    def get(self, request):
        person = models.Person.objects.first()
        skills = models.Skills.objects.all().order_by('-percent')
        samples = SampleList.objects.filter(is_active=True).order_by('-id')[:6]
        return render(request, 'mainPage/index.html', {'person': person , 'skills': skills , 'samples': samples})


def header(request):
    return render(request, 'header.html')