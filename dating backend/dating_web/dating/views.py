
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password, check_password
from rest_framework import status
import random 
import os
from .models import *
from django.utils import timezone
from dateutil import parser
from datetime import timedelta
from django.conf import settings
from django.core.mail import send_mail
from .serializers import *
from rest_framework.decorators import api_view
import uuid
from google.oauth2 import id_token
from google.auth.transport import requests
import razorpay
from datetime import datetime
import cohere
import pandas as pd
import matplotlib.pyplot as plt 
import io, base64
from django.db.models import Q
from django.utils.timesince import timesince
from django.conf import settings
from agora_token_builder import RtcTokenBuilder
import time
import hashlib
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from datetime import datetime, timedelta, time as dt_time
import hmac
import json
from django.views.decorators.csrf import csrf_exempt

GOOGLE_CLIENT_ID=os.getenv('GOOGLE_CLIENT_ID')
ADMIN_MAIL=os.getenv('ADMIN_MAIL')
ADMIN_PASS=os.getenv('ADMIN_PASS')
COHERE_API_KEY=os.getenv('COHERE_API_KEY')
ZEGO_APP_ID=int(os.getenv('ZEGO_APP_ID', 0))
ZEGO_SERVER_SECRET=os.getenv('ZEGO_SERVER_SECRET')

@api_view(['POST'])
def login(request):
    print("=== login VIEW HIT ===")
    email=request.data.get('email')
    password=request.data.get('password')
    
    if email == ADMIN_MAIL and password == ADMIN_PASS:
        print("ADMIN LOGIN →", {'redirect': '/admin_dashboard'})
        return Response({'redirect':'/admin_dashboard'})
        
    
    user=User_Registration.objects.filter(email=email).first()

    

    
    if user:
        if check_password(password,user.password):
            request.session['id']=user.id
            request.session.save()
            print(f"Session created for user {user.id}")
            return Response({'redirect':'/'})
            
        else:
            return Response('passwoord does not match',status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'message':'user not found'},status=status.HTTP_400_BAD_REQUEST)
        


@api_view(['POST'])
def register(request):
    print("=== REGISTER VIEW HIT ===")  
    print("Request data:", request.data)
    name=request.data.get('name')
    email=request.data.get('email')
    phone=request.data.get('phone')
    gender=request.data.get('gender')
    password=request.data.get('password')
    
    user_email=User_Registration.objects.filter(email=email).first()
    if user_email:
        return Response({'message':'email already registerd'},status=status.HTTP_400_BAD_REQUEST)
    otp=str(random.randint(1000,9999))

    print("About to send email - OTP:", otp)

    request.session['name']=name
    request.session['otp']=otp
    request.session['otp_created']=timezone.now().isoformat()
    request.session['email']=email
    request.session['phone']=phone
    request.session['gender']=gender
    request.session['password']=make_password(password)
    send_mail(
        subject='Your otp for registration',
        message=f'your otp is {otp} it is only valid for 10 minutes',
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[email],
        fail_silently=False
          )
    print("Session after register:", dict(request.session))
    return Response({'message':f'an otp has been send to  your email {user_email}'})


@api_view(['POST'])
def otp_check(request):
    print("=== OTP VIEW HIT ===")
    print("Full session in OTP:", dict(request.session))
    entered_otp=request.data.get('otp')
    created_at=request.session.get('otp_created')
    if not created_at:
        return Response({'message':'created at not found'},status=status.HTTP_400_BAD_REQUEST)

    created_time = parser.parse(created_at).astimezone(timezone.get_current_timezone())
    if(timezone.now () - created_time).total_seconds()>600:
        return Response({'message':'otp expires'},status=status.HTTP_400_BAD_REQUEST)

    if not entered_otp:
        return Response({'message':'invalid otp'},status=status.HTTP_400_BAD_REQUEST)
    
    name=request.session.get('name')
    email=request.session.get('email')
    phone=request.session.get('phone')
    gender=request.session.get('gender')
    password=request.session.get('password')

    user=User_Registration.objects.create(name=name,email=email,phone=phone,gender=gender,password=password)

    for i in ['name','email','phone','gender','password','otp','otp_created']:
        request.session.pop(i,None)

    return Response('regisration sucessful')
    

