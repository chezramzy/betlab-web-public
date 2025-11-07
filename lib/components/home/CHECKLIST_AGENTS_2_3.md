# Checklist pour Agents 2 & 3 - BATCH 6

## État actuel (Agent 1 - COMPLÉTÉ)

### Composants disponibles

- ✅ CalendarWidget - Date picker avec swipe
- ✅ SportSelector - Toggle Football/Basketball (Zustand intégré)
- ✅ LeaguesSelector - Dropdown/Sheet ligues
- ✅ PredictionsSelector - 8 tabs scrollables
- ✅ FiltersPanel - Filtres avancés collapsible

### Infrastructure

- ✅ Slider UI component créé
- ✅ CSS scrollbar-hide ajouté
- ✅ @radix-ui/react-slider installé
- ✅ Export centralisé (index.ts)
- ✅ Types exportés (PredictionType, ConfidenceLevel)

### Documentation

- ✅ README.md - Documentation technique
- ✅ INTEGRATION_GUIDE.md - Guide d'intégration avec exemples
- ✅ COMPONENTS_OVERVIEW.md - Vue d'ensemble visuelle
- ✅ BATCH6_AGENT1_REPORT.md - Rapport détaillé
- ✅ demo.tsx - Fichier de démonstration
- ✅ .vscode-snippets.json - Snippets VS Code

---

## Agent 2 : Match Cards & Lists

### Composants à créer

- [ ] MatchCard - Carte de match avec prédiction
  - Design compact mobile
  - Score/horaire
  - Équipes avec logos
  - Badge prédiction
  - Badge confidence (High/Med/Low)
  - xG stats (si Internal)
  - Action: Tap pour détails

- [ ] MatchCardSkeleton - Loading state
  - Shimmer effect
  - Same dimensions

- [ ] MatchList - Liste de matchs
  - Virtualized scroll (si > 50 matchs)
  - Group by league
  - Empty state
  - Error state

- [ ] MatchListHeader - Header par ligue
  - Logo ligue
  - Nom ligue
  - Compteur matchs
  - Collapsible

### Intégration avec Agent 1

```tsx
// Utiliser les filtres de l'Agent 1
const filteredMatches = useMemo(() => {
  return matches.filter(match => {
    // Date (CalendarWidget)
    if (!isSameDay(new Date(match.date), selectedDate)) return false

    // Sport (SportSelector via Zustand)
    if (match.sport !== activeSport) return false

    // League (LeaguesSelector)
    if (selectedLeague !== "all" && match.league.id !== selectedLeague) return false

    // Prediction Type (PredictionsSelector)
    const prediction = match.predictions[selectedPrediction]
    if (!prediction) return false

    // Confidence (FiltersPanel)
    if (selectedConfidences.length > 0 &&
        !selectedConfidences.includes(prediction.confidence)) return false

    // xG Range (FiltersPanel - si Internal)
    if (selectedPrediction === "internal") {
      const xg = prediction.xG || 0
      if (xg < xGRange[0] || xg > xGRange[1]) return false
    }

    // Min Probability (FiltersPanel)
    if (prediction.probability < minProbability) return false

    return true
  })
}, [dependencies])

// Render
<MatchList matches={filteredMatches} />
```

### Types à définir

```typescript
interface Match {
  id: string
  date: string // ISO date
  sport: SportType
  league: {
    id: string
    name: string
    logo?: string
    country: string
  }
  homeTeam: {
    id: string
    name: string
    logo?: string
  }
  awayTeam: {
    id: string
    name: string
    logo?: string
  }
  status: "scheduled" | "live" | "finished"
  score?: {
    home: number
    away: number
  }
  predictions: {
    internal?: Prediction
    over15?: Prediction
    btts?: Prediction
    exact?: Prediction
    htft?: Prediction
    half?: Prediction
    cleansheet?: Prediction
    corners?: Prediction
  }
}

interface Prediction {
  value: string // "1", "X", "2", "Yes", etc.
  probability: number // 0-100
  confidence: ConfidenceLevel
  xG?: number // Pour type "internal"
  odds?: number
}
```

