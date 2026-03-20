"""
apps/investments/models.py
"""
import uuid
from django.db import models
from django.conf import settings
from apps.core.models import TimeStampedModel


class Investment(TimeStampedModel):

    class Status(models.TextChoices):
        NEGOTIATION = 'negotiation', 'En négociation'
        CONTRACT_SENT = 'contract_sent', 'Contrat envoyé'
        SIGNED      = 'signed',      'Contrat signé'
        PAYMENT_PENDING = 'payment_pending', 'Paiement en attente'
        PAID        = 'paid',        'Payé'
        ACTIVE      = 'active',      'Actif (en cours)'
        COMPLETED   = 'completed',   'Complété'
        CANCELLED   = 'cancelled',   'Annulé'

    class PaymentMethod(models.TextChoices):
        MOBILE_MONEY  = 'mobile_money',  'Mobile Money'
        BANK_TRANSFER = 'bank_transfer', 'Virement bancaire'
        ESCROW        = 'escrow',        'Séquestre GOLDEN'

    # ── Parties ─────────────────────────────────────────────
    investor = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='investments', verbose_name='Investisseur')
    project  = models.ForeignKey(
        'projects.Project', on_delete=models.CASCADE,
        related_name='investments', verbose_name='Projet')

    # ── Montant & conditions ─────────────────────────────────
    amount          = models.DecimalField(max_digits=15, decimal_places=2, verbose_name='Montant (FCFA)')
    equity_percent  = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True,
                                          verbose_name='Part (% équité)')
    roi_agreed      = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True,
                                          verbose_name='ROI convenu (%)')
    duration_months = models.PositiveIntegerField(null=True, blank=True,
                                                   verbose_name='Durée convenue (mois)')

    # ── Statut & paiement ────────────────────────────────────
    status         = models.CharField(max_length=20, choices=Status.choices,
                                       default=Status.NEGOTIATION)
    payment_method = models.CharField(max_length=20, choices=PaymentMethod.choices,
                                       blank=True, default='')
    payment_ref    = models.CharField(max_length=200, blank=True,
                                       verbose_name='Référence de paiement')
    commission_rate = models.DecimalField(max_digits=4, decimal_places=2, default=2.0,
                                           verbose_name='Commission GOLDEN (%)')

    # ── Contrat ──────────────────────────────────────────────
    contract_url     = models.URLField(blank=True, verbose_name='URL du contrat signé')
    contract_sent_at = models.DateTimeField(null=True, blank=True)
    signed_at        = models.DateTimeField(null=True, blank=True)

    # ── Paiement ─────────────────────────────────────────────
    paid_at          = models.DateTimeField(null=True, blank=True)

    # ── Notes ────────────────────────────────────────────────
    notes = models.TextField(blank=True)

    class Meta:
        verbose_name = 'Investissement'
        verbose_name_plural = 'Investissements'
        ordering = ['-created_at']
        indexes = [models.Index(fields=['investor', 'status'])]

    def __str__(self):
        return f'{self.investor.email} → {self.project.title} — {self.amount} FCFA'

    @property
    def commission_amount(self):
        return round(float(self.amount) * float(self.commission_rate) / 100, 2)

    @property
    def net_amount(self):
        return float(self.amount) - self.commission_amount
