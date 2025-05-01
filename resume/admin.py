from django.contrib import admin
from . import models
# Register your models here.
@admin.register(models.Tahsilat)
class SampleAdmin(admin.ModelAdmin):
    list_display = ('name_university', 'name_reshte')

@admin.register(models.SavabeghKari)
class SampleAdmin(admin.ModelAdmin):
    list_display = ('title_kari', 'zaman_kar')

@admin.register(models.Zaban)
class ZabanAdmin(admin.ModelAdmin):
    list_display = ('name_zaban', 'percent')

@admin.register(models.Madarek)
class MadarekAdmin(admin.ModelAdmin):
    list_display = ('name_madrak' , 'sader_konande')