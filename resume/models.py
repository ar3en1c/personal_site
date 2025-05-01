from django.db import models


# Create your models here.

class Tahsilat(models.Model):
    name_university = models.CharField(max_length=255, verbose_name='نام دانشگاه')
    name_reshte = models.CharField(max_length=255, verbose_name='نام رشته')
    zaman_tahsil = models.CharField(max_length=255, verbose_name='زمان تحصیل')
    pic = models.ImageField(upload_to='daneshgah/', verbose_name='عکس دانشگاه')

    def __str__(self):
        return self.name_university + ' ' + self.name_reshte
    class Meta:
        verbose_name = 'تحصیل'
        verbose_name_plural = 'تحصیلات'

class SavabeghKari(models.Model):
    title_kari = models.CharField(max_length=255, verbose_name='عنوان کاری')
    mahl_kari = models.CharField(max_length=255, verbose_name='محل کار')
    zaman_kar = models.CharField(max_length=255, verbose_name='زمان کار')
    pic = models.ImageField(upload_to='savabegh/', verbose_name='عکس کار')
    def __str__(self):
        return self.title_kari + ' ' + self.zaman_kar
    class Meta:
        verbose_name = 'کار'
        verbose_name_plural = 'محل های کار'


class Zaban(models.Model):
    name_zaban = models.CharField(max_length=255, verbose_name='نام زبان')
    percent = models.IntegerField(verbose_name='درصد تسلط')
    def __str__(self):
        return self.name_zaban + ' ' + str(self.percent)
    class Meta:
        verbose_name = 'زبان'
        verbose_name_plural = 'زبان ها'

class Madarek(models.Model):
    name_madrak = models.CharField(max_length=255, verbose_name='نام مدرک')
    sader_konande = models.CharField(max_length=200, verbose_name='صادر کننده')
    date = models.CharField(max_length=50, verbose_name='تاریخ صدور')
    link = models.URLField(verbose_name='لینک مدرک')

    def __str__(self):
        return self.name_madrak + ' ' + self.sader_konande
    class Meta:
        verbose_name = 'مدرک'
        verbose_name_plural = "مدارک"