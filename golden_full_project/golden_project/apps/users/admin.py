"""apps/users/admin.py"""
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, KYCDocument


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display   = ['email', 'get_full_name', 'role', 'kyc_status', 'is_kyc_verified', 'is_active', 'created_at']
    list_filter    = ['role', 'kyc_status', 'is_kyc_verified', 'is_active']
    search_fields  = ['email', 'first_name', 'last_name', 'phone_number']
    ordering       = ['-created_at']
    readonly_fields = ['created_at', 'updated_at', 'last_login']

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Profil', {'fields': ('first_name', 'last_name', 'phone_number', 'avatar', 'country', 'city', 'bio')}),
        ('Rôle & Statut', {'fields': ('role', 'is_active', 'is_staff', 'is_superuser', 'is_email_verified')}),
        ('KYC', {'fields': ('kyc_status', 'is_kyc_verified', 'kyc_submitted_at', 'kyc_reviewed_at', 'kyc_notes')}),
        ('Préférences Investisseur', {'fields': ('preferred_sectors', 'preferred_countries', 'min_investment', 'max_investment', 'risk_profile')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at', 'last_login')}),
    )
    add_fieldsets = (
        (None, {'classes': ('wide',), 'fields': ('email', 'password1', 'password2', 'role')}),
    )
    actions = ['approve_kyc', 'reject_kyc']

    @admin.action(description='Approuver le KYC')
    def approve_kyc(self, request, queryset):
        from django.utils import timezone
        queryset.update(kyc_status='approved', is_kyc_verified=True, kyc_reviewed_at=timezone.now())
        self.message_user(request, f'{queryset.count()} KYC approuvé(s).')

    @admin.action(description='Rejeter le KYC')
    def reject_kyc(self, request, queryset):
        from django.utils import timezone
        queryset.update(kyc_status='rejected', is_kyc_verified=False, kyc_reviewed_at=timezone.now())
        self.message_user(request, f'{queryset.count()} KYC rejeté(s).')


@admin.register(KYCDocument)
class KYCDocumentAdmin(admin.ModelAdmin):
    list_display  = ['user', 'doc_type', 'uploaded_at']
    list_filter   = ['doc_type']
    search_fields = ['user__email']
