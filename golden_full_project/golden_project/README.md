# GOLDEN Investissement — Backend Django

Plateforme de mise en relation entre porteurs de projets et investisseurs.  
Stack : **Django 4.2 · DRF · PostgreSQL · Redis · Celery · JWT**

---

## Structure du projet

```
golden_project/
├── config/
│   ├── settings/
│   │   ├── base.py          ← Settings partagés
│   │   ├── dev.py           ← Développement
│   │   └── prod.py          ← Production
│   ├── urls.py              ← URLs racines
│   ├── celery.py            ← Config Celery
│   ├── wsgi.py
│   └── asgi.py
│
├── apps/
│   ├── core/                ← Modèle de base, permissions, pagination
│   ├── users/               ← Auth JWT, profils, KYC
│   ├── projects/            ← CRUD projets, documents, favoris
│   ├── matching/            ← Algorithme de scoring et recommandations
│   ├── messaging/           ← Threads et messages sécurisés
│   ├── investments/         ← Transactions, contrats, paiements
│   └── reporting/           ← Dashboards par rôle
│
├── requirements/
│   ├── base.txt
│   ├── dev.txt
│   └── prod.txt
│
├── Dockerfile
├── docker-compose.yml
├── manage.py
└── .env.example
```

---

## Installation rapide (local)

### Prérequis
- Python 3.11+
- PostgreSQL 15+
- Redis 7+

### 1. Cloner et configurer

```bash
git clone <repo-url> golden_project
cd golden_project

# Créer l'environnement virtuel
python -m venv venv
source venv/bin/activate        # Linux / Mac
# venv\Scripts\activate         # Windows

# Installer les dépendances
pip install -r requirements/dev.txt
```

### 2. Variables d'environnement

```bash
cp .env.example .env
# Éditer .env avec vos valeurs (DB, Redis, clés API...)
```

### 3. Base de données

```bash
# Créer la base PostgreSQL
createdb golden_db
createuser golden_user
# ou via psql :
# CREATE DATABASE golden_db;
# CREATE USER golden_user WITH PASSWORD 'golden_pass';
# GRANT ALL PRIVILEGES ON DATABASE golden_db TO golden_user;

# Appliquer les migrations
python manage.py migrate

# Créer un superutilisateur
python manage.py createsuperuser
```

### 4. Lancer le serveur

```bash
python manage.py runserver
# API disponible sur http://localhost:8000
# Admin Django : http://localhost:8000/admin/
# Docs API (Swagger) : http://localhost:8000/api/docs/
# Docs API (ReDoc) : http://localhost:8000/api/redoc/
```

### 5. Lancer Celery (optionnel, pour tâches async)

```bash
# Dans un terminal séparé :
celery -A config worker -l info

# Pour les tâches planifiées :
celery -A config beat -l info
```

---

## Démarrage avec Docker

```bash
# Copier l'env
cp .env.example .env

# Lancer tous les services (DB + Redis + API + Celery)
docker-compose up --build

# En arrière-plan :
docker-compose up -d

# Appliquer les migrations dans le container :
docker-compose exec api python manage.py migrate
docker-compose exec api python manage.py createsuperuser

# Arrêter :
docker-compose down
```

---

## Endpoints API principaux

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/api/v1/auth/register/` | Inscription |
| `POST` | `/api/v1/auth/login/` | Connexion → JWT |
| `POST` | `/api/v1/auth/logout/` | Déconnexion |
| `POST` | `/api/v1/auth/token/refresh/` | Rafraîchir le token |
| `POST` | `/api/v1/auth/kyc/` | Soumettre documents KYC |
| `GET/PUT` | `/api/v1/users/me/` | Profil utilisateur |
| `GET/POST` | `/api/v1/projects/` | Lister / créer projets |
| `GET/PUT` | `/api/v1/projects/{id}/` | Détail / modifier projet |
| `POST` | `/api/v1/projects/{id}/submit/` | Soumettre pour validation |
| `POST` | `/api/v1/projects/{id}/favorite/` | Toggle favori |
| `GET` | `/api/v1/matching/recommendations/` | Projets recommandés |
| `GET/POST` | `/api/v1/messages/threads/` | Fils de discussion |
| `GET/POST` | `/api/v1/messages/threads/{id}/` | Messages d'un fil |
| `GET/POST` | `/api/v1/investments/` | Portefeuille / investir |
| `GET` | `/api/v1/investments/portfolio/` | Résumé portefeuille |
| `GET` | `/api/v1/reporting/dashboard/porteur/` | Dashboard porteur |
| `GET` | `/api/v1/reporting/dashboard/investor/` | Dashboard investisseur |
| `GET` | `/api/v1/reporting/dashboard/admin/` | Dashboard admin |

Documentation complète : **http://localhost:8000/api/docs/**

---

## Rôles et permissions

| Rôle | Accès |
|------|-------|
| `porteur` | Créer/gérer ses projets, voir les investissements reçus |
| `investisseur` | Explorer projets, investir, voir son portefeuille |
| `admin` | Accès total, valider KYC et projets |

> ⚠️ Les actions sensibles nécessitent que le KYC soit validé (`is_kyc_verified = True`).

---

## Lancer les tests

```bash
pytest
pytest --cov=apps --cov-report=html   # avec couverture
```

---

## Roadmap technique

### MVP (Phase 1 — actuelle)
- [x] Structure Django + apps modulaires
- [x] Modèle utilisateur custom + JWT
- [x] KYC (soumission manuelle)
- [x] CRUD Projets + documents
- [x] Algorithme de matching
- [x] Messagerie simple (polling)
- [x] Investissements + portefeuille
- [x] Dashboards reporting par rôle
- [ ] Tests unitaires (apps.users, apps.projects)
- [ ] Intégration CinetPay (Mobile Money)
- [ ] Emails transactionnels (SendGrid)

### Phase 2
- [ ] WebSocket (Django Channels) pour messagerie temps réel
- [ ] KYC automatisé (Smile Identity)
- [ ] Signature électronique (Yousign)
- [ ] Application mobile (React Native)

### Phase 3
- [ ] Expansion 6 pays
- [ ] Due diligence IA
- [ ] Marché secondaire

---

## Variables d'environnement

Voir `.env.example` pour la liste complète.

---

*GOLDEN Investissement — Cotonou, Bénin — 2026*
