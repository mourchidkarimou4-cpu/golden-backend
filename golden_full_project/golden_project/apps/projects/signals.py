"""apps/projects/signals.py"""
import threading
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Project


def _notify_investors_async(project):
    try:
        from django.contrib.auth import get_user_model
        from apps.matching.services import compute_score
        from apps.core.models import Notification
        User = get_user_model()
        investors = User.objects.filter(role='investisseur', is_kyc_verified=True, is_active=True)
        for investor in investors:
            score, _ = compute_score(investor, project)
            if score >= 60:
                Notification.objects.get_or_create(
                    user=investor,
                    type='project',
                    title=f'Nouveau projet : {project.title}',
                    defaults={
                        'message': f'Un projet dans le secteur {project.get_sector_display()} correspond à votre profil ({score:.0f}% de compatibilité).',
                        'link': '/investisseur/projets',
                    }
                )
    except Exception as e:
        import logging
        logging.getLogger(__name__).error(f'Erreur notification projet {project.id}: {e}')


@receiver(post_save, sender=Project)
def notify_investors_on_activation(sender, instance, created, **kwargs):
    if not created and instance.status == 'active':
        threading.Thread(target=_notify_investors_async, args=(instance,), daemon=True).start()
