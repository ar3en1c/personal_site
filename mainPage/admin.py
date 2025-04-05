from django.contrib import admin

from mainPage.models import Person


# Register your models here.

@admin.register(Person)
class PersonAdmin(admin.ModelAdmin):
    list_display = ('name', 'occupations')