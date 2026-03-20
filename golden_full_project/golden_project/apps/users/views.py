"""
apps/users/views.py
"""
from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone
from django.contrib.auth import get_user_model

from .serializers import (
    RegisterSerializer, UserProfileSerializer,
    KYCSubmitSerializer, ChangePasswordSerializer,
    GoldenTokenObtainPairSerializer,
)
from .models import KYCDocument

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    """POST /api/v1/auth/register/ — Inscription d'un nouvel utilisateur."""
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        # TODO: envoyer email de confirmation (tâche Celery)
        refresh = RefreshToken.for_user(user)
        return Response({
            'message': 'Compte créé avec succès.',
            'user': UserProfileSerializer(user).data,
            'tokens': {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }
        }, status=status.HTTP_201_CREATED)


class LoginView(TokenObtainPairView):
    """POST /api/v1/auth/login/ — Connexion, retourne les JWT."""
    serializer_class = GoldenTokenObtainPairSerializer


class LogoutView(APIView):
    """POST /api/v1/auth/logout/ — Invalide le refresh token."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data['refresh']
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'message': 'Déconnexion réussie.'}, status=status.HTTP_200_OK)
        except Exception:
            return Response({'error': 'Token invalide.'}, status=status.HTTP_400_BAD_REQUEST)


class MeView(generics.RetrieveUpdateAPIView):
    """GET/PUT /api/v1/users/me/ — Profil de l'utilisateur connecté."""
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class ChangePasswordView(APIView):
    """POST /api/v1/users/me/change-password/"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        request.user.set_password(serializer.validated_data['new_password'])
        request.user.save()
        return Response({'message': 'Mot de passe mis à jour.'})


class KYCSubmitView(APIView):
    """POST /api/v1/auth/kyc/ — Soumettre les documents KYC."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = KYCSubmitSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)

        # Mettre à jour le statut KYC si première soumission
        if request.user.kyc_status == 'not_submitted':
            request.user.kyc_status = 'pending'
            request.user.kyc_submitted_at = timezone.now()
            request.user.save(update_fields=['kyc_status', 'kyc_submitted_at'])

        # TODO: notifier les admins (tâche Celery)
        return Response({
            'message': 'Document soumis. Votre dossier KYC est en cours d\'examen.',
            'kyc_status': request.user.kyc_status,
        }, status=status.HTTP_201_CREATED)


class KYCStatusView(APIView):
    """GET /api/v1/auth/kyc/status/ — Statut KYC de l'utilisateur connecté."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        documents = KYCDocument.objects.filter(user=request.user)
        return Response({
            'kyc_status': request.user.kyc_status,
            'is_kyc_verified': request.user.is_kyc_verified,
            'submitted_at': request.user.kyc_submitted_at,
            'documents': [
                {'type': d.get_doc_type_display(), 'uploaded_at': d.uploaded_at}
                for d in documents
            ],
        })
