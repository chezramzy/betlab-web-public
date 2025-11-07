# BATCH 6 - Agent 3 : Hooks & Page Home
## Checklist & Spécifications

**Date:** 2025-11-07
**Prérequis:** Agent 1 & Agent 2 complétés

---

## MISSION AGENT 3

Créer les hooks de gestion d'état et la page Home finale qui intègre tous les composants des Agent 1 et Agent 2.

---

## 1. HOOKS À CRÉER

### Hook 1: `lib/hooks/use-home-filters.ts`

**Responsabilités:**
- Gérer l'état des filtres (date, sport, ligues, type prédiction)
- Gérer les filtres avancés (confidence, edge, live)
- Filtrer les matchs selon les critères
- Synchroniser avec URL params (optionnel)

**Interface:**
```typescript
interface UseHomeFiltersReturn {
  // Date
  selectedDate: Date
  setSelectedDate: (date: Date) => void

  // Sport
  selectedSport: "football" | "basketball"
  setSelectedSport: (sport: "football" | "basketball") => void

  // Leagues
  selectedLeagues: string[]
  setSelectedLeagues: (leagues: string[]) => void
  allLeagues: League[]

  // Prediction Type
  selectedPredictionType: PredictionType
  setSelectedPredictionType: (type: PredictionType) => void

  // Filters
  filters: {
    confidence: ConfidenceLevel[]
    edge: number
    liveOnly: boolean
  }
  setFilters: (filters: Partial<Filters>) => void

  // Computed
  filteredMatches: Match[]
  isFiltersActive: boolean
  resetFilters: () => void
}
```

**Logique de filtrage:**
1. Filtrer par date (kickoffTime >= startOfDay && kickoffTime <= endOfDay)
2. Filtrer par sport (league.sport === selectedSport)
3. Filtrer par ligues sélectionnées (si selectedLeagues.length > 0)
4. Filtrer par confidence (prediction.confidence in filters.confidence)
5. Filtrer par edge (prediction.edge >= filters.edge)
6. Filtrer par live (si liveOnly, status === "live")

---

### Hook 2: `lib/hooks/use-matches-fetch.ts`

**Responsabilités:**
- Récupérer les matchs depuis l'API
- Gérer loading state
- Gérer error state
- Cache les résultats (optionnel avec React Query)

**Interface:**
```typescript
interface UseMatchesFetchReturn {
  matches: Match[]
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

// Usage
const { matches, isLoading, error, refetch } = useMatchesFetch({
  date: selectedDate,
  sport: selectedSport,
})
```

**Endpoints API (à créer si nécessaire):**
- `GET /api/matches?date=2025-11-07&sport=football`
- Retourne un tableau de matchs avec prédictions

---

### Hook 3: `lib/hooks/use-favorites.ts`

**Responsabilités:**
- Gérer les favoris localement (localStorage)
- Toggle favorite
- Vérifier si un match est favoris
- Sync avec tous les composants

**Interface:**
```typescript
interface UseFavoritesReturn {
  favorites: Set<string>
  isFavorite: (matchId: string) => boolean
  toggleFavorite: (matchId: string) => void
  clearFavorites: () => void
}

// Usage
const { favorites, isFavorite, toggleFavorite } = useFavorites()
```

**localStorage key:** `betlab:favorites`

---

### Hook 4: `lib/hooks/use-match-navigation.ts`

**Responsabilités:**
- Navigation vers détails match
- Prefetch au hover (optionnel)
- Gérer l'historique

**Interface:**
```typescript
interface UseMatchNavigationReturn {
  navigateToMatch: (matchId: string) => void
  prefetchMatch: (matchId: string) => void
}

// Usage
const { navigateToMatch, prefetchMatch } = useMatchNavigation()
```

---

## 2. PAGE HOME À CRÉER

### Fichier: `app/(main)/page.tsx`