@api_view(['post'])
def forgetpass(request):
    print('forget otp Htt')
    user_mail=request.data.get('email')
    user=User_Registration.objects.filter(email=user_mail).first()
    if not user:
        return Response({'message':'user not found'},status=status.HTTP_400_BAD_REQUEST)
    print('user mail:',user_mail)
    user.token = uuid.uuid4()  
    user.save()

    reset_link=f'http://127.0.0.1:5173/Reset_pass?token={user.token}'
    message = f"""
    <p>We received a request to reset your password for your account.</p>
    <p>Click the link below to reset your password:</p>
    <p><a href="{reset_link}">{reset_link}</a></p>
    <p>If you did not request a password reset, you can ignore this email.</p>
    """
    send_mail(
        subject='For resetting password',
        message='',
        html_message=message,
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[user_mail],
        fail_silently=False
          )
    return Response({'message':f'A password reset link has been sent to {user_mail}. Please check your inbox.'})

@api_view(['put'])
def resetpass(request):
    print('reset password hit')
    password=request.data.get('password')
    token=request.data.get('token')

    user=User_Registration.objects.filter(token=token).first()
    if not user:
        return Response({'message':'User not found in session'}, status=status.HTTP_400_BAD_REQUEST)

    user.password=make_password(password)
    user.token = uuid.uuid4()
    user.save()
   
    return Response('sucessfull')

