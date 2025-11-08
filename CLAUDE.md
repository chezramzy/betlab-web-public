# CLAUDE.md — Architecture BetLab Web & Next.js 16

> ✅ **MISE À JOUR POST-MIGRATION (2025-11-07)** : Architecture conforme Next.js 16.0.1 avec Server Components, PPR, et organisation feature-first.

---

## 📋 Table des Matières

1. [Architecture Actuelle](#1-architecture-actuelle)
2. [Principes Next.js 16](#2-principes-nextjs-16)
3. [Structure des Dossiers](#3-structure-des-dossiers)
4. [Data Fetching & Cache](#4-data-fetching--cache)
5. [State Management](#5-state-management)
6. [Authentification & Sécurité](#6-authentification--sécurité)
7. [Workflow Développement](#7-workflow-développement)
8. [Migration en Cours](#8-migration-en-cours)
9. [Références](#9-références)

---

## 1. Architecture Actuelle

### ✅ Implémentations Complétées (Nov 2025)

**Configuration Next.js 16:**
- ✅ `cacheComponents: true` activé (`next.config.ts:5`)
- ✅ `experimental.ppr: 'incremental'` activé (`next.config.ts:40`)
- ✅ `typescript.ignoreBuildErrors` retiré - Build strict
- ✅ Turbopack prêt avec optimizePackageImports

**Server Layer:**
- ✅ Services serveur dans `server/services/` (fixtures, predictions, match-detail)
- ✅ Auth guards dans `server/auth/guards.ts`
- ✅ Cache tags centralisés dans `server/cache/tags.ts`
- ✅ Server Actions de revalidation dans `server/actions/revalidate.ts`

**Pages Next.js 16:**
- ✅ Homepage convertie en Server Component async (`app/(public)/page.tsx`)
- ✅ Match Detail converti en Server Component async (`app/(public)/match/[id]/page.tsx`)
- ✅ PPR activé sur ces pages
- ✅ Layouts séparés (public) et (private)

**Features Architecture:**
- ✅ Module fixtures (`features/fixtures/`)
- ✅ Module predictions (`features/predictions/`)
- ✅ Module match-detail (`features/match-detail/`)
- ✅ Providers isolés (`providers/`)
- ✅ Shared UI (`shared/ui/`)

**API Layer:**
- ✅ Route Handlers créés (`app/api/fixtures`, `app/api/predictions`)
- ✅ Proxy modernisé avec guards (`proxy.ts`)

---

## 2. Principes Next.js 16

### 2.1 Server Components First

**Règle d'Or** : Par défaut, tout est Server Component sauf si explicitement "use client"

```typescript
// ✅ BON - Server Component (default)
export default async function Page() {
  const data = await getServerData();
  return <Client initialData={data} />;
}

// ❌ MAUVAIS - Client fetching
"use client";
export default function Page() {
  const { data } = useQuery(...);
  return <div>{data}</div>;
}
```

### 2.2 Cache & Revalidation

**Cache Strategy:**
- Server Services utilisent `cache()` de React
- `fetch` avec `next: { revalidate, tags }`
- Invalidation via Server Actions + `revalidateTag()`

```typescript
// server/services/fixtures.ts
export const getFixtures = cache(async (date: string) => {
  const res = await fetch(`${env.API_URL}/fixtures?date=${date}`, {
    next: {
      revalidate: 300, // 5 minutes
      tags: [CACHE_TAGS.fixtures(date)],
    },
  });
  return res.json();
});

// server/actions/revalidate.ts
export async function revalidateFixtures(date?: string) {
  revalidateTag(CACHE_TAGS.fixtures(date));
}
```

### 2.3 PPR (Partial Pre-Rendering)

**Usage:**
```typescript
// app/(public)/page.tsx
export const experimental_ppr = true; // ✅ Active PPR

export default async function HomePage() {
  const matches = await getTodayFixtures(); // Cached server fetch

  return (
    <Suspense fallback={<Loading />}>
      <ClientComponent initialData={matches} />
    </Suspense>
  );
}
```

### 2.4 React Query - Usage Limité

**Quand utiliser React Query:**
- ✅ Polling temps réel (live scores)
- ✅ Mutations client avec optimistic updates
- ✅ Données nécessitant refetch fréquent côté client

**Quand NE PAS utiliser:**
- ❌ Data fetching initial (utiliser Server Components)
- ❌ Données statiques ou semi-statiques
- ❌ Données nécessaires au SEO

```typescript
// ✅ BON - Polling live scores
'use client';
export function useLiveScores(fixtureIds: number[]) {
  return useQuery({
    queryKey: ['live-scores', fixtureIds],
    queryFn: () => fetch('/api/fixtures/live').then(r => r.json()),
    refetchInterval: 30000, // 30s
  });
}
```

---

## 3. Structure des Dossiers

### 3.1 Organisation Actuelle

```
betlab-web/
├── app/
│   ├── (public)/              # Pages publiques
│   │   ├── layout.tsx         # Server Component wrapper
│   │   ├── layout.client.tsx  # Client navigation
│   │   ├── page.tsx           # Homepage (Server Component async)
│   │   ├── page.client.tsx    # Homepage UI client
│   │   ├── match/
│   │   │   └── [id]/
│   │   │       ├── page.tsx           # Server Component
│   │   │       ├── page.client.tsx    # UI client
│   │   │       └── page.components.tsx # Loading/Error states
│   │   └── matches/
│   ├── (private)/             # Pages privées (auth required)
│   │   ├── layout.tsx         # Avec QueryProvider
│   │   ├── dashboard/
│   │   ├── settings/
│   │   ├── favorites/
│   │   └── onboarding/
│   ├── auth/                  # Pages auth (hors groupes)
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   ├── api/                   # Route Handlers
│   │   ├── fixtures/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   └── predictions/
│   │       └── route.ts
│   ├── layout.tsx             # Root layout (fonts, providers racine)
│   ├── globals.css
│   └── manifest.ts
│
├── server/                    # Server-only code
│   ├── services/
│   │   ├── fixtures.ts        # fetch + cache() + tags
│   │   ├── predictions.ts
│   │   └── match-detail.ts
│   ├── auth/
│   │   └── guards.ts          # getSession, hasCompletedOnboarding, etc.
│   ├── cache/
│   │   └── tags.ts            # CACHE_TAGS, CACHE_TIMES
│   └── actions/
│       └── revalidate.ts      # Server Actions
│
├── features/                  # Feature modules (feature-first)
│   ├── fixtures/
│   │   ├── components/        # (à migrer depuis lib/components/home)
│   │   ├── hooks/
│   │   │   └── use-fixture-filters.ts  # Client-side filtering
│   │   ├── types.ts
│   │   └── index.ts
│   ├── predictions/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── types.ts
│   │   └── index.ts
│   └── match-detail/
│       ├── components/
│       ├── hooks/
│       ├── types.ts
│       └── index.ts
│
├── shared/
│   ├── ui/
│   │   └── index.ts           # Re-exports composants génériques
│   ├── config/
│   │   └── env.ts             # Variables d'env typées (Zod)
│   └── utils/
│
├── providers/
│   ├── query-provider.client.tsx
│   ├── theme-provider.client.tsx
│   └── index.ts
│
├── lib/                       # ⏳ Legacy - À migrer progressivement
│   ├── components/            # → features/*/components/
│   ├── hooks/                 # → features/*/hooks/ ou supprimer
│   ├── core/
│   │   └── services/
│   │       └── http-service.ts  # ⏳ À supprimer (remplacé par server/services)
│   └── stores/                # Zustand (à garder)
│
├── proxy.ts                   # Next.js 16 proxy (auth + onboarding)
├── next.config.ts
├── tsconfig.json
├── package.json
├── CLAUDE.md                  # ← Ce fichier
├── MIGRATION_TODO.md          # Fichiers obsolètes à migrer
└── TYPESCRIPT_ERRORS.md       # Erreurs TS à corriger
```

### 3.2 Principes d'Organisation

**Feature-First:**
- Chaque feature est autonome (`fixtures/`, `predictions/`, etc.)
- Composants, hooks, types groupés par feature
- Facilite l'ajout/suppression de fonctionnalités
- Réduit les conflits git et améliore la navigation

**Séparation Server/Client:**
- `server/` → Code exclusivement serveur (import "server-only")
- `features/*/components/*.client.tsx` → Composants client explicites
- `features/*/components/*.tsx` → Server Components par défaut
- `providers/` → Providers client isolés dans (private)/layout

---

## 4. Data Fetching & Cache

### 4.1 Server Services (Recommandé)

**Localisation:** `server/services/*.ts`

**Pattern:**
```typescript
import "server-only";
import { cache } from "react";
import { CACHE_TAGS, CACHE_TIMES } from "../cache/tags";
import { env } from "@/shared/config/env";

export const getFixtures = cache(async (date: string): Promise<Match[]> => {
  const url = `${env.NEXT_PUBLIC_API_BASE_URL}/api/fixtures?date=${date}`;

  const response = await fetch(url, {
    next: {
      revalidate: CACHE_TIMES.fixtures, // 5 minutes
      tags: [CACHE_TAGS.fixtures(date)],
    },
  });

  if (!response.ok) throw new Error('Failed to fetch');

  const data = await response.json();
  return transformFixtures(data);
});
```

### 4.2 Cache Tags & Revalidation

**Tags Centralisés:** `server/cache/tags.ts`

```typescript
export const CACHE_TAGS = {
  fixtures: (date?: string) => date ? `fixtures-${date}` : 'fixtures',
  predictions: (fixtureId?: number) => fixtureId ? `predictions-${fixtureId}` : 'predictions',
  matchDetail: (id: number) => `match-detail-${id}`,
  // ...
};

export const CACHE_TIMES = {
  live: 30,        // 30 seconds
  fixtures: 300,   // 5 minutes
  predictions: 600, // 10 minutes
  // ...
};
```

**Revalidation:** `server/actions/revalidate.ts`

```typescript
'use server';
import { revalidateTag } from 'next/cache';

export async function revalidateFixtures(date?: string) {
  revalidateTag(CACHE_TAGS.fixtures(date));
  return { success: true };
}
```

### 4.3 Route Handlers (Fallback)

**Usage:** Fallback pour composants legacy ou client-side polling

```typescript
// app/api/fixtures/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getFixtures } from '@/server/services/fixtures';

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get('date') || new Date().toISOString().split('T')[0];

  try {
    const fixtures = await getFixtures(date);
    return NextResponse.json(fixtures, {
      headers: { 'Cache-Control': 'public, s-maxage=300' },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
```

---

## 5. State Management

### 5.1 Hiérarchie

1. **Server State** (Priorité 1) → Server Components + `cache()`
2. **URL State** → searchParams, pathname
3. **Client State Local** → useState, useReducer
4. **Client State Global** → Zustand (préférences UI)
5. **Remote Client State** → React Query (polling temps réel uniquement)

### 5.2 Zustand - State Local Persisté

**Usage:** Préférences utilisateur, état UI (sport actif, thème, etc.)

```typescript
// lib/stores/sport-store.ts
import { create } from 'zustand';

export const useSportStore = create<SportStore>((set) => ({
  activeSport: SportType.FOOTBALL,
  setActiveSport: (sport) => set({ activeSport: sport }),
}));
```

### 5.3 React Query - Polling Temps Réel

**Setup:** Provider dans `app/(private)/layout.tsx` uniquement

```typescript
// providers/query-provider.client.tsx
'use client';
export function QueryProvider({ children }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  }));
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
```

---

## 6. Authentification & Sécurité

### 6.1 Proxy Next.js 16

**Fichier:** `proxy.ts`

```typescript
import { NextResponse } from 'next/server';
import { getSession, hasCompletedOnboarding, isPublicRoute, shouldSkipProxy } from '@/server/auth/guards';

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  if (shouldSkipProxy(pathname)) return NextResponse.next();

  const session = await getSession(...);
  const isAuthenticated = !!session;

  // Logique auth + onboarding
  // ...
}
```

### 6.2 Guards Réutilisables

**Fichier:** `server/auth/guards.ts`

```typescript
import "server-only";

export async function getSession(accessToken: string, refreshToken: string) {
  // Create Supabase client, set session, return
}

export async function hasCompletedOnboarding(userId: string): Promise<boolean> {
  // Check profiles table
}

export function isPublicRoute(pathname: string): boolean {
  // Check against public routes list
}

export function shouldSkipProxy(pathname: string): boolean {
  // API, static, _next routes
}
```

### 6.3 Sécurité

- ✅ `server-only` sur tous les services serveur
- ✅ Variables d'env typées et validées (Zod)
- ✅ CORS géré via headers dans Route Handlers
- ✅ Tokens Supabase dans cookies httpOnly
- ⏳ Rate limiting à ajouter sur Route Handlers

---

## 7. Workflow Développement

### 7.1 Ajouter une Nouvelle Feature

```bash
# 1. Créer la structure
mkdir -p features/nouvelle-feature/{components,hooks}
touch features/nouvelle-feature/{types.ts,index.ts}

# 2. Créer le service serveur si nécessaire
touch server/services/nouvelle-feature.ts

# 3. Ajouter les tags de cache
# Éditer server/cache/tags.ts

# 4. Créer les composants
touch features/nouvelle-feature/components/feature-component.client.tsx

# 5. Exporter depuis index.ts
# Éditer features/nouvelle-feature/index.ts
```

### 7.2 Convertir un Composant en Server Component

```typescript
// AVANT - Client Component
'use client';
export default function Page() {
  const { data } = useQuery(...);
  return <div>{data}</div>;
}

// APRÈS - Server Component + Client UI
// page.tsx (Server)
export default async function Page() {
  const data = await getServerData();
  return <ClientComponent initialData={data} />;
}

// page.client.tsx (Client)
'use client';
export function ClientComponent({ initialData }) {
  // UI interactions only
  return <div>{initialData}</div>;
}
```

### 7.3 Build & Validation

```bash
# Type checking
npx tsc --noEmit

# Build Next.js
pnpm build

# Dev mode
pnpm dev

# Lint
pnpm lint
```

---

## 8. Migration en Cours

### 8.1 Fichiers Obsolètes

Voir `MIGRATION_TODO.md` pour la liste complète.

**À Supprimer Progressivement:**
- ⏳ `lib/core/services/http-service.ts` → Remplacé par server/services + Route Handlers
- ⏳ `lib/hooks/use-fixtures.ts` → Remplacé par server/services/fixtures.ts
- ⏳ `lib/hooks/use-predictions.ts` → Remplacé par server/services/predictions.ts
- ⏳ `lib/hooks/use-match-detail.ts` → Remplacé par server/services/match-detail.ts

**Composants à Migrer:**
- ⏳ `lib/components/home/*` → `features/fixtures/components/`
- ⏳ `lib/components/match-detail/*` → `features/match-detail/components/`

### 8.2 Erreurs TypeScript

Voir `TYPESCRIPT_ERRORS.md` pour le détail.

**Principales:**
- Types incompatibles entre lib/ et features/ (en cours de résolution)
- Imports obsolètes dans composants legacy
- Erreurs liées aux types auto-générés `.next/types/` (se règlent au rebuild)

**Critères de Suppression:**
- ✅ Aucun import actif
- ✅ Fonctionnalité remplacée et testée
- ✅ Build passe

---

## 9. Références

### 9.1 Documentation Officielle

- [Next.js 16 Blog](https://nextjs.org/blog/next-16) - Cache Components, PPR, Proxy
- [Next.js App Router - Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [Next.js Proxy File Convention](https://nextjs.org/docs/app/building-your-application/routing/proxy)
- [React 19 Docs](https://react.dev/blog/2024/12/05/react-19)
- [Next.js Caching](https://nextjs.org/docs/app/building-your-application/caching)

### 9.2 Ressources Internes

- `MIGRATION_TODO.md` - Plan de migration progressive
- `TYPESCRIPT_ERRORS.md` - Erreurs TS à corriger
- `API_PROBABILITIES_GUIDE.md` - Documentation API
- `API_RESPONSES_EXAMPLES.json` - Exemples de réponses API

---

## ✅ Checklist Avant Commit

- [ ] Types TypeScript valides (`npx tsc --noEmit`)
- [ ] Build Next.js réussit (`pnpm build`)
- [ ] Nouveaux services utilisent `server-only`
- [ ] Nouveaux composants client ont `"use client"`
- [ ] Tags de cache ajoutés si nouvelles données
- [ ] Documentation mise à jour (CLAUDE.md)
- [ ] Tests passent (si applicable)

---

**Dernière mise à jour:** 2025-11-07
**Version Architecture:** 2.0 (Post-Migration Next.js 16)
**Auteur:** Claude Code (Migration Agent)