**Structure:**
```typescript
"use client"

import { CalendarWidget } from "@/lib/components/home/calendar-widget"
import { SportSelector } from "@/lib/components/home/sport-selector"
import { LeaguesSelector } from "@/lib/components/home/leagues-selector"
import { PredictionsSelector } from "@/lib/components/home/predictions-selector"
import { FiltersPanel } from "@/lib/components/home/filters-panel"
import { MatchList } from "@/lib/components/home/match-list"
import { useHomeFilters } from "@/lib/hooks/use-home-filters"
import { useMatchesFetch } from "@/lib/hooks/use-matches-fetch"
import { useFavorites } from "@/lib/hooks/use-favorites"
import { useMatchNavigation } from "@/lib/hooks/use-match-navigation"

export default function HomePage() {
  // Hooks
  const {
    selectedDate,
    setSelectedDate,
    selectedSport,
    selectedLeagues,
    setSelectedLeagues,
    selectedPredictionType,
    setSelectedPredictionType,
    filters,
    setFilters,
    filteredMatches,
    resetFilters,
  } = useHomeFilters()

  const { matches, isLoading, error, refetch } = useMatchesFetch({
    date: selectedDate,
    sport: selectedSport,
  })

  const { isFavorite, toggleFavorite } = useFavorites()

  const { navigateToMatch } = useMatchNavigation()

  // Merge favorites with matches
  const matchesWithFavorites = filteredMatches.map(match => ({
    ...match,
    isFavorite: isFavorite(match.id),
  }))

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container py-4 space-y-4">
          <h1 className="text-2xl font-bold">BetLab</h1>

          {/* Calendar Widget */}
          <CalendarWidget
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />

          {/* Sport Selector */}
          <SportSelector />

          {/* Predictions Selector */}
          <PredictionsSelector
            selected={selectedPredictionType}
            onSelect={setSelectedPredictionType}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6 space-y-6">
        {/* Filters Row */}
        <div className="flex items-center gap-2">
          <LeaguesSelector
            selected={selectedLeagues}
            onSelectionChange={setSelectedLeagues}
          />

          <FiltersPanel
            filters={filters}
            onFiltersChange={setFilters}
          />
        </div>

        {/* Error State */}
        {error && (
          <div className="p-4 rounded-lg bg-destructive/10 text-destructive">
            <p>Erreur lors du chargement des matchs: {error.message}</p>
            <button onClick={refetch} className="underline">Réessayer</button>
          </div>
        )}

        {/* Match List */}
        <MatchList
          matches={matchesWithFavorites}
          isLoading={isLoading}
          onMatchClick={navigateToMatch}
          onFavoriteToggle={toggleFavorite}
        />
      </main>
    </div>
  )
}
```

---

## 3. COMPOSANTS UI MANQUANTS (si nécessaire)

### À vérifier/créer:
- [ ] `lib/components/ui/error-boundary.tsx` - Error boundary pour la page
- [ ] `lib/components/ui/refresh-button.tsx` - Bouton refresh manuel
- [ ] `lib/components/ui/loading-spinner.tsx` - Spinner global

---

## 4. API ROUTES À CRÉER (optionnel)

Si vous utilisez Next.js API routes:

### `app/api/matches/route.ts`
```typescript
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const date = searchParams.get("date")
  const sport = searchParams.get("sport")

  // Fetch from external API or database
  const matches = await fetchMatchesFromAPI(date, sport)

  return NextResponse.json(matches)
}
```

---

## 5. OPTIMISATIONS RECOMMANDÉES

### React Query (optionnel mais recommandé)
```bash
pnpm add @tanstack/react-query
```

**Avantages:**
- Cache automatique
- Refetch au focus
- Retry automatique
- Loading states unifiés

**Exemple:**
```typescript
// lib/hooks/use-matches-fetch.ts
import { useQuery } from "@tanstack/react-query"

export function useMatchesFetch({ date, sport }) {
  return useQuery({
    queryKey: ["matches", date, sport],
    queryFn: () => fetchMatches(date, sport),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
```

### Virtualisation (si beaucoup de matchs)
```bash
pnpm add react-window
```

### PWA / Service Worker (optionnel)
- Cache des assets
- Offline support
- Background sync

---

## 6. TESTS À EFFECTUER

### Tests Fonctionnels:
- [ ] Changer la date → Matchs filtrés correctement
- [ ] Changer le sport → Matchs du sport correct
- [ ] Sélectionner des ligues → Filtrage correct
- [ ] Changer type prédiction → Prédictions affichées correctement
- [ ] Toggle confidence → Filtrage correct
- [ ] Slider edge → Filtrage correct
- [ ] Toggle live → Seuls matchs live affichés
- [ ] Toggle favorite → Persiste dans localStorage
- [ ] Clic sur match → Navigation vers détail
- [ ] Swipe left → Toggle favorite
- [ ] Collapse section → Animation smooth

