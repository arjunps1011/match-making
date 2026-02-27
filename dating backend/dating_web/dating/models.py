from django.db import models
import uuid
import datetime
from django.utils import timezone
# Create your models here.

class User_Registration(models.Model):
    name=models.CharField(max_length=100,null=True,blank=True)
    email=models.EmailField(null=True,blank=True)
    phone=models.PositiveIntegerField(null=True,blank=True)
    gender=models.CharField(max_length=10,null=True,blank=True)
    password=models.CharField(max_length=200,null=True,blank=True)
    username=models.CharField(max_length=200,null=True,blank=True)
    premium=models.CharField(max_length=50,null=True,blank=True,default='false')
    profile=models.ImageField(upload_to='profile',null=True,blank=True, default='default/0d64989794b1a4c9d89bff571d3d5842.jpg')
    token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False, null=True,blank=True)
    hobies = models.JSONField(default=list, blank=True,null=True)
    isonline=models.CharField(max_length=50,default='offline',null=True,blank=True)
    last_active=models.DateTimeField(null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True,blank=True)
    date_joined = models.DateTimeField(default=timezone.now)
    
class Complaints(models.Model):
    User=models.ForeignKey(User_Registration,on_delete=models.CASCADE)
    complaints=models.CharField(max_length=100,null=True,blank=True)
    date=models.DateField(auto_now_add=True,null=True,blank=True)
    resolved = models.BooleanField(default=False,null=True,blank=True)

class chat(models.Model):
    sender=models.ForeignKey(User_Registration,on_delete=models.CASCADE,related_name='sent_chats')
    receiver=models.ForeignKey(User_Registration,on_delete=models.CASCADE,related_name='recrived_chats')
    message=models.CharField(max_length=500,null=True,blank=True)
    timestamp = models.DateTimeField(auto_now_add=True,null=True)

class friend_request(models.Model):
    sender=models.ForeignKey(User_Registration, on_delete=models.CASCADE,related_name='request_sender')
    receiver=models.ForeignKey(User_Registration, on_delete=models.CASCADE,related_name='request_receier')
    status=models.CharField(max_length=50,null=True)
    timestamp = models.DateTimeField(auto_now_add=True,null=True)

class CallRequest(models.Model):
    sender = models.ForeignKey(User_Registration, related_name='calls_made', on_delete=models.CASCADE)
    receiver = models.ForeignKey(User_Registration, related_name='calls_received', on_delete=models.CASCADE)
    channel = models.CharField(max_length=100, unique=True)
    call_type = models.CharField(max_length=10)  # 'audio' or 'video'
    status = models.CharField(max_length=10, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)