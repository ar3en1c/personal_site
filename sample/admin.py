from django.contrib import admin
from . import models
# Register your models here.
@admin.register(models.SampleList)
class SampleAdmin(admin.ModelAdmin):
    list_display = ('name','link', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('name',)
    ordering = ('-id',)
    list_editable = ('is_active',)