from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import login, logout
from django.shortcuts import get_object_or_404
from .models import User
from .serializers import (
    UserSerializer,
    UserCreateSerializer,
    PasswordResetSerializer,
    EmailVerificationSerializer,
    UserActivitySerializer
)
from .managers import (
    EmailVerificationManager,
    PasswordResetManager,
    SecurityManager
)

class UserRegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserCreateSerializer
    permission_classes = [permissions.AllowAny]
    
    def perform_create(self, serializer):
        user = serializer.save()
        EmailVerificationManager.send_verification_email(user, self.request)
        login(self.request, user)

class UserLoginView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        from django.contrib.auth import authenticate
        email = request.data.get('email')
        password = request.data.get('password')
        
        user = authenticate(email=email, password=password)
        
        if user is not None:
            if user.is_active:
                login(request, user)
                return Response({'status': 'success'})
            return Response(
                {'error': 'Account is locked'},
                status=status.HTTP_403_FORBIDDEN
            )
        else:
            try:
                user = User.objects.get(email=email)
                user.register_failed_login()
            except User.DoesNotExist:
                pass
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )

class UserLogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        logout(request)
        return Response({'status': 'success'})

class UserDetailView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user

class PasswordResetRequestView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        try:
            user = User.objects.get(email=email)
            PasswordResetManager.send_reset_email(user, request)
            return Response({'status': 'Email sent'})
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )

class PasswordResetConfirmView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = User.objects.get(email=serializer.validated_data['email'])
                if PasswordResetManager.is_token_valid(user, serializer.validated_data['token']):
                    user.set_password(serializer.validated_data['new_password'])
                    user.password_reset_token = None
                    user.password_reset_expires = None
                    user.save()
                    return Response({'status': 'Password reset successful'})
                return Response(
                    {'error': 'Invalid or expired token'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            except User.DoesNotExist:
                return Response(
                    {'error': 'User not found'},
                    status=status.HTTP_404_NOT_FOUND
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class EmailVerificationView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = EmailVerificationSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = User.objects.get(email_verification_token=serializer.validated_data['token'])
                user.email_verified = True
                user.email_verification_token = None
                user.save()
                return Response({'status': 'Email verified'})
            except User.DoesNotExist:
                return Response(
                    {'error': 'Invalid token'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserActivityView(generics.RetrieveAPIView):
    serializer_class = UserActivitySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user

class AdminUserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]

class AdminUserLockView(APIView):
    permission_classes = [permissions.IsAdminUser]
    
    def post(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        SecurityManager.lock_account_and_notify(user)
        return Response({'status': 'Account locked'})

class AdminUserUnlockView(APIView):
    permission_classes = [permissions.IsAdminUser]
    
    def post(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        SecurityManager.unlock_account(user)
        return Response({'status': 'Account unlocked'})