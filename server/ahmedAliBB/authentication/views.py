from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponseRedirect, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import User
from rest_framework.permissions import IsAuthenticated
import json
from django.db import IntegrityError

# from .serializers import PostSerializer, UserSerializer

# Create your views here.
@csrf_exempt
def login_view(request):
    if request.method == "POST":
        
        print(f"request: {request}")
        
        user_data = json.loads(request.body)
        
        # Attempt to sign user in
        username = user_data["username"]
        password = user_data["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            # user_data = UserSerializer(request.user).data
            user_data = {
                "username": request.user.username,
                "email": request.user.email,
                "firstname": request.user.first_name,
                "lastname": request.user.last_name,
            }
            return JsonResponse({"user_data": user_data})
        else:
            return JsonResponse({"message": "Invalid username and/or password"}, status=403)

@csrf_exempt
def logout_view(request):
    logout(request)
    return JsonResponse({"message": "logout out successfully"})

@csrf_exempt
def register_view(request):
    if request.method == "POST":
        
        user_data = json.loads(request.body)
        
        print("user_data", user_data)
         
        first_name = user_data["firstName"]
        last_name = user_data["lastName"]
        username = user_data["username"]
        # Ensure password matches confirmation
        password = user_data["password"]
        confirm_password = user_data["confirmPassword"]

        user_data = {
            "firstname": first_name,
            "lastname": last_name,
            "username": username,
        }

        if password != confirm_password:
            return JsonResponse({"message": "passwords doesn't match"})

        # Attempt to create new user
        try:
            user = User.objects.create_user(username=username, password=password)
            user.first_name = first_name
            user.last_name = last_name
            user.save()
        except IntegrityError:

            return JsonResponse({"message": "Invalid username and/or password"})
        
        login(request, user)
        return JsonResponse({"user_data": user_data})