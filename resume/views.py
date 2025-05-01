from django.shortcuts import render
from django.views.generic import View
from mainPage.models import Person, Contact
from .models import Tahsilat, SavabeghKari, Zaban, Madarek


# Create your views here.

class ResumeView(View):
    def get(self, request):
        person = Person.objects.first()
        contact = Contact.objects.first()
        tahsilat = Tahsilat.objects.all()
        savabeghKari = SavabeghKari.objects.all()
        zaban = Zaban.objects.all()
        madrak = Madarek.objects.all()

        return render(request, 'resume/resume.html', {'person': person , 'contact': contact , 'tahsilat': tahsilat, 'savabeghKari': savabeghKari , 'zaban': zaban , 'madarek': madrak})