### Fichiers à créer

```
lib/components/home/
├── match-card.tsx            ← Carte de match
├── match-card-skeleton.tsx   ← Loading state
├── match-list.tsx            ← Liste de matchs
├── match-list-header.tsx     ← Header groupé par ligue
└── match-empty-state.tsx     ← État vide
```

### Tests à effectuer

- [ ] Affichage correct des matchs filtrés
- [ ] Loading states fonctionnels
- [ ] Empty state si aucun match
- [ ] Scroll performant (virtualized si > 50)
- [ ] Groupement par ligue
- [ ] Badges confidence colorés
- [ ] Responsive mobile/desktop
- [ ] Dark mode
- [ ] Touch targets ≥ 44px

---

## Agent 3 : Intégration finale Page Home

### Page Home finale

- [ ] Créer app/(protected)/home/page.tsx
- [ ] Intégrer tous les composants (Agent 1 + Agent 2)
- [ ] State management complet
- [ ] Fetch data depuis API
- [ ] React Query integration
- [ ] URL search params (persistence)
- [ ] Loading states
- [ ] Error handling

### Optimisations

- [ ] Memoization (useMemo, useCallback)
- [ ] Virtualized scroll (react-window)
- [ ] Lazy loading images
- [ ] Prefetch next page
- [ ] Cache strategy (React Query)

### Features avancées

- [ ] Pull-to-refresh (mobile)
- [ ] Infinite scroll (si pagination)
- [ ] Share functionality
- [ ] Favorites persistence
- [ ] Notifications (live matches)
- [ ] Analytics tracking

### Structure finale

```tsx
// app/(protected)/home/page.tsx

"use client"

import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { useSportStore } from "@/lib/stores/sport-store"
import {
  CalendarWidget,
  SportSelector,
  LeaguesSelector,
  PredictionsSelector,
  PredictionType,
  FiltersPanel,
  ConfidenceLevel,
  MatchList,
} from "@/lib/components/home"

export default function HomePage() {
  // State management (Agent 1)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedLeague, setSelectedLeague] = useState<string | "all" | "favorites">("all")
  const [selectedPrediction, setSelectedPrediction] = useState<PredictionType>("internal")
  const [selectedConfidences, setSelectedConfidences] = useState<ConfidenceLevel[]>(["high"])
  const [xGRange, setXGRange] = useState<[number, number]>([0, 5])
  const [minProbability, setMinProbability] = useState(50)

  // Zustand store
  const { activeSport } = useSportStore()

  // Fetch data
  const { data: matches, isLoading, error } = useQuery({
    queryKey: ["matches", selectedDate, activeSport],
    queryFn: () => fetchMatches({ date: selectedDate, sport: activeSport }),
    staleTime: 5 * 60 * 1000,
  })

  // Compute match counts
  const matchCountsByDate = useMemo(() => {
    // ... compute from matches
  }, [matches])

  // Extract leagues
  const leagues = useMemo(() => {
    // ... extract from matches
  }, [matches])

  // Filter matches
  const filteredMatches = useMemo(() => {
    // ... apply all filters
  }, [matches, /* all filters */])

  return (
    <div className="space-y-4 p-4">
      {/* Filters Section - Agent 1 */}
      <CalendarWidget
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        matchCountsByDate={matchCountsByDate}
      />

      <SportSelector />

      <div className="flex gap-2">
        <LeaguesSelector
          leagues={leagues}
          selectedLeagueId={selectedLeague}
          onLeagueChange={setSelectedLeague}
        />
      </div>

      <PredictionsSelector
        selectedType={selectedPrediction}
        onTypeChange={setSelectedPrediction}
      />

      <FiltersPanel
        selectedConfidences={selectedConfidences}
        onConfidencesChange={setSelectedConfidences}
        xGRange={xGRange}
        onXGRangeChange={setXGRange}
        minProbability={minProbability}
        onMinProbabilityChange={setMinProbability}
      />

      {/* Matches Section - Agent 2 */}
      {isLoading && <MatchListSkeleton />}
      {error && <ErrorState error={error} />}
      {matches && (
        <MatchList
          matches={filteredMatches}
          selectedPrediction={selectedPrediction}
        />
      )}
    </div>
  )
}
```

