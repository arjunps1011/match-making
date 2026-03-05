from rest_framework import serializers
from .models import *

class registerSerializer(serializers.ModelSerializer):
    class Meta:
        model=User_Registration
        fields='__all__'

    def to_representation(self, instance):
        data = super().to_representation(instance)

        if instance.profile:
            data['profile'] = instance.profile.url

        return data

class complaintSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='User.name', read_only=True)
    user_email = serializers.CharField(source='User.email', read_only=True)
    user_profile = serializers.SerializerMethodField()
    
    def get_user_profile(self, obj):
        if obj.User.profile:
            url = str(obj.User.profile)
            if 'cloudinary.com' in url:
                url = url.replace('/image/upload/', '/image/upload/w_50,h_50,c_fill,q_auto,f_auto/')
            return url
        return None
    
    class Meta:
        model=Complaints
        fields='__all__'
       

class chatserializers(serializers.ModelSerializer):
    class Meta:
        model=chat
        fields='__all__'
        
class requestSerializer(serializers.ModelSerializer):
    sender_profile = serializers.SerializerMethodField()
    sender_name=serializers.CharField(source='sender.name',read_only=True)
    sender_id=serializers.IntegerField(source='sender.id',read_only=True)
    
    def get_sender_profile(self, obj):
        if obj.sender.profile:
            url = str(obj.sender.profile)
            if 'cloudinary.com' in url:
                url = url.replace('/image/upload/', '/image/upload/w_50,h_50,c_fill,q_auto,f_auto/')
            return url
        return None
    
    class Meta:
        model=friend_request
        fields='__all__'