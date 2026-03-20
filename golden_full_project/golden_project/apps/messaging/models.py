"""
apps/messaging/models.py
"""
import uuid
from django.db import models
from django.conf import settings
from apps.core.models import TimeStampedModel


class MessageThread(TimeStampedModel):
    """Fil de discussion entre un investisseur et un porteur."""

    subject      = models.CharField(max_length=300, blank=True)
    participants = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='threads',
        verbose_name='Participants',
    )
    # Lien optionnel vers un projet spécifique
    project = models.ForeignKey(
        'projects.Project', null=True, blank=True,
        on_delete=models.SET_NULL, related_name='threads')

    is_archived = models.BooleanField(default=False)

    class Meta:
        verbose_name = 'Fil de discussion'
        verbose_name_plural = 'Fils de discussion'

    def __str__(self):
        return self.subject or f'Thread {self.id}'

    @property
    def last_message(self):
        return self.messages.order_by('-created_at').first()

    @property
    def unread_count_for(self):
        """Retourne un dict {user_id: nb_non_lus}."""
        return {
            p.id: self.messages.filter(read_at__isnull=True).exclude(sender=p).count()
            for p in self.participants.all()
        }


class Message(TimeStampedModel):
    """Un message dans un fil de discussion."""

    thread  = models.ForeignKey(MessageThread, on_delete=models.CASCADE, related_name='messages')
    sender  = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_messages')
    body    = models.TextField()
    read_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['created_at']
        verbose_name = 'Message'

    def __str__(self):
        return f'{self.sender.email} → {self.thread} ({self.created_at:%d/%m/%Y %H:%M})'

    @property
    def is_read(self):
        return self.read_at is not None


class MessageAttachment(models.Model):
    """Pièce jointe à un message."""
    id      = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    message = models.ForeignKey(Message, on_delete=models.CASCADE, related_name='attachments')
    file    = models.FileField(upload_to='messages/attachments/%Y/%m/')
    filename = models.CharField(max_length=255)
    uploaded_at = models.DateTimeField(auto_now_add=True)
