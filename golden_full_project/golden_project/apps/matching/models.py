"""
apps/matching/models.py
Modèle de score de matching et algorithme de recommandation.
"""
import uuid
from django.db import models
from django.conf import settings
from apps.core.models import TimeStampedModel


class Match(TimeStampedModel):
    """Score de matching entre un investisseur et un projet."""

    investor    = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='matches')
    project     = models.ForeignKey(
        'projects.Project', on_delete=models.CASCADE, related_name='matches')
    score       = models.FloatField(default=0.0, help_text='Score de 0 à 100')
    criteria    = models.JSONField(default=dict, help_text='Détail des critères de scoring')
    is_dismissed = models.BooleanField(default=False,
                                        help_text='L\'investisseur a ignoré cette recommandation')

    class Meta:
        unique_together = ('investor', 'project')
        ordering = ['-score']
        verbose_name = 'Match'
        verbose_name_plural = 'Matchs'

    def __str__(self):
        return f'{self.investor.email} ↔ {self.project.title} ({self.score:.1f})'
