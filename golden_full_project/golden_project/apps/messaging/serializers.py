"""
apps/messaging/serializers.py
"""
from rest_framework import serializers
from django.utils import timezone
from .models import MessageThread, Message, MessageAttachment
from apps.users.serializers import UserPublicSerializer


class MessageAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model  = MessageAttachment
        fields = ['id', 'file', 'filename', 'uploaded_at']


class MessageSerializer(serializers.ModelSerializer):
    sender = UserPublicSerializer(read_only=True)
    attachments = MessageAttachmentSerializer(many=True, read_only=True)
    is_read = serializers.ReadOnlyField()

    class Meta:
        model  = Message
        fields = ['id', 'sender', 'body', 'attachments', 'is_read', 'read_at', 'created_at']
        read_only_fields = ['id', 'sender', 'read_at', 'created_at']


class ThreadListSerializer(serializers.ModelSerializer):
    participants    = UserPublicSerializer(many=True, read_only=True)
    last_message_body = serializers.SerializerMethodField()
    last_message_at   = serializers.SerializerMethodField()
    unread_count      = serializers.SerializerMethodField()
    project_title     = serializers.CharField(source='project.title', read_only=True, default=None)

    class Meta:
        model  = MessageThread
        fields = [
            'id', 'subject', 'participants', 'project_title',
            'last_message_body', 'last_message_at', 'unread_count',
            'is_archived', 'created_at',
        ]

    def get_last_message_body(self, obj):
        msg = obj.last_message
        if msg:
            return msg.body[:80] + ('…' if len(msg.body) > 80 else '')
        return None

    def get_last_message_at(self, obj):
        msg = obj.last_message
        return msg.created_at if msg else None

    def get_unread_count(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.messages.filter(
                read_at__isnull=True
            ).exclude(sender=request.user).count()
        return 0


class ThreadCreateSerializer(serializers.Serializer):
    project_id   = serializers.UUIDField()
    recipient_id = serializers.UUIDField()
    subject      = serializers.CharField(max_length=300, required=False, default='')
    first_message = serializers.CharField()

    def validate_project_id(self, value):
        from apps.projects.models import Project
        try:
            return Project.objects.get(id=value, status='active')
        except Project.DoesNotExist:
            raise serializers.ValidationError('Projet introuvable ou inactif.')

    def validate_recipient_id(self, value):
        from django.contrib.auth import get_user_model
        User = get_user_model()
        try:
            return User.objects.get(id=value)
        except User.DoesNotExist:
            raise serializers.ValidationError('Destinataire introuvable.')
