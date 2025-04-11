from django.db import models

# Create your models here.

class Person(models.Model):
    name = models.CharField(max_length=100, verbose_name='نام و نام خانوادگی')
    occupations = models.CharField(max_length=255, verbose_name='شغل و توضیحات جانبی')
    about_us_text = models.TextField(verbose_name='متن درباره من', blank=True, null=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'شخص'
        verbose_name_plural = 'اشخاص'


class Skills(models.Model):
    name = models.CharField(max_length=100, verbose_name='نام مهارت')
    percent = models.IntegerField(verbose_name='درصد مهارت')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'مهارت'
        verbose_name_plural = 'مهارت ها'


class Contact(models.Model):
    name = models.CharField(max_length=255, verbose_name="نام و نام خانوادگی")
    mail = models.EmailField(max_length=255, verbose_name="ایمیل")
    telegram_link = models.CharField(max_length=255, verbose_name="لینک تلگرام")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'تماس'
        verbose_name_plural = 'تماس ها'
