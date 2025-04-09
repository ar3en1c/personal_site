from django.db import models

# Create your models here.

class SampleList(models.Model):
    name = models.CharField(max_length=255, verbose_name='نام پروژه')
    description = models.TextField(verbose_name='توضیحات پروژه')
    image = models.ImageField(upload_to='sample_images/', verbose_name='عکس پروژه')
    link = models.CharField(max_length=255,verbose_name='لینک پروژه')
    is_active = models.BooleanField(default=True, verbose_name='وضعیت فعال/غیر فعال')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'نمونه کار'
        verbose_name_plural = 'نمونه کارها'