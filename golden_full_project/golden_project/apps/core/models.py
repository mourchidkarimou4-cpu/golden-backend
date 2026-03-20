"""
apps/core/models.py
Modèle de base partagé par toutes les apps.
"""
import uuid
from django.db import models


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
