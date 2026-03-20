"""apps/messaging/admin.py"""
from django.contrib import admin
from .models import MessageThread, Message


class MessageInline(admin.TabularInline):
    model  = Message
    extra  = 0
    fields = ['sender', 'body', 'read_at', 'created_at']
    readonly_fields = ['created_at']


@admin.register(MessageThread)
class MessageThreadAdmin(admin.ModelAdmin):
    list_display  = ['__str__', 'project', 'is_archived', 'created_at']
    list_filter   = ['is_archived']
    search_fields = ['subject', 'project__title']
    inlines       = [MessageInline]
