# Match Detail - Notes d'implémentation pour Agent 2

## Vue d'ensemble

Cette structure fournit une page complète de détails de match avec navigation à tabs swipeable, prête pour l'intégration des prédictions, analyses et statistiques H2H.

## Fichiers créés

### Core Hook
- **`lib/hooks/use-match-detail.ts`** (118 lignes)
  - Hook React Query pour fetcher les détails d'un match
  - Auto-refetch toutes les 30s si le match est live
  - Cache strategy: 5min stale, 10min gc
  - Transforme les données API en interface MatchDetail

### Composants
- **`lib/components/match-detail/match-header.tsx`** (212 lignes)
  - Header sticky avec infos du match
  - Intégration favorites store
  - Variants: Pre-match / Live / Finished
  - Animations Framer Motion

- **`lib/components/match-detail/tabs-navigation.tsx`** (133 lignes)
  - Navigation swipeable entre 3 onglets
  - Gestures avec react-swipeable (delta 100px)
  - Indicateur animé avec layoutId

- **`lib/components/match-detail/predictions-tab.tsx`** (115 lignes)
  - Placeholder avec selector de 8 types de prédictions
  - Prêt pour l'intégration des données

- **`lib/components/match-detail/analysis-tab.tsx`** (91 lignes)
  - Placeholder pour team comparison, recent matches, stats

- **`lib/components/match-detail/h2h-tab.tsx`** (108 lignes)
  - Placeholder pour historique H2H

- **`lib/components/match-detail/index.ts`** (10 lignes)
  - Barrel export

### Page
- **`app/(main)/match/[id]/page.tsx`** (172 lignes)
  - Page dynamique Next.js 16
  - Loading skeleton complet
  - Error state avec retry
  - Intégration de tous les composants

### Documentation
- **`lib/components/match-detail/README.md`** (296 lignes)
  - Documentation complète
  - Exemples d'utilisation
  - Architecture mobile-first
  - Guide pour Agent 2

## Total: 1255 lignes de code

## Architecture

```
┌─────────────────────────────────────────┐
│ Route: /match/[id]                      │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ MatchHeader (sticky top-0)          │ │ 180px
│ │ - League info                       │ │
│ │ - Teams + logos                     │ │
│ │ - Score / Time                      │ │
│ │ - Favorite button                   │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ TabsNavigation (sticky top-[180px]) │ │ 44px
│ │ [Prédictions] [Analyse] [H2H]       │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Content (scrollable)                │ │
│ │                                     │ │
│ │ Tab actif:                          │ │
│ │ - PredictionsTab                    │ │
│ │ - AnalysisTab                       │ │
│ │ - H2HTab                            │ │
│ │                                     │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## Points clés Mobile-First

### Touch Targets
- Boutons: min 44x44px
- Tabs: min-h-[44px]
- Favorite button: 44x44px

### Safe Areas
- Header: padding pour notch iOS
- Content: pb-safe pour home indicator

### Swipe Gestures
- Delta: 100px minimum
- Touch events: passive
- Permet scroll vertical

### Sticky Layout
- Header: z-50, top-0
- Tabs: z-40, top-[180px]
- Content: scrollable normal

## Intégrations existantes

### Zustand Store
```tsx
import { useFavoritesStore } from "@/lib/stores/favorites-store"

const { isFavorite, toggleFavorite } = useFavoritesStore()
```

### HTTP Service
```tsx
import { httpService } from "@/lib/core/services/http-service"

const response = await httpService.get<ApiResponse>('/fixtures/123')
```

### React Query
```tsx
import { useQuery } from "@tanstack/react-query"

const { data, isLoading, isError, refetch } = useQuery({
  queryKey: ['match-detail', id],
  queryFn: async () => { /* ... */ }
})
```

## Tâches pour Agent 2

### 1. PredictionsTab

**Objectif:** Implémenter les 8 types de prédictions avec données réelles.

**Types à implémenter:**
1. `match_result` - Résultat du match (1X2)
2. `both_teams_score` - Les 2 équipes marquent (BTTS)
3. `over_under` - Plus/Moins de buts (O/U)
4. `double_chance` - Double chance (DC)
5. `correct_score` - Score exact
6. `first_goal` - Premier buteur
7. `half_time` - Mi-temps
8. `exact_goals` - Nombre de buts

**À faire:**
- [ ] Créer les composants de carte pour chaque type
- [ ] Fetch des prédictions via API (vérifier endpoint)
- [ ] Afficher les probabilités avec progress bars
- [ ] Afficher les cotes recommandées
- [ ] Ajouter les animations de transition
- [ ] Gérer les loading states
- [ ] Gérer les erreurs

**Hook suggéré:**
```tsx
// Vérifier si existe déjà
import { usePredictions } from "@/lib/hooks/use-predictions"

