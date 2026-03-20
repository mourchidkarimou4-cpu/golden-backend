#!/usr/bin/env bash
# ══════════════════════════════════════════════════════════
# GOLDEN Investissement — Script de démarrage local
# Usage : bash start_dev.sh
# ══════════════════════════════════════════════════════════

set -e
BLUE='\033[0;34m'
GOLD='\033[0;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo -e "${GOLD}  ◈ GOLDEN Investissement — Démarrage local${NC}"
echo "  ─────────────────────────────────────────"
echo ""

# ── 1. Backend ──────────────────────────────────────────
echo -e "${BLUE}[1/4]${NC} Installation des dépendances Python..."
cd "$(dirname "$0")/golden_project"

if [ ! -d "venv" ]; then
  python3 -m venv venv
fi

source venv/bin/activate
pip install -r requirements/dev.txt -q

# Copier .env si pas présent
if [ ! -f ".env" ]; then
  cp .env.dev .env
  echo -e "  ${GREEN}✓${NC} .env créé depuis .env.dev"
fi

# ── 2. Migrations ───────────────────────────────────────
echo -e "${BLUE}[2/4]${NC} Migrations Django..."
python manage.py migrate --settings=config.settings.dev -v 0

# Créer un superuser automatiquement si aucun n'existe
python manage.py shell --settings=config.settings.dev -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(role='admin').exists():
    User.objects.create_superuser(
        email='admin@golden.com',
        password='Golden2026!',
        role='admin',
        first_name='Admin',
        last_name='GOLDEN',
        is_kyc_verified=True,
    )
    print('  Superuser créé : admin@golden.com / Golden2026!')
else:
    print('  Superuser déjà existant.')
"

# ── 3. Données de test ──────────────────────────────────
echo -e "${BLUE}[3/4]${NC} Données de test..."
python manage.py shell --settings=config.settings.dev -c "
from django.contrib.auth import get_user_model
from apps.projects.models import Project
import decimal

User = get_user_model()

# Porteur de test
if not User.objects.filter(email='porteur@golden.com').exists():
    porteur = User.objects.create_user(
        email='porteur@golden.com', password='Golden2026!',
        role='porteur', first_name='Kofi', last_name='Mensah',
        is_kyc_verified=True, kyc_status='approved',
        country='Bénin', city='Cotonou',
    )
    # Projet de test
    Project.objects.create(
        owner=porteur, title='AgroTech Bénin',
        tagline='Transformation de produits agricoles locaux',
        description='Chaîne de valeur complète du producteur au consommateur.',
        sector='agro', country='Bénin', city='Cotonou',
        amount_needed=decimal.Decimal('250000000'),
        roi_estimated=decimal.Decimal('18.5'),
        duration_months=36, risk_level='medium', status='active',
    )
    print('  Porteur + projet créés : porteur@golden.com / Golden2026!')

# Investisseur de test
if not User.objects.filter(email='invest@golden.com').exists():
    User.objects.create_user(
        email='invest@golden.com', password='Golden2026!',
        role='investisseur', first_name='Ibrahim', last_name='Traoré',
        is_kyc_verified=True, kyc_status='approved',
        country=\"Côte d'Ivoire\", city='Abidjan',
        preferred_sectors=['agro','tech','energy'],
        risk_profile='medium',
        min_investment=decimal.Decimal('5000000'),
        max_investment=decimal.Decimal('100000000'),
    )
    print('  Investisseur créé : invest@golden.com / Golden2026!')
"

# ── 4. Frontend ─────────────────────────────────────────
echo -e "${BLUE}[4/4]${NC} Installation des dépendances Node.js..."
cd "../golden_frontend"
npm install --silent

echo ""
echo -e "${GREEN}  ✓ Tout est prêt !${NC}"
echo ""
echo -e "  ${GOLD}Comptes de test :${NC}"
echo "  ┌──────────────────────┬──────────────┬──────────────┐"
echo "  │ Email                │ Mot de passe │ Rôle         │"
echo "  ├──────────────────────┼──────────────┼──────────────┤"
echo "  │ admin@golden.com     │ Golden2026!  │ Admin        │"
echo "  │ porteur@golden.com   │ Golden2026!  │ Porteur      │"
echo "  │ invest@golden.com    │ Golden2026!  │ Investisseur │"
echo "  └──────────────────────┴──────────────┴──────────────┘"
echo ""
echo -e "  ${GOLD}Démarrer les serveurs :${NC}"
echo ""
echo "  Terminal 1 — Django :"
echo "  cd golden_project && source venv/bin/activate"
echo "  python manage.py runserver --settings=config.settings.dev"
echo ""
echo "  Terminal 2 — React :"
echo "  cd golden_frontend && npm run dev"
echo ""
echo -e "  ${GOLD}URLs :${NC}"
echo "  Frontend  → http://localhost:3000"
echo "  API       → http://localhost:8000/api/v1"
echo "  Swagger   → http://localhost:8000/api/docs/"
echo "  Admin     → http://localhost:8000/admin/"
echo ""
