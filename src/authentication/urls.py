from django.urls import path
from . import views

urlpatterns = [
    # Authentication
    path('register/', views.UserRegisterView.as_view(), name='register'),
    path('login/', views.UserLoginView.as_view(), name='login'),
    path('logout/', views.UserLogoutView.as_view(), name='logout'),
    
    # User management
    path('me/', views.UserDetailView.as_view(), name='user-detail'),
    path('activity/', views.UserActivityView.as_view(), name='user-activity'),
    
    # Password reset
    path('password/reset/', views.PasswordResetRequestView.as_view(), name='password-reset'),
    path('password/reset/confirm/', views.PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    
    # Email verification
    path('verify-email/', views.EmailVerificationView.as_view(), name='verify-email'),
    
    # Admin endpoints
    path('admin/users/', views.AdminUserListView.as_view(), name='admin-user-list'),
    path('admin/users/<uuid:pk>/lock/', views.AdminUserLockView.as_view(), name='admin-user-lock'),
    path('admin/users/<uuid:pk>/unlock/', views.AdminUserUnlockView.as_view(), name='admin-user-unlock'),
]