from django.contrib import admin

from mainPage.models import Person, Skills


# Register your models here.

@admin.register(Person)
class PersonAdmin(admin.ModelAdmin):
    list_display = ('name', 'occupations')

@admin.register(Skills)
class SkillsAdmin(admin.ModelAdmin):
    list_display = ('name', 'percent')
    sortable_by = ('percent',)