const { data: predictions } = usePredictions({
  fixtureIds: [match.fixtureId],
  type: selectedType
})
```

### 2. AnalysisTab

**Objectif:** Afficher l'analyse comparative des équipes.

**Sections:**
1. Team Comparison (stats côte à côte)
2. Recent Matches (5 derniers matchs)
3. Detailed Stats (graphiques)

**À faire:**
- [ ] Créer TeamComparisonCard
- [ ] Créer RecentMatchesList
- [ ] Créer DetailedStatsGrid
- [ ] Fetch team stats via API
- [ ] Implémenter les graphiques (recharts déjà installé)
- [ ] Animations d'apparition

**Hook suggéré:**
```tsx
const { data: homeStats } = useTeamStats(match.homeTeam.id)
const { data: awayStats } = useTeamStats(match.awayTeam.id)
const { data: recentMatches } = useRecentMatches({
  homeTeamId: match.homeTeam.id,
  awayTeamId: match.awayTeam.id
})
```

### 3. H2HTab

**Objectif:** Afficher l'historique des confrontations.

**Sections:**
1. Global H2H Stats (victoires/nuls)
2. Previous Matches (liste)
3. Additional Stats (buts, clean sheets, etc.)

**À faire:**
- [ ] Créer H2HStatsCard
- [ ] Créer PreviousMatchesList
- [ ] Créer AdditionalStatsGrid
- [ ] Fetch H2H data via API
- [ ] Formatter les dates (date-fns déjà installé)
- [ ] Afficher les résultats avec badges

**Hook suggéré:**
```tsx
const { data: h2hData } = useH2HStats({
  homeTeamId: match.homeTeam.id,
  awayTeamId: match.awayTeam.id
})
```

## APIs à vérifier

### Endpoints probables
```
GET /fixtures/{id}                    # ✅ Déjà utilisé
GET /predictions/{fixtureId}          # À vérifier
GET /teams/{id}/stats                 # À vérifier
GET /h2h/{homeId}/{awayId}           # À vérifier
```

### Format de réponse API
Vérifier le format exact des réponses API pour:
- Prédictions
- Team stats
- H2H data

## Dépendances utilisées

- ✅ react-swipeable (^7.0.2) - Swipe gestures
- ✅ framer-motion (^12.23.24) - Animations
- ✅ lucide-react (^0.552.0) - Icons
- ✅ date-fns (^4.1.0) - Date formatting
- ✅ recharts (^3.3.0) - Charts (prêt pour graphiques)
- ✅ @tanstack/react-query (^5.90.7) - Data fetching
- ✅ zustand (^5.0.8) - State management

## Tests suggérés

### Test manuel
```bash
pnpm dev
# Naviguer vers http://localhost:3000/match/123456
```

### Points à tester
1. Swipe entre tabs (mobile)
2. Click sur tabs (desktop)
3. Loading states
4. Error states + retry
5. Favorite toggle
6. Auto-refetch pour matchs live
7. Navigation back
8. Safe areas sur iOS

## Notes importantes

### TypeScript
- Tous les fichiers en mode strict
- Interfaces bien typées
- Pas de `any`

### Performance
- Images optimisées avec next/image
- Lazy loading des tabs
- React Query cache
- Animations performantes (GPU)

### Accessibilité
- Touch targets ≥44px
- ARIA labels sur boutons
- Keyboard navigation (tabs)
- Screen reader friendly

### Erreurs connues

Le build Next.js échoue actuellement à cause d'un fichier existant:
```
lib/components/examples/swipeable-tabs-example.tsx
```

Ce fichier a des erreurs TypeScript non liées à notre code. Nos fichiers compilent correctement quand le projet est exécuté via `pnpm dev`.

## Checklist de validation

- [x] TypeScript strict mode
- [x] Mobile-first design
- [x] Touch targets ≥44px
- [x] Safe area insets
- [x] Sticky positioning fonctionnel
- [x] Swipe gestures implémentés
- [x] Loading states avec skeletons
- [x] Error handling avec retry
- [x] Animations Framer Motion
- [x] Intégration favorites store
- [x] React Query cache strategy
- [x] Barrel exports
- [x] Documentation complète

## Questions pour le User

1. **API Predictions**: Quel est l'endpoint exact pour les prédictions ?
2. **API Stats**: Endpoints pour team stats et H2H data ?
3. **Format des données**: Existe-t-il une documentation OpenAPI/Swagger ?
4. **Design system**: Y a-t-il des composants chart déjà créés ?
5. **Priorités**: Quel tab implémenter en premier ?

## Prochaines étapes recommandées

1. Vérifier les endpoints API disponibles
2. Implémenter PredictionsTab (priorité haute)
3. Implémenter AnalysisTab
4. Implémenter H2HTab
5. Tests sur devices réels
6. Optimisations performance si nécessaire

---

**Créé par:** Agent 1 (Structure & Foundation)
**Date:** 2025-11-07
**Pour:** Agent 2 (Content & Data Integration)
