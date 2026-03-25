"""apps/investments/signals.py"""
from django.db.models.signals import pre_save
from django.dispatch import receiver
from .models import Investment


@receiver(pre_save, sender=Investment)
def track_status_change(sender, instance, **kwargs):
    if not instance.pk:
        return
    try:
        old = Investment.objects.get(pk=instance.pk)
        if old.status != instance.status:
            from apps.core.models import StatusHistory
            StatusHistory.objects.create(
                investment=instance,
                old_status=old.status,
                new_status=instance.status,
            )
    except Investment.DoesNotExist:
        pass
