# GOLDEN Investissement — Fichier de contexte complet
_Dernière mise à jour : 25 mars 2026_

## URLs de production
- **Frontend** : https://golden-invest.netlify.app
- **Backend** : https://golden-backend-vaaq.onrender.com
- **Admin Django** : https://golden-backend-vaaq.onrender.com/admin/
- **API Swagger** : https://golden-backend-vaaq.onrender.com/api/docs/

## Repos GitHub
- Frontend : `mourchidkarimou4-cpu/golden-frontend`
- Backend : `mourchidkarimou4-cpu/golden-backend`
- Code backend dans : `golden_full_project/golden_project/`

## Stack technique
- **Backend** : Django 4.2 + DRF + JWT
- **Frontend** : React + TypeScript + Vite + Tailwind CSS
- **BDD** : PostgreSQL via Neon
- **Cache** : Redis via Upstash
- **Hébergement** : Render (backend) + Netlify (frontend)

## Dernier commit fonctionnel Netlify
- `3898f30` — fix: brighter hero slideshow images, navbar light mode

## Commit actuel local
- `836f8bf` — fix: hooks order splash screen LandingPage

## Problème en cours NON RÉSOLU
- Le splash screen s'affiche sur la landing page mais après son animation, la page reste **noire** — rien ne s'affiche.
- Cause probable : ordre des hooks React dans `LandingPage.tsx` encore incorrect, ou le composant `SplashScreen` ne déclenche pas correctement le callback `onDone`.
- Fichier concerné : `src/pages/LandingPage.tsx`
- Le splash était dans `App.tsx` (bloquait toutes les pages) — on l'a déplacé dans `LandingPage.tsx` mais ça cause une page noire.
- **Solution recommandée** : Vérifier le composant `SplashScreen` — la prop s'appelle `onDone` dans App.tsx mais peut-être `onComplete` dans le composant lui-même.

## Structure frontend
```
src/
  App.tsx                    → Router, AuthProvider, pas de splash ici
  pages/
    LandingPage.tsx          → Splash screen intégré ici (PROBLÈME ACTUEL)
    LoginPage.tsx            → Animé, palette CSS vars
    RegisterPage.tsx         → Animé, formulaire 2 étapes
    AboutPage.tsx            → Page à propos complète
    ProjectsPublicPage.tsx   → Page projets publics /projets
    KYCPage.tsx              → Soumission KYC
    CreateProjectPage.tsx    → Formulaire 3 étapes
    DashboardPorteur.tsx     → Dashboard porteur
    DashboardInvestisseur.tsx → Dashboard investisseur
    porteur/
      MonProjetPage.tsx, InvestisseursPage.tsx, ActivitePage.tsx
      DocumentsPage.tsx, FinancesPage.tsx, RapportsPage.tsx
      ProfilPage.tsx, ParametresPage.tsx
    investisseur/
      ProjetsPage.tsx, PortfolioPage.tsx, FavorisPage.tsx
      RapportsPage.tsx, ProfilPage.tsx, ParametresPage.tsx
    MessagesPage.tsx         → Partagée porteur/investisseur
  components/
    layout/DashboardLayout.tsx → Sidebar + bottom nav mobile
    ui/
      index.tsx              → Exports UI
      KpiCard.tsx            → Compteurs animés
      Slideshow.tsx          → Diaporama photos
      ThemeToggle.tsx        → Toggle dark/light
      SplashScreen.tsx       → Animation intro (bonhommes → G)
  hooks/
    useBreakpoint.ts         → useIsMobile, useIsTablet
    useCountUp.ts            → useCountUp, useScrollReveal
    useTheme.ts              → useTheme, toggle dark/light
    useMessages.ts           → useThreads, useMessages
  styles/
    globals.css              → Tokens CSS, thèmes dark/light
  lib/
    api.ts                   → Client Axios + endpoints
    auth.tsx                 → Context JWT + useAuth
```

## Thèmes
- **Mode nuit** (défaut) : Nuit de Dakar — fond `#0A0E1A`, accent cuivre `#B87333`
- **Mode jour** : Savane Claire — fond `#FAF7F2`, accent terracotta `#8B4513`
- Toggle visible dans navbar landing + dashboards
- Variables CSS dans `src/styles/globals.css` sous `[data-theme="dark"]` et `[data-theme="light"]`

## Comptes de test
| Email | Mot de passe | Rôle |
|---|---|---|
| admin@golden.com | Golden2026! | Admin |
| investisseur@test.com | Test1234! | Investisseur (KYC vérifié) |
| karimounmuhammad@gmail.com | — | Porteur (KYC vérifié) |

## Variables Render (backend)
- DJANGO_SETTINGS_MODULE=config.settings.prod
- DATABASE_URL=postgresql://neondb_owner:npg_hGIjaJ0Fl4NV@ep-rapid-bar-al7ypb3g-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require
- REDIS_URL=rediss://default:gQAAAAAAATTmAAIncDExOGIwYjUwZmIyZDk0Nzc3YWFlY2Y3ZWMzOTI5NmNiOXAxNzkwNzg@wired-bobcat-79078.upstash.io:6379
- CORS_ALLOWED_ORIGINS=https://golden-invest.netlify.app

## Variables Netlify (frontend)
- VITE_API_URL=https://golden-backend-vaaq.onrender.com/api/v1
- VITE_APP_NAME=GOLDEN Investissement

## Ce qui est FAIT ✅
- Backend Django déployé et fonctionnel
- Auth JWT (inscription/connexion/déconnexion)
- 8 pages Dashboard Porteur avec boutons retour
- 6 pages Dashboard Investisseur avec boutons retour
- Landing page avec slideshows photos
- Page À propos
- Page Projets publics (/projets)
- Navigation inférieure mobile
- Responsive complet (Documents, Paramètres, Activité, CreateProject)
- Animations (fadeUp, countUp, hover, scroll reveal)
- Login/Register redesignés et animés
- Footer premium avec newsletter et stats
- Mode nuit/jour avec toggle
- Curseur custom désactivé sur mobile
- Histogramme caché si pas de données
- Bouton retour KYC

## Ce qui RESTE à faire 🔴
1. **Splash screen** — page noire après animation (BUG ACTUEL)
2. **Soumission projet** — tester CreateProjectPage avec KYC vérifié
3. **Notifications** — connecter le 🔔 aux vraies données API
4. **Matching** — recommandations investisseur nécessitent KYC vérifié
5. **Messages investisseur** — tester avec vrai compte
6. **KYC** — tester soumission de documents

## Bug splash screen — détail technique
```typescript
// Dans SplashScreen.tsx, la prop est :
interface SplashScreenProps {
  onDone: () => void  // ← vérifier si c'est onDone ou onComplete
}

// Dans LandingPage.tsx :
if (!splashDone) return <SplashScreen onDone={() => setSplashDone(true)} />
// Les hooks doivent TOUS être déclarés avant ce return !
// Ordre actuel dans LandingPage :
// 1. useState(splashDone) ✅
// 2. useState(menuOpen) ✅  
// 3. useIsMobile() ✅
// 4. useScrollReveal() ✅
// 5. if (!splashDone) return <SplashScreen /> ✅
// 6. return ( ... landing page ... )
```

## Fichiers locaux
- Projet : `~/Bureau/GOLDEN/golden_full_project/`
- Frontend : `~/Bureau/GOLDEN/golden_full_project/golden_frontend/`
- Backend : `~/Bureau/GOLDEN/golden_full_project/golden_project/`
