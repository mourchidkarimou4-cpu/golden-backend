# GOLDEN Investissement — Frontend React

Stack : **React 18 · TypeScript · Vite · Tailwind CSS · Recharts · Axios**

---

## Structure

```
src/
├── styles/
│   └── globals.css              ← Design tokens CSS + classes utilitaires GOLDEN
├── lib/
│   ├── api.ts                   ← Client Axios + tous les endpoints API
│   └── auth.tsx                 ← Context Auth + hook useAuth (JWT)
├── hooks/
│   ├── useProjects.ts           ← Fetching projets avec filtres et pagination
│   └── useMessages.ts           ← Threads et messages avec polling
├── components/
│   ├── ui/index.tsx             ← Composants UI : Logo, KpiCard, Badges, Spinner...
│   ├── layout/
│   │   └── DashboardLayout.tsx  ← Sidebar + header partagés entre dashboards
│   └── dashboard/
│       ├── ProjectCard.tsx      ← Carte projet : match score, favori, progress
│       └── InvestModal.tsx      ← Modale investissement avec simulation ROI
└── pages/
    ├── LandingPage.tsx          ← Conversion fidèle du HTML original
    ├── LoginPage.tsx            ← Connexion JWT
    ├── RegisterPage.tsx         ← Inscription porteur / investisseur
    ├── KYCPage.tsx              ← Upload documents KYC (drag & drop)
    ├── DashboardPorteur.tsx     ← KPIs + jauge + onglets + investisseurs
    ├── DashboardInvestisseur.tsx← KPIs + donut chart + recommandations + portfolio
    ├── MessagesPage.tsx         ← Interface de messagerie (style iMessage)
    └── CreateProjectPage.tsx    ← Formulaire multi-étapes création projet
```

---

## Installation

```bash
npm install
cp .env.example .env.local
# Remplir VITE_API_URL et les clés Supabase dans .env.local
npm run dev
# → http://localhost:3000
```

---

## Variables d'environnement

```env
# API Django (local ou Render)
VITE_API_URL=http://localhost:8000/api/v1

# Supabase
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

---

## Build & déploiement Netlify

```bash
npm run build
# Glisser le dossier dist/ sur netlify.com
# ou connecter le repo GitHub pour déploiement automatique
```

---

## Routes

| Route | Page | Accès |
|-------|------|-------|
| `/` | Landing page | Public |
| `/login` | Connexion | Public |
| `/register` | Inscription | Public |
| `/kyc` | Upload KYC | Auth |
| `/porteur` | Dashboard porteur | Porteur |
| `/porteur/messages` | Messagerie | Porteur |
| `/porteur/nouveau` | Créer un projet | Porteur |
| `/investisseur` | Dashboard investisseur | Investisseur |
| `/investisseur/messages` | Messagerie | Investisseur |
