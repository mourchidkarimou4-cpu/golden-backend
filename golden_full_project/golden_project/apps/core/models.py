"""
apps/core/models.py
Modèle de base partagé par toutes les apps.
"""
import uuid
from django.db import models
from django.conf import settings


class TimeStampedModel(models.Model):
    """
    Modèle abstrait ajoutant created_at et updated_at à tous les modèles.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
        ordering = ['-created_at']


class StatusHistory(models.Model):
    """Historique des changements de statut d'un investissement."""
    id             = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    investment     = models.ForeignKey('investments.Investment', on_delete=models.CASCADE, related_name='status_history')
    old_status     = models.CharField(max_length=20, blank=True)
    new_status     = models.CharField(max_length=20)
    changed_by     = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL)
    changed_at     = models.DateTimeField(auto_now_add=True)
    note           = models.TextField(blank=True)

    class Meta:
        verbose_name = 'Historique statut'
        ordering = ['-changed_at']

    def __str__(self):
        return f'{self.investment} : {self.old_status} → {self.new_status}'


class Notification(models.Model):
    """Notifications utilisateur."""
    class Type(models.TextChoices):
        INVESTMENT  = 'investment',  'Investissement'
        MESSAGE     = 'message',     'Message'
        PROJECT     = 'project',     'Projet'
        KYC         = 'kyc',         'KYC'
        SYSTEM      = 'system',      'Système'

    id         = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user       = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    type       = models.CharField(max_length=20, choices=Type.choices)
    title      = models.CharField(max_length=200)
    message    = models.TextField(blank=True)
    is_read    = models.BooleanField(default=False)
    link       = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Notification'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.user} — {self.title}'
