from rest_framework import serializers
from .models import *

class registerSerializer(serializers.ModelSerializer):
    class Meta:
        model=User_Registration
        fields='__all__'

class complaintSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='User.name', read_only=True)
    user_email = serializers.CharField(source='User.email', read_only=True)
    user_profile=serializers.ImageField(source='User.profile',read_only=True)
    class Meta:
        model=Complaints
        fields='__all__'
       

class chatserializers(serializers.ModelSerializer):
    class Meta:
        model=chat
        fields='__all__'
class requestSerializer(serializers.ModelSerializer):
    sender_profile=serializers.ImageField(source='sender.profile',read_only=True)
    sender_name=serializers.CharField(source='sender.name',read_only=True)
    sender_id=serializers.IntegerField(source='sender.id',read_only=True)
    class Meta:
        model=friend_request
        fields='__all__'