@api_view(['post'])
def google_signup(request):
    token=request.data.get('token')
    if not token:
        return Response({'message':'token not found'},status=status.HTTP_400_BAD_REQUEST)
    dinfo = id_token.verify_oauth2_token(token, requests.Request(), GOOGLE_CLIENT_ID)
    email=dinfo['email']
    name=dinfo.get('name','')
    user,created=User_Registration.objects.get_or_create(email=email,
                                                         defaults={'name': name, 'password': ''})
    if  created:
       
        return Response({'message': 'New account created successfully!'})
    else:
        return Response({'message': 'user already exists'},status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def logout(request):
    request.session.flush()
    return Response({'message': 'Logged out successfully'})

@api_view(['post'])
def google_login(request):
    token=request.data.get('token')
    if not token:
        return Response({'message':'token not found'},status=status.HTTP_400_BAD_REQUEST)
    dinfo = id_token.verify_oauth2_token(token, requests.Request(), GOOGLE_CLIENT_ID)
    email=dinfo['email']
    name=dinfo.get('name','')
    user=User_Registration.objects.filter(email=email).first()
    if user:
        request.session.flush() 
        request.session['id']=user.id
        request.session.save()
        print(user.id)
        return Response({'message': 'login successfully!'})
    else:
        return Response({'message': 'user not found'},status=status.HTTP_400_BAD_REQUEST)


@api_view(['post'])
def payment(request):
    user_id=request.session.get('id')
    
    amount=request.data.get('amount')
    print(user_id)
    if not user_id:
        return Response({'message':'NO  user found'},status=status.HTTP_400_BAD_REQUEST)
    user=User_Registration.objects.filter(id=user_id).first()
    if not user:
        return Response({'message':'user not found'},status=status.HTTP_400_BAD_REQUEST)
    client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
    if not client:
        return Response({'message':'client not found'})
    amount_in_paise=int(amount)*100
    order = client.order.create({
        "amount": amount_in_paise,
        "currency": "INR",
        "payment_capture": "1"
    })
    user.premium='true'
    user.save()
    return Response({'order_id':order['id'],
                     'order_amount':order['amount'],
                     'order_currency':order['currency'],
                     'user_email':user.email
                     })



@api_view(['get'])
def profile_view(request):
    user_id=request.session.get('id')
    if not user_id:
        return Response({'message':'user not found'},status=status.HTTP_400_BAD_REQUEST)
    user=User_Registration.objects.get(id=user_id)
    json=registerSerializer(user)
    return Response(json.data)

@api_view(['DELETE'])
def delete_user(request,id):
        user=User_Registration.objects.filter(id=id).first()
        if not user:
            return Response({'message':'No user found'},status=status.HTTP_404_NOT_FOUND)
        user.delete()
        return Response({'message':'user deleted sucessfully'})


@api_view(['put'])
def edit_profile(request):
    user_id=request.session.get('id')
    if not user_id:
        return Response({'message':'usernot found'},status=status.HTTP_404_NOT_FOUND)
    user=User_Registration.objects.filter(id=user_id).first()
    form=registerSerializer(user,data=request.data,partial=True)
    if form.is_valid():
        form.save()
    return Response({'message':'sucessfully edited'})


@api_view(['POST'])
def chat_bot(request):
    user_message = request.data.get("message", "")

    co = cohere.Client(COHERE_API_KEY)

    response = co.chat(
        model="command-r-08-2024",
        message=user_message
    )

    bot_reply = response.text
    return Response({"message": bot_reply})

@api_view(['get'])
def view_users(request):
    users=User_Registration.objects.all()
    form=registerSerializer(users,many=True)
    return Response(form.data)

@api_view(['get'])
def haspremium(request):
    users=User_Registration.objects.filter(premium='true')
    if not users.exists():
        return Response({'msg':'no user found'},status=status.HTTP_404_NOT_FOUND)
    form=registerSerializer(users,many=True)
    return Response(form.data)

@api_view(['get'])
def nopremium(request):
    users=User_Registration.objects.filter(premium='false')
    if not users.exists():
        return Response({'msg':'no user found'},status=status.HTTP_404_NOT_FOUND)
    form=registerSerializer(users,many=True)
    return Response(form.data)

@api_view(['post'])
def user_complaints(request):
    complaint=request.data.get('complaints')
    user_id=request.session.get('id')
    user=User_Registration.objects.filter(id=user_id).first()
    if not user:
        return Response({'message':'user Not found'},status=status.HTTP_404_NOT_FOUND)
    

    obj=Complaints.objects.create(User=user,complaints=complaint)

    return Response({'message':'cmplaint registred'})

@api_view(['get'])
def get_complaints(request):
    all_complaints=Complaints.objects.filter(resolved=False)
    form=complaintSerializer(all_complaints,many=True)
    return Response(form.data)

@api_view(['post'])
def send_reply(request):
    id=request.data.get('id')
    name=request.data.get('user_name')
    email=request.data.get('user_email')

    if not email:
        return Response({'message':'user not found'},status=status.HTTP_404_NOT_FOUND)
    message = f"""
    <p>Hi {name}</p>
    <p>We’ve received your complaint and our team has reviewed it.  
We appreciate you taking the time to share your concern.</p>

<p>Your issue has been addressed, and we’ll make sure it doesn’t happen again.  
If you have any further questions, feel free to reply to this email.</p>

<p>Thank you for your patience and understanding.  
– Team Match Making</p>
    """
    send_mail(
        subject='Response to Your Complaint on Match Making App',
        message='',
        html_message=message,
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[email],
        fail_silently=False
    )
    complaint=Complaints.objects.filter(id=id).first()
    complaint.resolved = True 
    complaint.save()
    if not complaint:
        return Response({'message':'complaint not found'})
    return Response({'message':'response send sucessfully'})

@api_view(['get'])
def get_allcomplaints(request):
      all_complaints=Complaints.objects.all()
      form=complaintSerializer(all_complaints,many=True)
      return Response(form.data)

@api_view(['GET'])
def revenue_flow_chart(request):
    money=600
    today = timezone.now()
    last_week = today - timedelta(days=7)
    revnue=User_Registration.objects.filter(premium='true').count()*money
    total_complaints=Complaints.objects.all().count()
    total_users=User_Registration.objects.all().count()
    new_users=User_Registration.objects.filter(date_joined__gte=last_week).count()
    premium_users=User_Registration.objects.filter(premium='true').values('id','date_joined')
    if not premium_users:
        return Response({'message':'No Users Found'})
    df=pd.DataFrame(premium_users)
    df['date_joined']=pd.to_datetime(df['date_joined'])
    df['month'] = df['date_joined'].dt.to_period('M')
    monthily_count=df['month'].value_counts().sort_index()
    months=monthily_count.index.astype(str)
    values=monthily_count.values

    plt.figure(figsize=(8,5))
    plt.plot(months,values,marker='*',color='blue',linewidth=2)
    plt.title('Premium Users Growth')
    plt.xlabel('months')
    plt.ylabel('Users')
    plt.tight_layout()

    buffer=io.BytesIO()
    plt.savefig(buffer,format='png')
    buffer.seek(0)
    saved_image=buffer.getvalue()
    buffer.close()

    graph = base64.b64encode(saved_image).decode('utf-8')

    premium_users1=User_Registration.objects.filter(premium='true').count()
    non_premium_users=User_Registration.objects.filter(premium='false').count()
    labels=['premium users','free users']
    colors = ['gold', 'lightblue']
    size=[premium_users1,non_premium_users]

    plt.figure(figsize=(6,6))
    plt.pie(size,labels=labels,colors=colors, autopct='%1.1f%%',startangle=90)
    plt.title('User Subscription Distribution')
    plt.legend()
    plt.tight_layout()
    buffer=io.BytesIO()
    plt.savefig(buffer,format='png')
    buffer.seek(0)
    pie=buffer.getvalue()
    buffer.close()
    pie_graph = base64.b64encode(pie).decode('utf-8')

    return Response({'image':graph,'revnue':revnue,'total_complaints':total_complaints,'total_users':total_users,'new_users':new_users,'pie':pie_graph})

@api_view(['GET'])
def get_data(request):
    now = timezone.now()
    last_2_days = now - timedelta(days=2)
    new_users=User_Registration.objects.filter(date_joined__gte=last_2_days)
    new_premiums=User_Registration.objects.filter(premium='true',date_joined__gte=last_2_days)
    new_complaints=Complaints.objects.filter(date__gte=last_2_days)
    user_serializer=registerSerializer(new_users,many=True)
    premium_serializers=registerSerializer(new_premiums,many=True)
    complaints_serializers=complaintSerializer(new_complaints,many=True)

    return Response({'new_users':user_serializer.data,
                     'new_premium':premium_serializers.data,
                     'new_complaints':complaints_serializers.data})

@api_view(['POST'])
def mate_finding(request):
    looking=request.data.get('looking')
    # matched_before=request.session.get('matched_before',[])

    current_user_id=request.session.get('id')
    print("Current user ID from session:", current_user_id)
   
    current_user=User_Registration.objects.filter(id=current_user_id).first()
    print(current_user)
    if not current_user:
        return Response({'message':'user not found'},status=status.HTTP_404_NOT_FOUND)
    
    max_matches=(User_Registration.objects.filter(gender=looking).exclude(id=current_user_id))
    
    current_user_hobbies = set(current_user.hobies)
    match_user=None
    best_match_count=0
    for user  in max_matches:
        print(user)
        user_hobbies=set(user.hobies)
        match_count=len(current_user_hobbies & user_hobbies)
        if match_count>best_match_count and match_count > 0:
            match_user=user
            best_match_count=match_count
    if match_user is None:
        return Response({'message':'no match found'},status=status.HTTP_400_BAD_REQUEST)
    # matched_before.append(match_user.id)
    # request.session["matched_before"] = matched_before
    match_user_json=registerSerializer(match_user,many=False)
    print("Reached end safely")
    print('match_user',match_user,'')


    return Response({'match_user':match_user_json.data})

@api_view(['GET'])
def log_user(request):
    current_user_id=request.session.get('id')

    current_user=User_Registration.objects.filter(id=current_user_id).first()

    if not current_user:
        return Response({'message':'user not found'},status=status.HTTP_404_NOT_FOUND)
    
    user_json=registerSerializer(current_user,many=False)
    return Response(user_json.data)

@api_view(['post'])
def chats(request):
    sender_id=request.session.get('id')
    receiver_id=request.data.get('otheruserid')
    message=request.data.get('message')
    sender=User_Registration.objects.filter(id=sender_id).first()
    receiver=User_Registration.objects.filter(id=receiver_id).first()
    msg=chat.objects.create(sender=sender,receiver=receiver,message=message)
    return Response({'message':'sucess'})

@api_view(['GET'])
def user_list(request):
    current_user_id=request.session.get('id')
    print(current_user_id)
    chats=friend_request.objects.filter(Q(sender_id=current_user_id)|Q(receiver_id=current_user_id),status='Accpected')

    chat_lis={}
    for  c in chats:
        other_user=c.receiver if c.sender.id==current_user_id else c.sender

        if other_user.id not in chat_lis:
            chat_lis[other_user.id]={
                'id':other_user.id,
                'name':other_user.name,
                'profile':other_user.profile.url,
                'isonline':other_user.isonline
            }
    return Response(list(chat_lis.values()))

@api_view(['POST'])
def get_chats(request):
    current_user_id = request.session.get('id')
    other_user_id = request.data.get('otheruserid')
    
    if not other_user_id:
        return Response({'message':'other_user not found'})

    chats = chat.objects.filter(
        Q(sender_id=current_user_id, receiver_id=other_user_id) |
        Q(sender_id=other_user_id, receiver_id=current_user_id)
    ).order_by('timestamp')


    chat_list = []

    for c in chats:
        
        if c.sender.id == current_user_id:
            other_user = c.receiver
        else:
            other_user = c.sender

        chat_list.append({
            'id': c.id,
            'sender': c.sender.id,
            'receiver': c.receiver.id,
            'message': c.message,
            'timestamp': c.timestamp,
            'sender_profile': c.sender.profile.url if c.sender.profile else '',
            'receiver_profile': other_user.profile.url if other_user.profile else ''
        })


    return Response(chat_list)

    
@api_view(['GET'])
def current_user(request):
    user_id=request.session.get('id')
    if not user_id:
        return Response({}, status=status.HTTP_401_UNAUTHORIZED)
    user=User_Registration.objects.filter(id=user_id).first()
    if not user:
        return Response({}, status=status.HTTP_404_NOT_FOUND)
    serializer=registerSerializer(user,many=False)
    return Response(serializer.data)

    
@api_view(['POST'])
def other_user(request):
    print('other user hittttt')
    other=int(request.data.get('otheruserid'))
    print(other)
    user=User_Registration.objects.filter(id=other).first()
    serializer=registerSerializer(user,many=False)
    return Response(serializer.data)

@api_view(['GET'])
def get_all_chats(request):
    allchats=chat.objects.all()
    form=chatserializers(allchats,many=True)
    return Response(form.data)

@api_view(['POST'])
def send_request(request):
    sender_id=request.session.get('id')
    receiver_id=request.data.get('user')
    sender=User_Registration.objects.filter(id=sender_id).first()
    receiver=User_Registration.objects.filter(id=receiver_id).first()
    print(receiver)
    existing_data=friend_request.objects.filter(sender=sender,receiver=receiver).first()
    if existing_data:
        return Response({'message':'friend request has already sended'})
    data=friend_request.objects.create(sender=sender,receiver=receiver,status='Pending')
    return Response ({'message':'request sended'})

@api_view(['GET'])
def get_request(request):
    current_user_id=request.session.get('id')
    requests=friend_request.objects.filter(receiver_id=current_user_id,status='Pending')
    serializer=requestSerializer(requests,many=True)

    for item in serializer.data:
        time=item.get('timestamp')
        if time:
            timestamp = datetime.fromisoformat(time.replace("Z", "+00:00"))
            item["time_ago"] = timesince(timestamp) + " ago"
    return Response(serializer.data)

@api_view(['PUT'])
def accept(request):
    print('function hitt')
    current_user_id=request.session.get('id')
    current_user=User_Registration.objects.filter(id=current_user_id).first()
    otheruser_id=request.data.get('request')
    print('other',otheruser_id)
    otheruser=User_Registration.objects.filter(id=otheruser_id).first()
    if not otheruser:
        return Response({'message':'user not found'})
    print('other',otheruser)
    data=friend_request.objects.filter(sender=otheruser,receiver=current_user,status='Pending').first()
    if not data:
        return Response({'message':'no data found'})
    data.status='Accpected'
    data.save()
    return Response({'message':'Request accepted'})
    

@api_view(['DELETE'])
def reject(request):
    current_user_id=request.session.get('id')
    current_user=User_Registration.objects.filter(id=current_user_id).first()
    otheruser_id=request.data.get('request')
    print('other',otheruser_id)
    otheruser=User_Registration.objects.filter(id=otheruser_id).first()
    if not otheruser:
        return Response({'message':'user not found'})
    print('other',otheruser)
    data=friend_request.objects.filter(sender=otheruser,receiver=current_user,status='Pending').first()
    if data:
        data.delete()
    return Response({'message':'request rejected'})

@api_view(['GET'])
def get_all_request(request):
    allrequest=friend_request.objects.all()
    form=requestSerializer(allrequest,many=True)
    return Response(form.data)


@api_view(['POST'])
def start_call(request):
    user_id = request.session.get('id')
    if not user_id:
        return Response({'error': 'Not logged in'}, status=401)
    user = User_Registration.objects.filter(id=user_id).first()
    if user.premium=='false':
        return Response({'url':'/Subscription'},status=status.HTTP_401_UNAUTHORIZED)
    
    receiver_id = request.data.get('receiver_id')
    channel = request.data.get('channel')
    call_type = request.data.get('call_type', 'audio')
    
    receiver = User_Registration.objects.filter(id=receiver_id).first()
   

    
    
    if not receiver or not user:
        return Response({'error': 'User not found'}, status=404)
    
    call = CallRequest.objects.create(
        sender=user,
        receiver=receiver,
        channel=channel,
        call_type=call_type,
        status='calling'
    )
    
    return Response({
        'status': 'success',
        'call_id': call.id,
        'channel': channel
    })

@api_view(['POST'])
def accept_call(request):
    user_id = request.session.get('id')
    if not user_id:
        return Response({'error': 'Not logged in'}, status=401)
    
    channel = request.data.get('channel')
    
    call = CallRequest.objects.filter(channel=channel, receiver_id=user_id).first()
    if not call:
        return Response({'error': 'Call not found'}, status=404)
    
    call.status = 'accepted'
    call.save()
    
    return Response({'status': 'accepted'})

@api_view(['POST'])
def reject_call(request):
    user_id = request.session.get('id')
    if not user_id:
        return Response({'error': 'Not logged in'}, status=401)
    
    channel = request.data.get('channel')
    
    call = CallRequest.objects.filter(channel=channel, receiver_id=user_id).first()
    if not call:
        return Response({'error': 'Call not found'}, status=404)
    
    call.status = 'rejected'
    call.save()
    
    return Response({'status': 'rejected'})

@api_view(['POST'])
def cancel_call(request):
    user_id = request.session.get('id')
    if not user_id:
        return Response({'error': 'Not logged in'}, status=401)
    
    channel = request.data.get('channel')
    
    call = CallRequest.objects.filter(channel=channel, sender_id=user_id).first()
    if not call:
        return Response({'error': 'Call not found'}, status=404)
    
    call.status = 'cancelled'
    call.save()
    
    return Response({'status': 'cancelled'})

@api_view(['GET'])
def check_call_status(request):
    user_id = request.session.get('id')
    if not user_id:
        return Response({'status': 'not_found'})
    
    channel = request.GET.get('channel')
    
    call = CallRequest.objects.filter(channel=channel).first()
    if not call:
        return Response({'status': 'not_found'})
    
    return Response({'status': call.status})

@api_view(['POST'])
def end_call(request):
    user_id = request.session.get('id')
    if not user_id:
        return Response({'error': 'Not logged in'}, status=401)
    
    channel = request.data.get('channel')
    
    call = CallRequest.objects.filter(channel=channel).first()
    if not call:
        return Response({'error': 'Call not found'}, status=404)
    
    call.status = 'ended'
    call.save()
    
    return Response({'status': 'ended'})

@api_view(['POST'])
def generate_zego_token(request):
    user_id = request.session.get('id')
    if not user_id:
        return Response({'error': 'Not logged in'}, status=401)
    
    user = User_Registration.objects.filter(id=user_id).first()
    if not user:
        return Response({'error': 'User not found'}, status=404)
    
    user_id_str = request.data.get('user_id', str(user.id))
    user_name = request.data.get('user_name', user.name)
    
    token_data = {
        'app_id': ZEGO_APP_ID,
        'user_id': user_id_str,
        'user_name': user_name,
        'timestamp': int(time.time())
    }
    
    token_string = f"{ZEGO_APP_ID}{user_id_str}{user_name}{token_data['timestamp']}{ZEGO_SERVER_SECRET}"
    token_hash = hashlib.md5(token_string.encode()).hexdigest()
    
    token = f"{token_data['timestamp']}:{token_hash}"
    
    return Response({
        'token': token,
        'app_id': ZEGO_APP_ID,
        'user_id': user_id_str,
        'user_name': user_name
    })

@api_view(['GET'])
def check_incoming(request):
    user_id = request.session.get('id')
    if not user_id:
        return Response({'call': None})
    
    call = CallRequest.objects.filter(receiver_id=user_id, status='calling').first()
    
    if call:
        return Response({
            'call': {
                'channel': call.channel,
                'call_type': call.call_type,
                'caller_name': call.sender.name,
                'caller_id': call.sender.id
            }
        })
    
    return Response({'call': None})

@api_view(['GET'])
def active_calls(request):
    user_id = request.session.get('id')
    if not user_id:
        return Response({'active_calls': {}})
    
    user = User_Registration.objects.filter(id=user_id).first()
    if not user:
        return Response({'active_calls': {}})
    
    calls = CallRequest.objects.filter(
        status='accepted'
    ).filter(
        models.Q(sender_id=user_id) | models.Q(receiver_id=user_id)
    )
    
    active_calls_dict = {}
    for call in calls:
        active_calls_dict[call.channel] = {
            'type': call.call_type,
            'participants': [call.sender.id, call.receiver.id],
            'started_at': call.created_at.isoformat() if hasattr(call, 'created_at') else None
        }
    
    return Response({'active_calls': active_calls_dict})

@api_view(['POST'])
def create_call(request):
    user_id = request.session.get('id')
    if not user_id:
        return Response({'error': 'Not logged in'}, status=401)
    
    room_id = request.data.get('room_id')
    caller_id = request.data.get('caller_id')
    receiver_id = request.data.get('receiver_id')
    call_type = request.data.get('call_type', 'audio')
    
    receiver = User_Registration.objects.filter(id=receiver_id).first()
    caller = User_Registration.objects.filter(id=caller_id).first()
    
    if not receiver or not caller:
        return Response({'error': 'User not found'}, status=404)
    
    call = CallRequest.objects.create(
        sender=caller,
        receiver=receiver,
        channel=room_id,
        call_type=call_type,
        status='calling'
    )
    
    return Response({
        'status': 'success',
        'call_id': call.id,
        'room_id': room_id
    })

@api_view(['GET'])
def call_status(request):
    user_id = request.session.get('id')
    if not user_id:
        return Response({'error': 'Not logged in'}, status=401)
    
    room_id = request.GET.get('room_id')
    
    call = CallRequest.objects.filter(channel=room_id).first()
    if not call:
        return Response({'error': 'Call not found'}, status=404)
    
    return Response({
        'status': call.status,
        'call_type': call.call_type,
        'caller_name': call.sender.name,
        'receiver_name': call.receiver.name
    })

@api_view(['POST'])
def join_call(request):
    user_id = request.session.get('id')
    if not user_id:
        return Response({'error': 'Not logged in'}, status=401)
    
    room_id = request.data.get('room_id')
    
    call = CallRequest.objects.filter(channel=room_id).first()
    if not call:
        return Response({'error': 'Call not found'}, status=404)
    
    if user_id not in [call.sender.id, call.receiver.id]:
        return Response({'error': 'Not authorized to join this call'}, status=403)
    
    if user_id == call.receiver.id and call.status == 'calling':
        call.status = 'accepted'
        call.save()
    
    return Response({
        'status': 'joined',
        'call_status': call.status,
        'room_id': room_id
    })

@api_view(['POST'])
def get_users_match(request):
    gender=request.data.get('gender')
    current_user_id=request.session.get('id')
    current_user=User_Registration.objects.filter(id=current_user_id).first()
    friends=friend_request.objects.filter(Q(receiver=current_user)|Q(sender=current_user),status='Accpected')
    friend_ids = []
    for f in friends:
        friend_ids.append(f.sender.id)
        friend_ids.append(f.receiver.id)

    users=User_Registration.objects.filter(gender=gender).exclude(id=current_user_id).exclude(id__in=friend_ids)
    serializer=registerSerializer(users,many=True)
    if not users:
        return Response({'message':'No user found'},status=status.HTTP_404_NOT_FOUND)
    return Response(serializer.data)

@api_view(['POST'])
def view_profile(request):
    user_id=request.data.get('id')
    print('userid',user_id)
    user=User_Registration.objects.filter(id=user_id).first()
    if not user:
        return Response({'message':'user not found'})
    form=registerSerializer(user,many=False)
    return Response(form.data)

@api_view(['GET'])
def check_premium(request):
    current_user_id=request.session.get('id')
    print(current_user_id)
    current_user=User_Registration.objects.filter(id=current_user_id).first()
    if current_user.premium=='false':
        return Response({'url':'/Subscription'},status=status.HTTP_404_NOT_FOUND)
    return Response({'message':'sucess'})

@csrf_exempt
@api_view(['POST'])
def update_time(request):
    current_user_id=request.session.get('id')
    if not current_user_id:
        return Response({'status':'ok'},status=200)
    User_Registration.objects.filter(id=current_user_id).update(
        last_active=timezone.now(),
        isonline='online'
    )
    return Response({'status':'ok'})

@api_view(['POST'])
def check_online(request):
    users = User_Registration.objects.all()
    threshold = timedelta(minutes=5)
    now = timezone.now()
    to_update = []

    for user in users:
        old_status = user.isonline
        if user.last_active and now - user.last_active < threshold:
            user.isonline = 'online'
        else:
            user.isonline = 'offline'
        
        if old_status != user.isonline:
            to_update.append(user)
    
    if to_update:
        User_Registration.objects.bulk_update(to_update, ['isonline'])
    
    return Response({'status': 'ok'})