### Tests Performance:
- [ ] Lazy loading fonctionne (scroll)
- [ ] Skeleton affiché pendant chargement
- [ ] Pas de re-renders inutiles (React DevTools)
- [ ] localStorage ne ralentit pas l'app

### Tests Responsive:
- [ ] Mobile (320px - 768px) → Layout correct
- [ ] Tablet (768px - 1024px) → Layout correct
- [ ] Desktop (1024px+) → Layout correct

### Tests Accessibility:
- [ ] Navigation clavier fonctionne
- [ ] Screen reader annonce les changements
- [ ] Focus visible sur tous les interactifs

---

## 7. CHECKLIST FINALE

### Hooks:
- [ ] `use-home-filters.ts` créé et testé
- [ ] `use-matches-fetch.ts` créé et testé
- [ ] `use-favorites.ts` créé et testé
- [ ] `use-match-navigation.ts` créé et testé

### Page:
- [ ] `app/(main)/page.tsx` créé
- [ ] Intégration Agent 1 (sélecteurs)
- [ ] Intégration Agent 2 (match list)
- [ ] Header sticky avec backdrop blur
- [ ] Error states gérés
- [ ] Loading states gérés
- [ ] Empty states gérés

### Optimisations:
- [ ] React Query installé (optionnel)
- [ ] Cache API configuré
- [ ] localStorage pour favoris
- [ ] URL params sync (optionnel)

### Tests:
- [ ] Tests fonctionnels passés
- [ ] Tests performance passés
- [ ] Tests responsive passés
- [ ] Tests accessibility passés

### Documentation:
- [ ] README.md mis à jour
- [ ] BATCH6_AGENT3_REPORT.md créé
- [ ] STATUS.txt mis à jour

---

## 8. STRUCTURE FINALE ATTENDUE

```
app/
├── (main)/
│   └── page.tsx                    ← Page Home finale
└── api/
    └── matches/
        └── route.ts                ← API route (optionnel)

lib/
├── hooks/
│   ├── use-home-filters.ts         ← Gestion filtres
│   ├── use-matches-fetch.ts        ← Fetch matchs
│   ├── use-favorites.ts            ← Gestion favoris
│   └── use-match-navigation.ts     ← Navigation
└── components/
    ├── home/
    │   ├── calendar-widget.tsx     ← Agent 1
    │   ├── sport-selector.tsx      ← Agent 1
    │   ├── leagues-selector.tsx    ← Agent 1
    │   ├── predictions-selector.tsx← Agent 1
    │   ├── filters-panel.tsx       ← Agent 1
    │   ├── match-list.tsx          ← Agent 2
    │   ├── time-slot-section.tsx   ← Agent 2
    │   ├── match-card-compact.tsx  ← Agent 2
    │   ├── match-card-skeleton.tsx ← Agent 2
    │   ├── prediction-display.tsx  ← Agent 2
    │   └── index.ts                ← Exports
    └── ui/
        └── (shadcn components)
```

---

## 9. TEMPS ESTIMÉ

- **Hooks:** 2h
- **Page Home:** 1h
- **Tests:** 1h
- **Optimisations:** 1h (optionnel)
- **Total:** 4-5h

---

## 10. RESSOURCES

### Documentation:
- Agent 1 Report: `lib/components/home/BATCH6_AGENT1_REPORT.md`
- Agent 2 Report: `lib/components/home/BATCH6_AGENT2_REPORT.md`
- Components Overview: `lib/components/home/COMPONENTS_OVERVIEW.md`
- Integration Guide: `lib/components/home/INTEGRATION_GUIDE.md`

### Démos:
- Agent 1: `lib/components/home/demo.tsx`
- Agent 2: `lib/components/home/match-list-demo.tsx`

### Types:
- Match: `lib/components/home/match-card-compact.tsx`
- Prediction: `lib/components/home/prediction-display.tsx`
- ConfidenceLevel: `lib/components/home/filters-panel.tsx`

---

**BONNE CHANCE AGENT 3 !** 🚀

N'oublie pas de créer un rapport détaillé à la fin comme les Agents 1 et 2.
