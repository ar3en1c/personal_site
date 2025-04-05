from django.shortcuts import render
from django.views.generic import View


# Create your views here.

class HomePageView(View):
    def get(self, request):
        return render(request, 'mainPage/index.html')


def header(request):
    return render(request, 'header.html')