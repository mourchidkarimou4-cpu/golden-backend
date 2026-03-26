"""
apps/matching/services.py
Algorithme de scoring GOLDEN.

Critères et poids :
  - Secteur préféré          : 30 pts
  - Montant dans la fourchette: 25 pts
  - Pays / zone géographique : 20 pts
  - Profil de risque          : 15 pts
  - ROI minimum               : 10 pts
  ─────────────────────────────────────
  Total max                   : 100 pts
"""
from django.db import transaction
from .models import Match


WEIGHTS = {
    'sector':   30,
    'amount':   25,
    'country':  20,
    'risk':     15,
    'roi':      10,
}

RISK_COMPAT = {
    # (project_risk, investor_risk) → score partiel (0-1)
    ('low',    'low'):    1.0,
    ('low',    'medium'): 0.9,
    ('low',    'high'):   0.7,
    ('medium', 'low'):    0.5,
    ('medium', 'medium'): 1.0,
    ('medium', 'high'):   0.9,
    ('high',   'low'):    0.0,
    ('high',   'medium'): 0.6,
    ('high',   'high'):   1.0,
}


def compute_score(investor, project) -> tuple[float, dict]:
    """
    Calcule le score de matching entre un investisseur et un projet.
    Retourne (score_total, detail_dict).
    """
    detail = {}

    # ── 1. Secteur ──────────────────────────────────────────
    preferred = investor.preferred_sectors or []
    if not preferred or project.sector in preferred:
        detail['sector'] = WEIGHTS['sector']
    else:
        detail['sector'] = 0

    # ── 2. Montant ──────────────────────────────────────────
    amount = float(project.amount_needed)
    inv_min = float(investor.min_investment or 0)
    inv_max = float(investor.max_investment or float('inf'))

    if inv_min <= amount <= inv_max:
        detail['amount'] = WEIGHTS['amount']
    elif amount < inv_min:
        # Projet trop petit : pénalité proportionnelle
        ratio = amount / inv_min if inv_min > 0 else 0
        detail['amount'] = round(WEIGHTS['amount'] * ratio * 0.7, 2)
    else:
        # Projet trop grand : pénalité forte
        ratio = inv_max / amount if amount > 0 else 0
        detail['amount'] = round(WEIGHTS['amount'] * ratio * 0.5, 2)

    # ── 3. Pays ─────────────────────────────────────────────
    preferred_countries = investor.preferred_countries or []
    if not preferred_countries or project.country in preferred_countries:
        detail['country'] = WEIGHTS['country']
    else:
        detail['country'] = 0

    # ── 4. Profil de risque ─────────────────────────────────
    compat = RISK_COMPAT.get((project.risk_level, investor.risk_profile), 0.5)
    detail['risk'] = round(WEIGHTS['risk'] * compat, 2)

    # ── 5. ROI ──────────────────────────────────────────────
    # Pas de préférence ROI définie → score plein
    detail['roi'] = WEIGHTS['roi']

    total = sum(detail.values())
    return round(total, 2), detail


def compute_and_save_match(investor, project) -> Match:
    """Calcule et sauvegarde (ou met à jour) le score de matching."""
    score, criteria = compute_score(investor, project)
    match, _ = Match.objects.update_or_create(
        investor=investor,
        project=project,
        defaults={'score': score, 'criteria': criteria},
    )
    return match


def get_recommendations(investor, limit=10, refresh=False):
    """
    Retourne les projets actifs recommandés pour un investisseur.
    Lit depuis la table Match (cache) sauf si refresh=True ou si vide.
    """
    from apps.projects.models import Project

    cached = Match.objects.filter(
        investor=investor, is_dismissed=False
    ).select_related('project').order_by('-score')[:limit]

    if cached.exists() and not refresh:
        return [{'project': m.project, 'score': m.score, 'criteria': m.criteria} for m in cached]

    # Recalcul complet
    active_projects = Project.objects.filter(status='active').exclude(
        matches__investor=investor, matches__is_dismissed=True
    )
    results = []
    for project in active_projects:
        score, criteria = compute_score(investor, project)
        Match.objects.update_or_create(
            investor=investor, project=project,
            defaults={'score': score, 'criteria': criteria}
        )
        results.append({'project': project, 'score': score, 'criteria': criteria})

    results.sort(key=lambda x: x['score'], reverse=True)
    return results[:limit]


def recompute_all_matches_for_project(project):
    """
    Recalcule les scores pour tous les investisseurs actifs.
    Appelé en tâche Celery quand un projet est modifié.
    """
    from django.contrib.auth import get_user_model
    User = get_user_model()

    investors = User.objects.filter(role='investisseur', is_kyc_verified=True, is_active=True)
    with transaction.atomic():
        for investor in investors:
            compute_and_save_match(investor, project)


def recompute_all_matches_for_investor(investor):
    """
    Recalcule les scores pour tous les projets actifs.
    Appelé quand un investisseur met à jour ses préférences.
    """
    from apps.projects.models import Project

    active_projects = Project.objects.filter(status='active')
    with transaction.atomic():
        for project in active_projects:
            compute_and_save_match(investor, project)
