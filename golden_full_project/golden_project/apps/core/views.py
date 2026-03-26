"""apps/core/views.py"""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Notification


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def notifications_list(request):
    """Liste les notifications de l'utilisateur."""
    notifs = Notification.objects.filter(user=request.user)[:20]
    data = [{
        'id': str(n.id),
        'type': n.type,
        'title': n.title,
        'message': n.message,
        'is_read': n.is_read,
        'link': n.link,
        'created_at': n.created_at,
    } for n in notifs]
    unread = Notification.objects.filter(user=request.user, is_read=False).count()
    return Response({'results': data, 'unread': unread})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_read(request, pk):
    """Marque une notification comme lue."""
    try:
        notif = Notification.objects.get(pk=pk, user=request.user)
        notif.is_read = True
        notif.save()
        return Response({'status': 'ok'})
    except Notification.DoesNotExist:
        return Response({'error': 'Introuvable.'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_all_read(request):
    """Marque toutes les notifications comme lues."""
    Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
    return Response({'status': 'ok'})