### Tests finaux

- [ ] E2E tests (Playwright)
- [ ] Performance tests (Lighthouse)
- [ ] Accessibility tests (axe)
- [ ] Mobile tests (real devices)
- [ ] Dark mode tests
- [ ] Different screen sizes
- [ ] Slow network simulation
- [ ] Error scenarios

### Déploiement

- [ ] Build production
- [ ] Vérifier bundle size
- [ ] Tester sur staging
- [ ] SEO checks
- [ ] Analytics setup
- [ ] Monitoring setup (Sentry)
- [ ] Deploy to production

---

## Dépendances possibles à installer

```bash
# Pour Agent 2
pnpm add react-window           # Virtualized scroll
pnpm add react-intersection-observer  # Lazy loading

# Pour Agent 3
pnpm add @tanstack/react-query  # ✅ Déjà installé
pnpm add swr                    # Alternative à React Query (optionnel)
```

---

## Resources disponibles

### Composants Agent 1

```tsx
import {
  CalendarWidget,
  SportSelector,
  LeaguesSelector,
  PredictionsSelector,
  PredictionType,
  FiltersPanel,
  ConfidenceLevel,
} from "@/lib/components/home"
```

### Stores

```tsx
import { useSportStore } from "@/lib/stores/sport-store"
```

### Utils

```tsx
import { cn } from "@/lib/utils"
import { format, addDays, isSameDay } from "date-fns"
import { fr } from "date-fns/locale"
```

### UI Components (shadcn)

- Sheet (mobile modals)
- DropdownMenu
- Slider
- Skeleton
- Button
- Badge
- Card
- Separator

---

## Questions pour l'équipe

### Pour Agent 2

1. Design des MatchCards approuvé?
2. API endpoints disponibles?
3. Format exact des données match?
4. Logos des équipes hébergés où?
5. Virtualization nécessaire (combien de matchs max)?

### Pour Agent 3

1. Authentification déjà en place?
2. API rate limits?
3. Real-time updates nécessaires (WebSocket)?
4. Analytics provider (Google, Mixpanel)?
5. Error monitoring (Sentry)?
6. CDN pour images?

---

## Timeline suggérée

### Agent 2 (2-3h)

- 1h: MatchCard + Skeleton
- 1h: MatchList + Grouping
- 30min: Empty/Error states
- 30min: Tests et documentation

### Agent 3 (3-4h)

- 1h: Page Home + State management
- 1h: API integration + React Query
- 1h: Optimizations + URL params
- 1h: Tests E2E + Deploy

---

## Notes importantes

### État de l'Agent 1

Tous les composants de l'Agent 1 sont:
- ✅ Fonctionnels
- ✅ Typés (TypeScript strict)
- ✅ Documentés
- ✅ Mobile-first
- ✅ Dark mode
- ✅ Accessible

Vous pouvez les utiliser immédiatement!

### Conventions à respecter

- File naming: kebab-case.tsx
- Component naming: PascalCase
- Props interfaces: ComponentNameProps
- Use "use client" si interactif
- Min touch targets: 44px
- Animations: transition-all
- Imports: @/lib/...

### Support

Voir documentation complète:
- README.md
- INTEGRATION_GUIDE.md
- COMPONENTS_OVERVIEW.md
- demo.tsx

---

**Bonne chance pour la suite du BATCH 6!** 🚀
