"""
apps/reporting/views.py
Tableaux de bord adaptés par rôle.
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.db.models import Sum, Count, Avg
from django.utils import timezone
from datetime import timedelta

from apps.core.permissions import IsAdminUser
from apps.projects.models import Project
from apps.investments.models import Investment
from apps.messaging.models import MessageThread


class DashboardPorteurView(APIView):
    """
    GET /api/v1/reporting/dashboard/porteur/
    KPIs du porteur de projet connecté.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        projects = Project.objects.filter(owner=user)

        total_projects  = projects.count()
        active_projects = projects.filter(status='active').count()
        total_views     = projects.aggregate(v=Sum('views_count'))['v'] or 0
        total_interests = projects.aggregate(i=Sum('interest_count'))['i'] or 0

        # Montant levé total
        total_raised = Investment.objects.filter(
            project__owner=user,
            status__in=['paid', 'active', 'completed']
        ).aggregate(total=Sum('amount'))['total'] or 0

        # Montant recherché total
        total_needed = projects.filter(
            status__in=['active', 'funded']
        ).aggregate(total=Sum('amount_needed'))['total'] or 0

        # Par projet
        projects_data = []
        for p in projects.order_by('-created_at')[:5]:
            investments_qs = Investment.objects.filter(project=p)
            projects_data.append({
                'id': str(p.id),
                'title': p.title,
                'status': p.status,
                'status_label': p.get_status_display(),
                'sector': p.get_sector_display(),
                'amount_needed': float(p.amount_needed),
                'amount_raised': float(p.amount_raised),
                'funding_percentage': p.funding_percentage,
                'views': p.views_count,
                'interests': p.interest_count,
                'investment_count': investments_qs.count(),
            })

        return Response({
            'summary': {
                'total_projects':  total_projects,
                'active_projects': active_projects,
                'total_views':     total_views,
                'total_interests': total_interests,
                'total_raised':    float(total_raised),
                'total_needed':    float(total_needed),
                'funding_rate':    round(float(total_raised) / float(total_needed) * 100, 1)
                                   if total_needed else 0,
            },
            'projects': projects_data,
        })


class DashboardInvestorView(APIView):
    """
    GET /api/v1/reporting/dashboard/investor/
    KPIs de l'investisseur connecté.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        investments = Investment.objects.filter(investor=user).select_related('project')

        total_invested = investments.aggregate(total=Sum('amount'))['total'] or 0
        active_count   = investments.filter(status__in=['active', 'paid', 'signed']).count()
        avg_roi        = investments.filter(
            roi_agreed__isnull=False
        ).aggregate(avg=Avg('roi_agreed'))['avg'] or 0

        # Répartition par secteur (pour donut chart)
        sector_breakdown = {}
        for inv in investments:
            key = inv.project.get_sector_display()
            sector_breakdown[key] = sector_breakdown.get(key, 0) + float(inv.amount)

        # Évolution mensuelle (6 derniers mois)
        monthly = []
        now = timezone.now()
        for i in range(5, -1, -1):
            month_start = (now - timedelta(days=30 * i)).replace(
                day=1, hour=0, minute=0, second=0, microsecond=0)
            month_end = (month_start + timedelta(days=32)).replace(day=1)
            amount = investments.filter(
                created_at__gte=month_start,
                created_at__lt=month_end,
                status__in=['paid', 'active', 'completed']
            ).aggregate(total=Sum('amount'))['total'] or 0
            monthly.append({
                'month': month_start.strftime('%b %Y'),
                'amount': float(amount),
            })

        # Investissements récents
        recent = []
        for inv in investments.order_by('-created_at')[:5]:
            recent.append({
                'id': str(inv.id),
                'project_title': inv.project.title,
                'sector': inv.project.get_sector_display(),
                'amount': float(inv.amount),
                'status': inv.status,
                'status_label': inv.get_status_display(),
                'roi_agreed': float(inv.roi_agreed) if inv.roi_agreed else None,
                'created_at': inv.created_at,
            })

        return Response({
            'summary': {
                'total_invested':     float(total_invested),
                'active_investments': active_count,
                'total_investments':  investments.count(),
                'average_roi':        round(float(avg_roi), 2),
            },
            'sector_breakdown': sector_breakdown,
            'monthly_evolution': monthly,
            'recent_investments': recent,
        })


class DashboardAdminView(APIView):
    """
    GET /api/v1/reporting/dashboard/admin/
    KPIs globaux de la plateforme (admin uniquement).
    """
    permission_classes = [IsAdminUser]

    def get(self, request):
        from django.contrib.auth import get_user_model
        User = get_user_model()

        users       = User.objects.all()
        projects    = Project.objects.all()
        investments = Investment.objects.all()

        total_capital = investments.filter(
            status__in=['paid', 'active', 'completed']
        ).aggregate(total=Sum('amount'))['total'] or 0

        pending_kyc = users.filter(kyc_status='pending').count()
        pending_projects = projects.filter(status='pending_review').count()

        return Response({
            'users': {
                'total':       users.count(),
                'porteurs':    users.filter(role='porteur').count(),
                'investisseurs': users.filter(role='investisseur').count(),
                'kyc_verified': users.filter(is_kyc_verified=True).count(),
                'pending_kyc': pending_kyc,
            },
            'projects': {
                'total':           projects.count(),
                'active':          projects.filter(status='active').count(),
                'pending_review':  pending_projects,
                'funded':          projects.filter(status='funded').count(),
            },
            'investments': {
                'total':         investments.count(),
                'total_capital': float(total_capital),
                'completed':     investments.filter(status='completed').count(),
            },
            'alerts': {
                'pending_kyc':      pending_kyc,
                'pending_projects': pending_projects,
            }
        })
