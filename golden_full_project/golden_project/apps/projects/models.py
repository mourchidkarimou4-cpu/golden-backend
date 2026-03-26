"""
apps/projects/models.py
"""
import uuid
from django.db import models
from django.conf import settings
from apps.core.models import TimeStampedModel


class Project(TimeStampedModel):

    class Status(models.TextChoices):
        DRAFT          = 'draft',          'Brouillon'
        PENDING_REVIEW = 'pending_review', 'En attente de validation'
        ACTIVE         = 'active',         'Actif'
        FUNDED         = 'funded',         'Financé'
        CLOSED         = 'closed',         'Clôturé'
        REJECTED       = 'rejected',       'Rejeté'

    class Sector(models.TextChoices):
        AGRO        = 'agro',        'Agro-industrie'
        TECH        = 'tech',        'Technologie'
        ENERGY      = 'energy',      'Énergie'
        HEALTH      = 'health',      'Santé'
        EDUCATION   = 'education',   'Éducation'
        REAL_ESTATE = 'real_estate', 'Immobilier'
        TRANSPORT   = 'transport',   'Transport'
        COMMERCE    = 'commerce',    'Commerce'
        FINANCE     = 'finance',     'Finance'
        TOURISM     = 'tourism',     'Tourisme'
        CRAFTS      = 'crafts',      'Artisanat'
        OTHER       = 'other',       'Autre'

    class RiskLevel(models.TextChoices):
        LOW    = 'low',    'Faible'
        MEDIUM = 'medium', 'Moyen'
        HIGH   = 'high',   'Élevé'

    # ── Propriétaire ────────────────────────────────────────
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='projects',
        verbose_name='Porteur de projet',
    )

    # ── Infos générales ─────────────────────────────────────
    title       = models.CharField(max_length=200, verbose_name='Titre')
    tagline     = models.CharField(max_length=300, blank=True, verbose_name='Accroche')
    description = models.TextField(verbose_name='Description détaillée')
    sector      = models.CharField(max_length=20, choices=Sector.choices, verbose_name='Secteur')
    country     = models.CharField(max_length=100, default='Bénin', verbose_name='Pays')
    city        = models.CharField(max_length=100, blank=True, verbose_name='Ville')
    cover_image = models.ImageField(upload_to='projects/covers/%Y/%m/', blank=True, null=True)

    # ── Finances ────────────────────────────────────────────
    amount_needed  = models.DecimalField(max_digits=15, decimal_places=2, verbose_name='Montant recherché (FCFA)')
    amount_raised  = models.DecimalField(max_digits=15, decimal_places=2, default=0, verbose_name='Montant levé (FCFA)')
    roi_estimated  = models.DecimalField(max_digits=5, decimal_places=2, verbose_name='ROI estimé (%)')
    duration_months = models.PositiveIntegerField(verbose_name='Durée (mois)')
    min_investment = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True,
                                         verbose_name='Investissement minimum (FCFA)')

    # ── Statut & risque ─────────────────────────────────────
    status     = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
    risk_level = models.CharField(max_length=10, choices=RiskLevel.choices, default=RiskLevel.MEDIUM)

    # ── Métriques ────────────────────────────────────────────
    views_count    = models.PositiveIntegerField(default=0)
    interest_count = models.PositiveIntegerField(default=0)

    # ── Validation admin ─────────────────────────────────────
    reviewed_by  = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True,
        on_delete=models.SET_NULL, related_name='reviewed_projects')
    reviewed_at  = models.DateTimeField(null=True, blank=True)
    review_notes = models.TextField(blank=True)

    class Meta:
        verbose_name = 'Projet'
        verbose_name_plural = 'Projets'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', 'sector']),
            models.Index(fields=['owner']),
        ]

    def __str__(self):
        return f'{self.title} ({self.get_status_display()})'

    @property
    def funding_percentage(self):
        if self.amount_needed == 0:
            return 0
        return round(float(self.amount_raised) / float(self.amount_needed) * 100, 1)

    @property
    def is_fully_funded(self):
        return self.amount_raised >= self.amount_needed


class ProjectDocument(models.Model):
    """Documents attachés à un projet (pitch deck, business plan, etc.)."""

    class DocType(models.TextChoices):
        PITCH_DECK     = 'pitch_deck',     'Pitch Deck'
        BUSINESS_PLAN  = 'business_plan',  'Business Plan'
        FINANCIAL_STMT = 'financial_stmt', 'États financiers'
        LICENSE        = 'license',        'Licence / Autorisation'
        OTHER          = 'other',          'Autre'

    id       = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project  = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='documents')
    doc_type = models.CharField(max_length=20, choices=DocType.choices)
    title    = models.CharField(max_length=200)
    file     = models.FileField(upload_to='projects/documents/%Y/%m/')
    is_public = models.BooleanField(default=False,
                                    help_text='Visible sans être connecté si True')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['doc_type']

    def __str__(self):
        return f'{self.project.title} — {self.get_doc_type_display()}'


class ProjectFavorite(models.Model):
    """Un investisseur met un projet en favori."""
    id        = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    investor  = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
                                   related_name='favorites')
    project   = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='favorited_by')
    note      = models.TextField(blank=True, verbose_name='Note privée')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('investor', 'project')
        verbose_name = 'Favori'


class ProjectShareToken(models.Model):
    """Token sécurisé pour partager un projet publiquement (72h)."""
    id         = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project    = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='share_tokens')
    token      = models.CharField(max_length=64, unique=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_active  = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'Token de partage'
        ordering = ['-created_at']

    def __str__(self):
        return f'Share:{self.project.title} ({self.token[:8]}...)'

    @property
    def is_valid(self):
        from django.utils import timezone
        return self.is_active and self.expires_at > timezone.now()
