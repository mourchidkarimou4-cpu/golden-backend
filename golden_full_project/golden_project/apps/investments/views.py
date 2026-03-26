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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def investment_history(request, pk):
    """Retourne l'historique des statuts d'un investissement."""
    try:
        inv = Investment.objects.get(pk=pk)
        if inv.investor != request.user and inv.project.owner != request.user:
            return Response({'error': 'Accès refusé.'}, status=http_status.HTTP_403_FORBIDDEN)
    except Investment.DoesNotExist:
        return Response({'error': 'Investissement introuvable.'}, status=http_status.HTTP_404_NOT_FOUND)

    from apps.core.models import StatusHistory
    history = StatusHistory.objects.filter(investment=inv)
    data = [{
        'old_status': h.old_status,
        'new_status': h.new_status,
        'changed_at': h.changed_at,
        'note': h.note,
    } for h in history]
    return Response(data)


# ── Negotiation Flow Views ────────────────────────────────────────────────────
from .models import NegotiationOffer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def negotiation_offers(request, pk):
    """Liste les offres d'un investissement."""
    try:
        inv = Investment.objects.get(pk=pk)
        if inv.investor != request.user and inv.project.owner != request.user:
            return Response({'error': 'Accès refusé.'}, status=http_status.HTTP_403_FORBIDDEN)
    except Investment.DoesNotExist:
        return Response({'error': 'Investissement introuvable.'}, status=http_status.HTTP_404_NOT_FOUND)

    offers = NegotiationOffer.objects.filter(investment=inv)
    data = [{
        'id': str(o.id),
        'offer_type': o.offer_type,
        'made_by': str(o.made_by.id),
        'made_by_name': o.made_by.full_name or o.made_by.email,
        'amount': str(o.amount) if o.amount else None,
        'roi': str(o.roi) if o.roi else None,
        'duration': o.duration,
        'message': o.message,
        'created_at': o.created_at,
    } for o in offers]
    return Response(data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def make_offer(request, pk):
    """Faire une offre ou contre-offre."""
    try:
        inv = Investment.objects.get(pk=pk)
        if inv.investor != request.user and inv.project.owner != request.user:
            return Response({'error': 'Accès refusé.'}, status=http_status.HTTP_403_FORBIDDEN)
    except Investment.DoesNotExist:
        return Response({'error': 'Investissement introuvable.'}, status=http_status.HTTP_404_NOT_FOUND)

    offer_type = request.data.get('offer_type', 'counter')
    offer = NegotiationOffer.objects.create(
        investment=inv,
        made_by=request.user,
        offer_type=offer_type,
        amount=request.data.get('amount'),
        roi=request.data.get('roi'),
        duration=request.data.get('duration'),
        message=request.data.get('message', ''),
    )

    # Mettre à jour le statut de l'investissement
    if offer_type == 'accepted':
        inv.status = 'contract_sent'
        inv.roi_agreed = offer.roi or inv.roi_agreed
        inv.amount = offer.amount or inv.amount
        inv.duration_months = offer.duration or inv.duration_months
        inv.save()
    elif offer_type == 'rejected':
        inv.status = 'cancelled'
        inv.save()

    return Response({
        'id': str(offer.id),
        'offer_type': offer.offer_type,
        'created_at': offer.created_at,
    }, status=http_status.HTTP_201_CREATED)


# ── Contract PDF View ─────────────────────────────────────────────────────────
from django.http import HttpResponse

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def generate_contract(request, pk):
    """Génère un PDF de contrat pour un investissement."""
    try:
        inv = Investment.objects.select_related('investor', 'project', 'project__owner').get(pk=pk)
        if inv.investor != request.user and inv.project.owner != request.user:
            return Response({'error': 'Accès refusé.'}, status=http_status.HTTP_403_FORBIDDEN)
    except Investment.DoesNotExist:
        return Response({'error': 'Investissement introuvable.'}, status=http_status.HTTP_404_NOT_FOUND)

    try:
        from reportlab.lib.pagesizes import A4
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib.units import cm
        from reportlab.lib import colors
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
        from reportlab.lib.enums import TA_CENTER, TA_LEFT
        import io
        from django.utils import timezone

        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4, topMargin=2*cm, bottomMargin=2*cm)
        styles = getSampleStyleSheet()
        story = []

        title_style = ParagraphStyle('title', parent=styles['Title'], fontSize=20, textColor=colors.HexColor('#B87333'), alignment=TA_CENTER, spaceAfter=12)
        heading_style = ParagraphStyle('heading', parent=styles['Heading2'], fontSize=13, textColor=colors.HexColor('#B87333'), spaceBefore=16, spaceAfter=8)
        normal_style = ParagraphStyle('normal', parent=styles['Normal'], fontSize=11, leading=16)

        story.append(Paragraph("GOLDEN INVESTISSEMENT", title_style))
        story.append(Paragraph("CONTRAT D'INVESTISSEMENT", ParagraphStyle('sub', parent=styles['Normal'], fontSize=14, alignment=TA_CENTER, textColor=colors.HexColor('#666666'), spaceAfter=24)))
        story.append(Spacer(1, 0.5*cm))

        story.append(Paragraph("PARTIES", heading_style))
        data = [
            ['Investisseur', inv.investor.get_full_name() or inv.investor.email],
            ['Porteur de projet', inv.project.owner.get_full_name() or inv.project.owner.email],
            ['Projet', inv.project.title],
            ['Date', timezone.now().strftime('%d/%m/%Y')],
        ]
        t = Table(data, colWidths=[5*cm, 11*cm])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (0,-1), colors.HexColor('#F5F5F5')),
            ('TEXTCOLOR', (0,0), (0,-1), colors.HexColor('#B87333')),
            ('FONTSIZE', (0,0), (-1,-1), 11),
            ('PADDING', (0,0), (-1,-1), 8),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#DDDDDD')),
        ]))
        story.append(t)
        story.append(Spacer(1, 0.5*cm))

        story.append(Paragraph("CONDITIONS FINANCIÈRES", heading_style))
        data2 = [
            ['Montant investi', f"{float(inv.amount):,.0f} FCFA"],
            ['ROI convenu', f"{float(inv.roi_agreed or 0):.1f}%"],
            ['Durée', f"{inv.duration_months or 0} mois"],
            ['Commission GOLDEN', f"{float(inv.commission_rate):.1f}% ({float(inv.commission_amount):,.0f} FCFA)"],
            ['Montant net', f"{float(inv.net_amount):,.0f} FCFA"],
            ['Statut', inv.get_status_display()],
        ]
        t2 = Table(data2, colWidths=[5*cm, 11*cm])
        t2.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (0,-1), colors.HexColor('#F5F5F5')),
            ('TEXTCOLOR', (0,0), (0,-1), colors.HexColor('#B87333')),
            ('FONTSIZE', (0,0), (-1,-1), 11),
            ('PADDING', (0,0), (-1,-1), 8),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#DDDDDD')),
        ]))
        story.append(t2)
        story.append(Spacer(1, 1*cm))

        story.append(Paragraph("CLAUSES", heading_style))
        story.append(Paragraph("1. Les parties s'engagent à respecter les conditions financières définies ci-dessus.", normal_style))
        story.append(Paragraph("2. GOLDEN Investissement agit en qualité d'intermédiaire et perçoit une commission de mise en relation.", normal_style))
        story.append(Paragraph("3. Tout litige sera soumis à la juridiction compétente du pays de résidence du porteur de projet.", normal_style))
        story.append(Spacer(1, 2*cm))

        story.append(Paragraph("SIGNATURES", heading_style))
        sig_data = [['Investisseur', 'Porteur de projet'], ['\n\n_______________', '\n\n_______________']]
        t3 = Table(sig_data, colWidths=[8*cm, 8*cm])
        t3.setStyle(TableStyle([
            ('FONTSIZE', (0,0), (-1,-1), 11),
            ('PADDING', (0,0), (-1,-1), 8),
            ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ]))
        story.append(t3)

        doc.build(story)
        buffer.seek(0)
        response = HttpResponse(buffer.read(), content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="contrat_{str(pk)[:8]}.pdf"'
        return response

    except ImportError:
        # Fallback texte brut
        content = f"CONTRAT D'INVESTISSEMENT GOLDEN\n\nInvestisseur: {inv.investor.email}\nProjet: {inv.project.title}\nMontant: {float(inv.amount):,.0f} FCFA\nROI: {float(inv.roi_agreed or 0):.1f}%\nDurée: {inv.duration_months or 0} mois\nStatut: {inv.get_status_display()}"
        response = HttpResponse(content, content_type='text/plain')
        response['Content-Disposition'] = f'attachment; filename="contrat_{str(pk)[:8]}.txt"'
        return response
