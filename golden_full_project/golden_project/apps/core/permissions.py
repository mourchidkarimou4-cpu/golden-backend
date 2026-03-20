"""
apps/core/permissions.py
Permissions personnalisées pour GOLDEN.
"""
from rest_framework.permissions import BasePermission


class IsVerifiedPorteur(BasePermission):
    """Autorise uniquement les porteurs de projet avec KYC validé."""
    message = "Accès réservé aux porteurs de projet vérifiés."

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == 'porteur'
            and request.user.is_kyc_verified
        )


class IsVerifiedInvestor(BasePermission):
    """Autorise uniquement les investisseurs avec KYC validé."""
    message = "Accès réservé aux investisseurs vérifiés."

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == 'investisseur'
            and request.user.is_kyc_verified
        )


class IsAdminUser(BasePermission):
    """Autorise uniquement les administrateurs GOLDEN."""
    message = "Accès réservé aux administrateurs."

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'


class IsOwnerOrAdmin(BasePermission):
    """L'objet doit appartenir à l'utilisateur connecté, ou être admin."""
    def has_object_permission(self, request, view, obj):
        if request.user.role == 'admin':
            return True
        owner = getattr(obj, 'owner', getattr(obj, 'user', None))
        return owner == request.user


class IsParticipant(BasePermission):
    """L'utilisateur doit être participant du thread/objet."""
    def has_object_permission(self, request, view, obj):
        return request.user in obj.participants.all()
