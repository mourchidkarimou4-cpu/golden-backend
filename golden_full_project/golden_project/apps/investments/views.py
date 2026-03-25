"""
apps/investments/views.py
"""
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Sum, Avg, Count

from .models import Investment
from .serializers import InvestmentSerializer, InvestmentCreateSerializer
from apps.core.permissions import IsVerifiedInvestor, IsOwnerOrAdmin


class InvestmentListCreateView(APIView):
    """
    GET  /api/v1/investments/         → liste des investissements de l'utilisateur
    POST /api/v1/investments/         → initier un investissement
    """
    permission_classes = [IsVerifiedInvestor]

    def get(self, request):
        investments = Investment.objects.filter(
            investor=request.user
        ).select_related('project', 'project__owner')
        serializer = InvestmentSerializer(investments, many=True, context={'request': request})
        return Response({'results': serializer.data, 'count': investments.count()})

    def post(self, request):
        serializer = InvestmentCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        investment = serializer.save(investor=request.user)
        # Incrémenter le compteur d'intérêt sur le projet
        investment.project.interest_count += 1
        investment.project.save(update_fields=['interest_count'])
        # TODO: notifier le porteur de projet (Celery)
        return Response(
            InvestmentSerializer(investment, context={'request': request}).data,
            status=status.HTTP_201_CREATED
        )


class InvestmentDetailView(generics.RetrieveUpdateAPIView):
    """GET/PUT /api/v1/investments/{id}/"""
    serializer_class   = InvestmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Investment.objects.all()
        return Investment.objects.filter(investor=user)


class PortfolioSummaryView(APIView):
    """
    GET /api/v1/investments/portfolio/
    Résumé du portefeuille de l'investisseur connecté.
    """
    permission_classes = [IsVerifiedInvestor]

    def get(self, request):
        qs = Investment.objects.filter(investor=request.user)

        total_invested = qs.aggregate(total=Sum('amount'))['total'] or 0
        active_count   = qs.filter(status__in=['active', 'paid', 'signed']).count()
        avg_roi        = qs.filter(roi_agreed__isnull=False).aggregate(
            avg=Avg('roi_agreed'))['avg'] or 0

        # Répartition par secteur
        by_sector = {}
        for inv in qs.select_related('project'):
            sector = inv.project.get_sector_display()
            by_sector[sector] = by_sector.get(sector, 0) + float(inv.amount)

        # Répartition par statut
        by_status = {
            item['status']: item['count']
            for item in qs.values('status').annotate(count=Count('id'))
        }

        return Response({
            'total_invested': float(total_invested),
            'active_investments': active_count,
            'total_investments': qs.count(),
            'average_roi': round(float(avg_roi), 2),
            'by_sector': by_sector,
            'by_status': by_status,
        })


class ProjectInvestmentsView(generics.ListAPIView):
    """
    GET /api/v1/investments/project/{project_id}/
    Liste des investissements sur un projet (pour le porteur ou admin).
    """
    serializer_class   = InvestmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        project_id = self.kwargs['project_id']
        user = self.request.user
        if user.role == 'admin':
            return Investment.objects.filter(project_id=project_id)
        # Le porteur voit les investissements sur ses propres projets
        return Investment.objects.filter(project_id=project_id, project__owner=user)


# ── Rating Views ─────────────────────────────────────────────────────────────
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status as http_status
from .models import InvestmentRating

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def rate_investment(request, pk):
    """Créer ou mettre à jour la notation d'un investissement."""
    try:
        from .models import Investment
        inv = Investment.objects.get(pk=pk, investor=request.user)
    except Investment.DoesNotExist:
        return Response({'error': 'Investissement introuvable.'}, status=http_status.HTTP_404_NOT_FOUND)

    score = request.data.get('score')
    if not score or not (1 <= int(score) <= 5):
        return Response({'error': 'Score invalide (1-5).'}, status=http_status.HTTP_400_BAD_REQUEST)

    rating, created = InvestmentRating.objects.update_or_create(
        investment=inv,
        defaults={
            'investor': request.user,
            'score': int(score),
            'comment': request.data.get('comment', ''),
        }
    )
    return Response({
        'id': str(rating.id),
        'score': rating.score,
        'comment': rating.comment,
        'created': created,
    }, status=http_status.HTTP_201_CREATED if created else http_status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_ratings(request):
    """Liste toutes les notations de l'utilisateur connecté."""
    ratings = InvestmentRating.objects.filter(investor=request.user).select_related('investment')
    data = [{
        'id': str(r.id),
        'investment_id': str(r.investment.id),
        'project_title': r.investment.project.title if hasattr(r.investment, 'project') else '—',
        'score': r.score,
        'comment': r.comment,
        'created_at': r.created_at,
    } for r in ratings]
    return Response(data)
