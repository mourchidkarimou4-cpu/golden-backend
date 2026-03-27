"""apps/matching/tasks.py"""
import threading
import logging

logger = logging.getLogger(__name__)


def _run_in_thread(target, *args):
    threading.Thread(target=target, args=args, daemon=True).start()


def _recompute_project(project_id):
    try:
        from apps.projects.models import Project
        from .services import recompute_all_matches_for_project
        project = Project.objects.get(id=project_id)
        recompute_all_matches_for_project(project)
        logger.info(f'Matching recalculé pour projet {project_id}')
    except Exception as e:
        logger.error(f'Erreur recalcul matching projet {project_id}: {e}')


def _recompute_investor(investor_id):
    try:
        from django.contrib.auth import get_user_model
        from .services import recompute_all_matches_for_investor
        User = get_user_model()
        investor = User.objects.get(id=investor_id)
        recompute_all_matches_for_investor(investor)
        logger.info(f'Matching recalculé pour investisseur {investor_id}')
    except Exception as e:
        logger.error(f'Erreur recalcul matching investisseur {investor_id}: {e}')


def recompute_matches_for_project_task(project_id):
    _run_in_thread(_recompute_project, project_id)


def recompute_matches_for_investor_task(investor_id):
    _run_in_thread(_recompute_investor, investor_id)
