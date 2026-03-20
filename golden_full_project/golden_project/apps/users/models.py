"""
apps/users/models.py
Modèle utilisateur personnalisé GOLDEN.
"""
import uuid
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("L'adresse email est obligatoire.")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('role', 'admin')
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_kyc_verified', True)
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):

    class Role(models.TextChoices):
        PORTEUR      = 'porteur',       'Porteur de projet'
        INVESTISSEUR = 'investisseur',  'Investisseur'
        ADMIN        = 'admin',         'Administrateur'

    class KYCStatus(models.TextChoices):
        NOT_SUBMITTED = 'not_submitted', 'Non soumis'
        PENDING       = 'pending',       'En attente'
        APPROVED      = 'approved',      'Approuvé'
        REJECTED      = 'rejected',      'Rejeté'

    # ── Identification ──────────────────────────────────────
    id           = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email        = models.EmailField(unique=True, verbose_name='Adresse email')
    phone_number = models.CharField(max_length=20, blank=True, verbose_name='Téléphone')

    # ── Profil ──────────────────────────────────────────────
    first_name   = models.CharField(max_length=100, blank=True)
    last_name    = models.CharField(max_length=100, blank=True)
    avatar       = models.ImageField(upload_to='avatars/', blank=True, null=True)
    country      = models.CharField(max_length=100, blank=True, default='Bénin')
    city         = models.CharField(max_length=100, blank=True)
    bio          = models.TextField(blank=True)

    # ── Rôle & statut ───────────────────────────────────────
    role         = models.CharField(max_length=20, choices=Role.choices, default=Role.PORTEUR)
    is_active    = models.BooleanField(default=True)
    is_staff     = models.BooleanField(default=False)
    is_email_verified = models.BooleanField(default=False)

    # ── KYC ─────────────────────────────────────────────────
    kyc_status       = models.CharField(
        max_length=20, choices=KYCStatus.choices, default=KYCStatus.NOT_SUBMITTED)
    is_kyc_verified  = models.BooleanField(default=False)
    kyc_submitted_at = models.DateTimeField(null=True, blank=True)
    kyc_reviewed_at  = models.DateTimeField(null=True, blank=True)
    kyc_notes        = models.TextField(blank=True)

    # ── Préférences investisseur ─────────────────────────────
    preferred_sectors   = models.JSONField(default=list, blank=True)
    preferred_countries = models.JSONField(default=list, blank=True)
    min_investment      = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    max_investment      = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    risk_profile        = models.CharField(
        max_length=10,
        choices=[('low','Faible'), ('medium','Moyen'), ('high','Élevé')],
        default='medium')

    # ── Timestamps ──────────────────────────────────────────
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD  = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        verbose_name = 'Utilisateur'
        verbose_name_plural = 'Utilisateurs'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.get_full_name()} <{self.email}>'

    def get_full_name(self):
        return f'{self.first_name} {self.last_name}'.strip() or self.email

    @property
    def can_submit_project(self):
        return self.role == self.Role.PORTEUR and self.is_kyc_verified

    @property
    def can_invest(self):
        return self.role == self.Role.INVESTISSEUR and self.is_kyc_verified


class KYCDocument(models.Model):
    """Documents soumis pour la vérification KYC."""

    class DocType(models.TextChoices):
        ID_CARD   = 'id_card',   'Carte d\'identité'
        PASSPORT  = 'passport',  'Passeport'
        SELFIE    = 'selfie',    'Selfie avec pièce'
        PROOF_ADDRESS = 'proof_address', 'Justificatif de domicile'
        BUSINESS_REG  = 'business_reg',  'Registre de commerce'

    id      = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user    = models.ForeignKey(User, on_delete=models.CASCADE, related_name='kyc_documents')
    doc_type = models.CharField(max_length=20, choices=DocType.choices)
    file    = models.FileField(upload_to='kyc/%Y/%m/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Document KYC'
        verbose_name_plural = 'Documents KYC'

    def __str__(self):
        return f'{self.user.email} — {self.get_doc_type_display()}'
