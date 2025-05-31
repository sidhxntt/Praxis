# api/admin.py
from django.contrib import admin
from .models import Address, Album, Image, Post, Todo

@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    """
    fieldsets: Organizes form sections visually 
    """
    list_display = ('id', 'street', 'city', 'zipcode', 'user')
    search_fields = ('street', 'city', 'zipcode')
    list_filter = ('city', 'country')
    readonly_fields = ('created_at', 'updated_at')
    autocomplete_fields = ('user',)
    date_hierarchy = 'created_at'
    fieldsets = (
        (None, {
            'fields': ('street', 'suite', 'city', 'state', 'zipcode', 'country')
        }),
        ('User Info', {
            'fields': ('user',),
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
        }),
    )


@admin.register(Album)
class AlbumAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'user')
    search_fields = ('title',)
    list_filter = ('category', 'user')
    readonly_fields = ('created_at', 'updated_at')
    autocomplete_fields = ('user',)
    date_hierarchy = 'created_at'
    fieldsets = (
        (None, {
            'fields': ('title', 'category'),
        }),
        ('User Info', {
            'fields': ('user',),
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
        }),
    )


@admin.register(Image)
class ImageAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'album', 'user')
    search_fields = ('title', 'album__title')
    list_filter = ('album', 'user')
    readonly_fields = ('created_at', 'updated_at')
    autocomplete_fields = ('album', 'user')
    date_hierarchy = 'created_at'
    fieldsets = (
        (None, {
            'fields': ('title', 'url', 'thumbnail_url'),
        }),
        ('Relations', {
            'fields': ('album', 'user'),
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
        }),
    )


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'user')
    search_fields = ('title', 'body')
    list_filter = ('user',)
    readonly_fields = ('created_at', 'updated_at')
    autocomplete_fields = ('user',)
    date_hierarchy = 'created_at'
    fieldsets = (
        (None, {
            'fields': ('title', 'body'),
        }),
        ('User Info', {
            'fields': ('user',),
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
        }),
    )


@admin.register(Todo)
class TodosAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'completed', 'user')
    search_fields = ('title',)
    list_filter = ('completed', 'user')
    readonly_fields = ('created_at', 'updated_at')
    autocomplete_fields = ('user',)
    date_hierarchy = 'created_at'
    fieldsets = (
        (None, {
            'fields': ('title', 'completed'),
        }),
        ('User Info', {
            'fields': ('user',),
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
        }),
    )
