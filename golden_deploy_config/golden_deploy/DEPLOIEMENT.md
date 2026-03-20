# GOLDEN Investissement — Guide de déploiement complet
## Stack : Netlify + Render + Supabase + Upstash
## Domaine : golden-invest.netlify.app (gratuit)

---

## Vue d'ensemble

```
Frontend React  →  Netlify        (gratuit, domaine .netlify.app)
Backend Django  →  Render         (gratuit, cold start ~30s)
Base de données →  Supabase       (gratuit, PostgreSQL)
Fichiers/KYC   →  Supabase Storage (gratuit, 1GB)
Redis/Celery   →  Upstash         (gratuit, 10k req/jour)
Emails         →  SendGrid        (gratuit, 100/jour)
```

---

## ÉTAPE 1 — Supabase (Base de données + Storage)

### 1.1 Créer le projet
1. Aller sur https://supabase.com → "New project"
2. Nom : `golden-investissement`
3. Mot de passe DB : générer un mot de passe fort, le noter
4. Région : **West EU (Ireland)** — la plus proche du Bénin
5. Cliquer "Create new project" — attendre ~2 minutes

### 1.2 Récupérer la DATABASE_URL
1. Settings → Database
2. Section "Connection string" → onglet "URI"
3. Copier l'URL (remplacer `[YOUR-PASSWORD]` par ton mot de passe)
4. Garder cette URL pour l'étape Render

### 1.3 Activer le Storage S3-compatible
1. Settings → Storage → "Enable S3 compatible API" → activer
2. Créer un bucket : Storage → "New bucket"
   - Nom : `golden-files`
   - Public : NON (fichiers privés)
3. Settings → API → copier :
   - `Project URL`
   - `anon public` key
   - `service_role secret` key

---

## ÉTAPE 2 — Upstash Redis (Celery broker)

1. Aller sur https://upstash.com → "Create database"
2. Type : **Redis**
3. Nom : `golden-redis`
4. Région : **EU-West-1 (Ireland)**
5. Plan : **Free**
6. Copier l'URL TLS : `rediss://default:PASSWORD@REGION.upstash.io:6379`

---

## ÉTAPE 3 — Render (Django Backend)

### 3.1 Préparer le repo GitHub
1. Pousser le code Django sur GitHub :
```bash
cd golden_project
git init
git add .
git commit -m "feat: initial GOLDEN backend"
git remote add origin https://github.com/TON_USERNAME/golden-backend.git
git push -u origin main
```

2. Ajouter le fichier `render.yaml` à la racine (fourni dans ce dossier)

3. Ajouter `dj-database-url` à `requirements/base.txt` :
```
dj-database-url==2.1.0
```

### 3.2 Créer le service sur Render
1. Aller sur https://render.com → "New" → "Blueprint"
2. Connecter ton repo GitHub `golden-backend`
3. Render détecte `render.yaml` automatiquement
4. Cliquer "Apply"

### 3.3 Configurer les variables d'environnement
Dans Render Dashboard → `golden-api` → Environment :

| Variable | Valeur |
|----------|--------|
| `DATABASE_URL` | URL Supabase (étape 1.2) |
| `REDIS_URL` | URL Upstash (étape 2) |
| `CELERY_BROKER_URL` | URL Upstash (étape 2) |
| `AWS_ACCESS_KEY_ID` | Project Ref Supabase |
| `AWS_SECRET_ACCESS_KEY` | service_role key Supabase |
| `AWS_S3_ENDPOINT_URL` | https://[REF].supabase.co/storage/v1/s3 |
| `CORS_ALLOWED_ORIGINS` | https://golden-invest.netlify.app |
| `FRONTEND_URL` | https://golden-invest.netlify.app |
| `SENDGRID_API_KEY` | Ta clé SendGrid |

### 3.4 Vérifier le déploiement
```bash
# Tester l'API (remplacer par ton URL Render)
curl https://golden-api.onrender.com/api/v1/auth/register/
# Doit retourner : {"detail": "Method \"GET\" not allowed."}
```

---

## ÉTAPE 4 — Netlify (Frontend React)

### 4.1 Préparer le frontend
Dans ton projet React, créer un fichier `.env.production` :
```env
VITE_API_URL=https://golden-api.onrender.com/api/v1
VITE_SUPABASE_URL=https://TON_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=TON_ANON_KEY
```

### 4.2 Déployer sur Netlify
**Option A — Drag & drop (le plus simple)**
1. Builder le projet : `npm run build`
2. Aller sur https://app.netlify.com
3. Glisser le dossier `dist/` dans la zone de drop
4. Ton site est en ligne instantanément !
5. Récupérer l'URL générée : `https://XXXXX.netlify.app`
6. Renommer le site : Site settings → Site name → `golden-invest`
7. URL finale : `https://golden-invest.netlify.app`

**Option B — GitHub (déploiement automatique)**
1. Pousser le frontend sur GitHub
2. Netlify → "Add new site" → "Import from Git"
3. Choisir ton repo
4. Build command : `npm run build`
5. Publish directory : `dist`
6. Ajouter les variables d'environnement
7. "Deploy site"

### 4.3 Placer le netlify.toml
Copier `netlify.toml` à la racine du projet frontend
(ou à la racine du repo si frontend et backend sont séparés)

---

## ÉTAPE 5 — Mettre à jour le CORS sur Render

Une fois l'URL Netlify connue (ex: `https://golden-invest.netlify.app`) :
1. Render → `golden-api` → Environment
2. Mettre à jour `CORS_ALLOWED_ORIGINS` avec l'URL exacte
3. Render redéploie automatiquement

---

## Vérification finale

```
golden-invest.netlify.app          ← Landing page
golden-invest.netlify.app/app      ← Dashboard
golden-api.onrender.com/api/docs/  ← Documentation API (Swagger)
golden-api.onrender.com/admin/     ← Admin Django
```

---

## Passer à un vrai domaine plus tard

Quand tu achètes `goldeninvest.com` (~10€/an sur Namecheap) :

**Netlify :**
1. Site settings → Domain management → "Add custom domain"
2. Entrer `goldeninvest.com`
3. Netlify donne les DNS records à copier chez Namecheap
4. SSL activé automatiquement

**Render (sous-domaine API) :**
1. Dashboard → golden-api → Settings → Custom domain
2. Ajouter `api.goldeninvest.com`
3. Créer un CNAME chez Namecheap : `api` → `golden-api.onrender.com`
4. Mettre à jour `CORS_ALLOWED_ORIGINS=https://goldeninvest.com`

---

## Résumé des coûts MVP

| Service | Plan | Coût |
|---------|------|------|
| Netlify | Free | 0€ |
| Render (web) | Free | 0€ |
| Render (worker Celery) | Free | 0€ |
| Supabase | Free | 0€ |
| Upstash Redis | Free | 0€ |
| SendGrid | Free (100/j) | 0€ |
| Domaine | — | 0€ (netlify.app) |
| **TOTAL** | | **0€/mois** |

Quand tu passes en production réelle :
- Render Starter : 7$/mois (pas de cold start)
- Supabase Pro : 25$/mois (si >500MB DB)
- Domaine custom : ~10€/an
