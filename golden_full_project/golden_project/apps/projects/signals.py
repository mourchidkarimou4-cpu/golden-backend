"""apps/projects/signals.py"""
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Project


@receiver(post_save, sender=Project)
def notify_investors_on_activation(sender, instance, created, **kwargs):
    """Notifie les investisseurs quand un projet passe en statut 'active'."""
    if not created and instance.status == 'active':
        from django.contrib.auth import get_user_model
        from apps.matching.services import compute_score
        from apps.core.models import Notification

        User = get_user_model()
        investors = User.objects.filter(role='investisseur', is_kyc_verified=True, is_active=True)

        for investor in investors:
            score, _ = compute_score(investor, instance)
            if score >= 60:
                Notification.objects.get_or_create(
                    user=investor,
                    type='project',
                    title=f'Nouveau projet : {instance.title}',
                    defaults={
                        'message': f'Un projet dans le secteur {instance.get_sector_display()} correspond à votre profil ({score:.0f}% de compatibilité).',
                        'link': f'/investisseur/projets',
                    }
                )
