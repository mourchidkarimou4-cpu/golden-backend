"""
apps/matching/views.py
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from apps.core.permissions import IsVerifiedInvestor
from rest_framework.permissions import IsAuthenticated
from apps.projects.serializers import ProjectListSerializer
from .services import get_recommendations, compute_and_save_match
from .models import Match


class RecommendationsView(APIView):
    """
    GET /api/v1/matching/recommendations/
    Retourne les projets recommandés pour l'investisseur connecté.
    """
    permission_classes = [IsVerifiedInvestor]

    def get(self, request):
        results = get_recommendations(request.user, limit=10)
        data = []
        for item in results:
            project_data = ProjectListSerializer(
                item['project'], context={'request': request}).data
            data.append({
                **project_data,
                'match_score': item['score'],
                'match_criteria': item['criteria'],
            })
        return Response({'results': data, 'count': len(data)})


class DismissMatchView(APIView):
    """
    POST /api/v1/matching/dismiss/{project_id}/
    L'investisseur ignore une recommandation.
    """
    permission_classes = [IsVerifiedInvestor]

    def post(self, request, project_id):
        try:
            match = Match.objects.get(investor=request.user, project_id=project_id)
            match.is_dismissed = True
            match.save(update_fields=['is_dismissed'])
            return Response({'message': 'Recommandation ignorée.'})
        except Match.DoesNotExist:
            return Response({'error': 'Match introuvable.'}, status=status.HTTP_404_NOT_FOUND)
