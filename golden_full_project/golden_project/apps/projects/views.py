"""
apps/projects/views.py
"""
from rest_framework import generics, filters, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from django.conf import settings

from .models import Project, ProjectDocument, ProjectFavorite
from .serializers import (
    ProjectListSerializer, ProjectDetailSerializer,
    ProjectCreateUpdateSerializer, ProjectDocumentSerializer,
)
from .filters import ProjectFilter
from apps.core.permissions import IsVerifiedPorteur, IsOwnerOrAdmin, IsVerifiedInvestor


class ProjectViewSet(ModelViewSet):
    """
    CRUD complet sur les projets.

    GET    /api/v1/projects/          → liste (public, filtrable)
    POST   /api/v1/projects/          → créer (porteur vérifié)
    GET    /api/v1/projects/{id}/     → détail
    PUT    /api/v1/projects/{id}/     → modifier (owner ou admin)
    DELETE /api/v1/projects/{id}/     → supprimer (owner ou admin)
    POST   /api/v1/projects/{id}/submit/    → soumettre pour validation
    POST   /api/v1/projects/{id}/favorite/  → toggle favori (investisseur)
    POST   /api/v1/projects/{id}/documents/ → ajouter un document
    """
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ProjectFilter
    search_fields   = ['title', 'tagline', 'description', 'city']
    ordering_fields = ['created_at', 'amount_needed', 'roi_estimated', 'views_count']
    ordering        = ['-created_at']

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Project.objects.filter(status=Project.Status.ACTIVE)
        if user.role == 'admin':
            return Project.objects.all()
        if user.role == 'porteur':
            # Ses propres projets + les projets actifs des autres
            from django.db.models import Q
            return Project.objects.filter(
                Q(owner=user) | Q(status=Project.Status.ACTIVE)
            )
        # Investisseur : uniquement projets actifs
        return Project.objects.filter(status=Project.Status.ACTIVE)

    def get_serializer_class(self):
        if self.action == 'list':
            return ProjectListSerializer
        if self.action in ['create', 'update', 'partial_update']:
            return ProjectCreateUpdateSerializer
        return ProjectDetailSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [IsVerifiedPorteur()]
        if self.action in ['update', 'partial_update', 'destroy']:
            return [IsOwnerOrAdmin()]
        if self.action == 'favorite':
            return [IsVerifiedInvestor()]
        return [permissions.IsAuthenticatedOrReadOnly()]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Incrémenter le compteur de vues
        Project.objects.filter(pk=instance.pk).update(views_count=instance.views_count + 1)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path='submit')
    def submit_for_review(self, request, pk=None):
        """Soumettre un projet brouillon pour validation admin."""
        project = self.get_object()
        if project.owner != request.user:
            return Response({'error': 'Non autorisé.'}, status=status.HTTP_403_FORBIDDEN)
        if project.status != Project.Status.DRAFT:
            return Response({'error': 'Seuls les brouillons peuvent être soumis.'},
                            status=status.HTTP_400_BAD_REQUEST)
        project.status = Project.Status.PENDING_REVIEW
        project.save(update_fields=['status'])
        # TODO: notifier les admins via Celery
        return Response({'message': 'Projet soumis pour validation.', 'status': project.status})

    @action(detail=True, methods=['post'], url_path='favorite')
    def toggle_favorite(self, request, pk=None):
        """Ajouter/retirer des favoris."""
        project = self.get_object()
        fav, created = ProjectFavorite.objects.get_or_create(
            investor=request.user, project=project)
        if not created:
            fav.delete()
            return Response({'favorited': False, 'message': 'Retiré des favoris.'})
        return Response({'favorited': True, 'message': 'Ajouté aux favoris.'})

    @action(detail=True, methods=['post'], url_path='documents',
            permission_classes=[IsOwnerOrAdmin])
    def add_document(self, request, pk=None):
        """Ajouter un document à un projet."""
        project = self.get_object()
        serializer = ProjectDocumentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(project=project)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class MyProjectsView(generics.ListAPIView):
    """GET /api/v1/projects/mine/ — Projets du porteur connecté."""
    serializer_class = ProjectListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Project.objects.filter(owner=self.request.user)


class ProjectFavoritesView(generics.ListAPIView):
    """GET /api/v1/projects/favorites/ — Projets favoris de l'investisseur."""
    serializer_class = ProjectListSerializer
    permission_classes = [IsVerifiedInvestor]

    def get_queryset(self):
        fav_ids = ProjectFavorite.objects.filter(
            investor=self.request.user).values_list('project_id', flat=True)
        return Project.objects.filter(id__in=fav_ids)


# ── Share Token Views ────────────────────────────────────────────────────────
import secrets
from datetime import timedelta
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status as http_status
from .models import ProjectShareToken

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_share_token(request, pk):
    """Crée un token de partage valide 72h pour un projet."""
    try:
        project = Project.objects.get(pk=pk, owner=request.user)
    except Project.DoesNotExist:
        return Response({'error': 'Projet introuvable.'}, status=http_status.HTTP_404_NOT_FOUND)

    token = secrets.token_urlsafe(32)
    share = ProjectShareToken.objects.create(
        project=project,
        token=token,
        created_by=request.user,
        expires_at=timezone.now() + timedelta(hours=72),
    )
    frontend_url = getattr(settings, 'FRONTEND_URL', 'https://goldeninvest.netlify.app')
    return Response({
        'token': token,
        'url': f'{frontend_url}/share/{token}',
        'expires_at': share.expires_at,
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def public_share_view(request, token):
    """Vue publique d'un projet via token de partage."""
    try:
        share = ProjectShareToken.objects.select_related('project').get(token=token)
    except ProjectShareToken.DoesNotExist:
        return Response({'error': 'Lien invalide.'}, status=http_status.HTTP_404_NOT_FOUND)

    if not share.is_valid:
        return Response({'error': 'Ce lien a expiré.'}, status=http_status.HTTP_410_GONE)

    p = share.project
    return Response({
        'id': str(p.id),
        'title': p.title,
        'tagline': p.tagline,
        'description': p.description,
        'sector': p.sector,
        'country': p.country,
        'city': p.city,
        'amount_needed': str(p.amount_needed),
        'roi_estimated': str(p.roi_estimated),
        'duration_months': p.duration_months,
        'funding_percentage': p.funding_percentage,
        'risk_level': p.risk_level,
        'expires_at': share.expires_at,
    })
