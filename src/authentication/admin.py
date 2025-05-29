from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

class CustomUserAdmin(UserAdmin):
    list_display = (
        'email', 'username', 'first_name', 'last_name', 'role',
        'is_active', 'is_staff', 'is_superuser', 'email_verified',
        'last_login', 'date_joined'
    )
    list_filter = ('is_active', 'is_staff', 'is_superuser', 'role', 'email_verified')
    search_fields = ('email', 'username', 'first_name', 'last_name')
    ordering = ('-date_joined',)
    filter_horizontal = ()
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': (
            'username', 'first_name', 'last_name', 'full_name',
            'phone', 'website', 'bio', 'profile_image'
        )}),
        ('Permissions', {'fields': (
            'is_active', 'is_staff', 'is_superuser', 'role',
            'groups', 'user_permissions'
        )}),
        ('Important Dates', {'fields': (
            'last_login', 'date_joined', 'last_updated',
            'password_changed'
        )}),
        ('Security', {'fields': (
            'email_verified', 'failed_login_attempts',
            'last_failed_login', 'password_reset_token',
            'password_reset_expires'
        )}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2'),
        }),
    )
    
    readonly_fields = (
        'last_login', 'date_joined', 'last_updated',
        'password_changed', 'failed_login_attempts',
        'last_failed_login'
    )
    
    actions = ['activate_users', 'deactivate_users']
    
    def activate_users(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated} users activated')
    activate_users.short_description = "Activate selected users"
    
    def deactivate_users(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated} users deactivated')
    deactivate_users.short_description = "Deactivate selected users"

admin.site.register(User, CustomUserAdmin)