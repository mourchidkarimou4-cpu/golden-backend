"""
apps/matching/tasks.py
Tâches Celery pour le recalcul des scores de matching.
"""
from config.celery import app


@app.task(bind=True, max_retries=3)
def recompute_matches_for_project_task(self, project_id):
    """Recalcule tous les scores pour un projet donné."""
    try:
        from apps.projects.models import Project
        from .services import recompute_all_matches_for_project
        project = Project.objects.get(id=project_id)
        recompute_all_matches_for_project(project)
    except Exception as exc:
        raise self.retry(exc=exc, countdown=60)


@app.task(bind=True, max_retries=3)
def recompute_matches_for_investor_task(self, investor_id):
    """Recalcule tous les scores pour un investisseur donné."""
    try:
        from django.contrib.auth import get_user_model
        from .services import recompute_all_matches_for_investor
        User = get_user_model()
        investor = User.objects.get(id=investor_id)
        recompute_all_matches_for_investor(investor)
    except Exception as exc:
        raise self.retry(exc=exc, countdown=60)
