# BetLab Web - Application de Prédictions Sportives

Version web Next.js de l'application mobile Flutter BetLab.

## 🎯 Vue d'ensemble

BetLab Web est une application de prédictions sportives pour le Football et le Basketball. Elle fournit des prédictions basées sur des modèles d'IA, des statistiques détaillées, et un suivi en temps réel des matchs.

## 🚀 Technologies

- **Framework**: Next.js 16 (React 19, App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Backend**: FastAPI + Supabase
- **Auth**: Supabase Auth
- **HTTP Client**: Axios
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Icons**: Lucide React
- **Theme**: next-themes

## 📁 Structure du Projet

```
betlab-web/
├── app/                          # Next.js App Router
│   ├── auth/                     # Pages d'authentification
│   ├── dashboard/                # Tableau de bord
│   ├── matches/                  # Pages des matchs
│   ├── settings/                 # Paramètres utilisateur
│   ├── layout.tsx                # Layout principal
│   ├── page.tsx                  # Page d'accueil
│   └── globals.css               # Styles globaux
│
├── lib/
│   ├── core/                     # Couche infrastructure
│   │   ├── config/               # Configurations (API, Supabase)
│   │   ├── enums/                # Enums (SportType, ConfidenceLevel)
│   │   ├── services/             # Services (Auth, HTTP, Supabase)
│   │   ├── theme/                # Thème et couleurs
│   │   └── utils/                # Utilitaires
│   │
│   ├── data/                     # Couche données
│   │   ├── models/               # Modèles de données (TypeScript)
│   │   └── services/             # Services API (BetLabApiService)
│   │
│   ├── stores/                   # Zustand stores
│   │   ├── auth-store.ts         # Store authentification
│   │   ├── sport-store.ts        # Store sport actif
│   │   └── theme-store.ts        # Store thème
│   │
│   ├── types/                    # Types TypeScript
│   │   ├── user.ts               # Types utilisateur
│   │   ├── fixture.ts            # Types matchs
│   │   ├── prediction.ts         # Types prédictions
│   │   └── league.ts             # Types ligues
│   │
│   ├── hooks/                    # Custom React Hooks
│   │
│   └── components/               # Composants React
│       ├── ui/                   # Composants UI de base
│       ├── common/               # Composants communs
│       ├── cards/                # Composants cartes
│       ├── layouts/              # Composants layout
│       └── providers/            # Providers (Query, Theme, Auth)
│
├── public/                       # Assets statiques
├── .env.local                    # Variables d'environnement
├── package.json                  # Dépendances
├── tsconfig.json                 # Configuration TypeScript
└── README.md                     # Documentation
```

## 🎨 Couleurs BetLab

### Couleurs Primaires
- **Navy**: `#003366` - Couleur principale
- **Navy Light**: `#0A4A7A` - États hover
- **Navy Ultra Light**: `#E6EFF7` - Backgrounds
- **Lime**: `#C8DC3F` - Accent, CTA
- **Lime Light**: `#E5F077` - Highlights
- **Lime Ultra Light**: `#F7FCE0` - Backgrounds légers

### Couleurs Neutres
- **Background**: `#F8F9FA`
- **Gray**: `#6B7280`
- **Text Primary**: `#1F2937`
- **Text Secondary**: `#6B7280`

### Couleurs Sémantiques
- **Success**: `#10B981` (Vert)
- **Error**: `#EF4444` (Rouge)
- **Warning**: `#F59E0B` (Orange)
- **Info**: `#3B82F6` (Bleu)
- **Live**: `#DC2626` (Rouge vif)

## 🔧 Installation

1. **Cloner le projet**
```bash
cd betlab-web
```

2. **Installer les dépendances avec pnpm**
```bash
pnpm install
```

3. **Configurer les variables d'environnement**

Créer un fichier `.env.local` :
```env
NEXT_PUBLIC_API_BASE_URL=https://fastapi-production-2b94.up.railway.app
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Lancer le serveur de développement**
```bash
pnpm dev
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000)

## 📦 Scripts Disponibles

```bash
pnpm dev          # Lancer en mode développement
pnpm build        # Build pour la production
pnpm start        # Démarrer en production
pnpm lint         # Linter le code
```

## 🏗️ Architecture

### State Management (Zustand)

**Auth Store** (`lib/stores/auth-store.ts`)
```typescript
const { user, signIn, signOut } = useAuthStore();
```

