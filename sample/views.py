from django.shortcuts import render
from django.views.generic import View
from .models import SampleList
# Create your views here.

class Sample(View):
    def get(self, request):
        sample_list = SampleList.objects.filter(is_active=True)
        return render(request, 'sample/sample.html' , {'sample_list': sample_list})