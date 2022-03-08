from django.db import models
from django.contrib.auth.models import User



# Create your models here.

class Speaker(models.Model):
    gender_choices = (("male","Male"),("female","Female"),("others","Others"))
    
    age = models.IntegerField(null = True, blank = True)
    gender = models.CharField(max_length= 10, null = True, choices = gender_choices)

class Speech(models.Model):
    audiofile = models.FileField(upload_to='voicelines/',null = True, blank = True)
    speaker = models.ForeignKey(Speaker, on_delete=models.SET_NULL, null=True)
    
    
class NepaliText(models.Model):
    text = models.CharField(max_length=1000, null = True, blank = True)
    
    
class Snippet(models.Model):
    speech = models.OneToOneField(Speech, on_delete=models.SET_NULL, null=True)
    text = models.OneToOneField(NepaliText, on_delete=models.CASCADE, null=True)
    is_recorded = models.BooleanField(null = True,default = False)
    is_verified = models.BooleanField(null=True, default = False)
    is_rejected = models.BooleanField(null=True, default = False)
    verification_count = models.IntegerField(null=True, default =0)
    
class SpeechToText(models.Model):
    audiofile = models.FileField(upload_to='voicelines/',null = True, blank = True)
    text = models.CharField(max_length=1000, null = True, blank = True)
    
    
    
class NepaliTextCollection(models.Model):
    text_file = models.FileField(upload_to='text_files/', null = True, blank = True)
    