**Sport Store** (`lib/stores/sport-store.ts`)
```typescript
const { activeSport, setActiveSport } = useSportStore();
```

**Theme Store** (`lib/stores/theme-store.ts`)
```typescript
const { themeMode, setThemeMode } = useThemeStore();
```

### Services

**BetLab API Service** (`lib/data/services/betlab-api-service.ts`)
- `getFixtures(sport?)` - Récupérer les matchs
- `getLiveFixtures(sport?)` - Matchs en direct
- `getFixturesByDate(date, leagueId?, sport?)` - Matchs par date
- `getPredictions(fixtureId)` - Prédictions pour un match
- `getOdds(fixtureId)` - Cotes d'un match

**Auth Service** (`lib/core/services/auth-service.ts`)
- `signIn(email, password)` - Connexion
- `signUp(email, password)` - Inscription
- `signOut()` - Déconnexion
- `resetPassword(email)` - Réinitialiser mot de passe
- `updatePassword(newPassword)` - Mettre à jour mot de passe

**HTTP Service** (`lib/core/services/http-service.ts`)
- Client HTTP avec retry automatique
- Gestion du token d'authentification
- Timeout de 90 secondes

## 🎯 Fonctionnalités Principales

### 🏠 Page d'Accueil
- Affichage des matchs du jour
- Filtres par sport (Football, Basketball)
- Filtres par ligue
- Filtres par niveau de confiance
- Calendrier de sélection de date

### ⚽ Prédictions Football
- **1X2** (Domicile / Nul / Extérieur)
- **BTTS** (Both Teams To Score)
- **HT/FT** (Mi-temps / Temps plein)
- **Over/Under** (0.5, 1.5, 2.5, 3.5)
- **Clean Sheet** (Sans encaisser)
- **Corners** (Nombre de coins)
- **Exact Score** (Score exact)

### 🏀 Prédictions Basketball
- **Moneyline** (Vainqueur)
- **Point Total** (Over/Under)
- **Spread** (Écart de points)

### 👤 Gestion Utilisateur
- Inscription / Connexion
- Profil utilisateur
- Ligues favorites
- Préférences de prédictions
- Historique des prédictions

### 🎨 Thème
- Mode clair
- Mode sombre
- Mode système (auto)

## 🔒 Authentification

L'authentification est gérée par **Supabase Auth** avec :
- Email/Password
- Sessions persistantes
- Tokens JWT automatiques
- Refresh token automatique

## 📊 API Backend

**Base URL**: `https://fastapi-production-2b94.up.railway.app/api`

### Endpoints Principaux

```
GET /fixtures                     # Tous les matchs
GET /fixtures/live                # Matchs en direct
GET /fixtures?date=YYYY-MM-DD     # Matchs par date
GET /predictions?fixture_id=X     # Prédictions
GET /odds?fixture_id=X            # Cotes
```

## 🎨 Utilisation des Couleurs dans Tailwind

```tsx
// Classes Tailwind disponibles
className="bg-navy text-lime"
className="bg-success text-white"
className="gradient-navy"
className="gradient-lime"
className="gradient-card"
```

## 🚧 Prochaines Étapes

- [ ] Créer les composants UI de base (Button, Card, Input)
- [ ] Implémenter les pages d'authentification
- [ ] Créer la page d'accueil avec liste des matchs
- [ ] Implémenter la page de détails d'un match
- [ ] Ajouter les filtres et recherche
- [ ] Créer le système de favoris
- [ ] Implémenter le profil utilisateur
- [ ] Ajouter les graphiques et statistiques
- [ ] Optimiser les performances (caching, SSR)
- [ ] Tests unitaires et E2E
- [ ] Déploiement

## 📝 Correspondance Flutter ↔ Next.js

| Flutter | Next.js |
|---------|---------|
| `Riverpod Provider` | `Zustand Store` |
| `GoRouter` | `Next.js App Router` |
| `StatefulWidget` | `React Component + useState` |
| `StreamProvider` | `React Query (useQuery)` |
| `SharedPreferences` | `localStorage + Zustand persist` |
| `http package` | `Axios` |
| `Supabase Flutter` | `@supabase/supabase-js` |

## 🤝 Contribution

Ce projet est la version web de l'application mobile Flutter BetLab.

## 📄 Licence

Propriétaire - Tous droits réservés

---

**Créé avec ❤️ en utilisant Next.js 16 et TypeScript**
