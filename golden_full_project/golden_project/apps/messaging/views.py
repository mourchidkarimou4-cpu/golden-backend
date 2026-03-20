"""
apps/messaging/views.py
"""
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone

from .models import MessageThread, Message
from .serializers import (
    ThreadListSerializer, ThreadCreateSerializer, MessageSerializer
)
from apps.core.permissions import IsParticipant


class ThreadListCreateView(APIView):
    """
    GET  /api/v1/messages/threads/  → liste des threads de l'utilisateur
    POST /api/v1/messages/threads/  → créer un nouveau thread
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        threads = MessageThread.objects.filter(
            participants=request.user, is_archived=False
        ).prefetch_related('participants', 'messages').order_by('-updated_at')
        serializer = ThreadListSerializer(threads, many=True, context={'request': request})
        return Response({'results': serializer.data, 'count': threads.count()})

    def post(self, request):
        serializer = ThreadCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        project   = data['project_id']   # déjà résolu en objet Project
        recipient = data['recipient_id']  # déjà résolu en objet User

        # Éviter les doublons de thread sur le même projet entre les mêmes personnes
        existing = MessageThread.objects.filter(
            project=project, participants=request.user
        ).filter(participants=recipient).first()

        if existing:
            return Response(
                ThreadListSerializer(existing, context={'request': request}).data,
                status=status.HTTP_200_OK
            )

        thread = MessageThread.objects.create(
            project=project,
            subject=data.get('subject') or f'Discussion — {project.title}',
        )
        thread.participants.add(request.user, recipient)

        # Premier message
        Message.objects.create(
            thread=thread,
            sender=request.user,
            body=data['first_message'],
        )
        # TODO: notifier le destinataire (Celery)
        return Response(
            ThreadListSerializer(thread, context={'request': request}).data,
            status=status.HTTP_201_CREATED
        )


class MessageListCreateView(APIView):
    """
    GET  /api/v1/messages/threads/{id}/  → messages du thread
    POST /api/v1/messages/threads/{id}/  → envoyer un message
    """
    permission_classes = [permissions.IsAuthenticated]

    def get_thread(self, thread_id, user):
        try:
            return MessageThread.objects.get(id=thread_id, participants=user)
        except MessageThread.DoesNotExist:
            return None

    def get(self, request, thread_id):
        thread = self.get_thread(thread_id, request.user)
        if not thread:
            return Response({'error': 'Thread introuvable.'}, status=status.HTTP_404_NOT_FOUND)

        messages = thread.messages.select_related('sender').prefetch_related('attachments')

        # Marquer comme lus les messages non envoyés par l'utilisateur courant
        now = timezone.now()
        messages.filter(read_at__isnull=True).exclude(sender=request.user).update(read_at=now)

        serializer = MessageSerializer(messages, many=True, context={'request': request})
        return Response({'thread_id': str(thread_id), 'results': serializer.data})

    def post(self, request, thread_id):
        thread = self.get_thread(thread_id, request.user)
        if not thread:
            return Response({'error': 'Thread introuvable.'}, status=status.HTTP_404_NOT_FOUND)

        body = request.data.get('body', '').strip()
        if not body:
            return Response({'error': 'Le message ne peut pas être vide.'},
                            status=status.HTTP_400_BAD_REQUEST)

        message = Message.objects.create(thread=thread, sender=request.user, body=body)
        # Mettre à jour updated_at du thread
        thread.save(update_fields=['updated_at'])

        # TODO: notifier les autres participants (Celery + WebSocket)
        return Response(
            MessageSerializer(message, context={'request': request}).data,
            status=status.HTTP_201_CREATED
        )
