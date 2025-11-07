# Match Detail Components

Composants pour la page de détails d'un match avec navigation à tabs swipeable.

## Structure

```
lib/components/match-detail/
├── match-header.tsx          # Header sticky avec infos du match
├── tabs-navigation.tsx       # Navigation swipeable entre onglets
├── predictions-tab.tsx       # Onglet Prédictions (placeholder)
├── analysis-tab.tsx          # Onglet Analyse (placeholder)
├── h2h-tab.tsx              # Onglet Head-to-Head (placeholder)
├── index.ts                 # Barrel export
└── README.md                # Cette documentation
```

## Composants

### MatchHeader

Header sticky affichant les informations principales du match.

**Props:**
- `match: MatchDetail` - Données du match

**Caractéristiques:**
- Sticky positioning (top-0 z-50)
- Height: 180px
- Touch targets ≥44px pour le bouton favoris
- Safe area insets pour iOS notch
- Animations Framer Motion sur le bouton favoris
- Variants: Pre-match / Live / Finished

**Layout:**
```
┌─────────────────────────────────────┐
│ League badge + nom      ❤️ Favoris  │
│                                     │
│  🏠 Home        ⚽ Score      Away 🏃 │
│  Team Logo     2 - 1      Team Logo │
│  Team Name                Team Name │
│                                     │
│  Venue • Referee                    │
└─────────────────────────────────────┘
```

### TabsNavigation

Navigation à tabs avec swipe gestures et animations.

**Props:**
- `activeTab: TabId` - Tab actuellement actif
- `onTabChange: (tab: TabId) => void` - Callback de changement de tab

**Tabs disponibles:**
- `predictions` - Prédictions
- `analysis` - Analyse
- `h2h` - Head-to-Head

**Caractéristiques:**
- Sticky positioning (top-[180px] z-40)
- Swipeable avec react-swipeable (delta 100px)
- Indicateur animé avec Framer Motion
- Active state: text-navy dark:text-lime + scale-105
- Mobile-first avec full width

**Gestures:**
- Swipe left → Tab suivant
- Swipe right → Tab précédent

### PredictionsTab

Onglet affichant les prédictions du match (placeholder pour Agent 2).

**Props:**
- `match: MatchDetail` - Données du match

**Types de prédictions:**
1. `match_result` - Résultat du match (1X2)
2. `both_teams_score` - Les 2 équipes marquent (BTTS)
3. `over_under` - Plus/Moins de buts (O/U)
4. `double_chance` - Double chance (DC)
5. `correct_score` - Score exact
6. `first_goal` - Premier buteur
7. `half_time` - Mi-temps
8. `exact_goals` - Nombre de buts

**À implémenter par Agent 2:**
- Cartes de prédiction selon le type sélectionné
- Fetch des prédictions via API
- Affichage des probabilités
- Affichage des cotes

### AnalysisTab

Onglet affichant l'analyse du match (placeholder pour Agent 2).

**Props:**
- `match: MatchDetail` - Données du match

**À implémenter par Agent 2:**
- Team comparison (stats comparatives)
- Recent matches (matchs récents)
- Detailed stats (statistiques détaillées)

### H2HTab

Onglet affichant l'historique des confrontations (placeholder pour Agent 2).

**Props:**
- `match: MatchDetail` - Données du match

**À implémenter par Agent 2:**
- Statistiques globales H2H
- Historique des confrontations
- Stats détaillées par équipe

## Utilisation

### Import

```tsx
import {
  MatchHeader,
  TabsNavigation,
  PredictionsTab,
  AnalysisTab,
  H2HTab,
  type TabId,
} from "@/lib/components/match-detail"
```

### Exemple d'utilisation dans une page

```tsx
"use client"

import { useState } from "react"
import { useMatchDetail } from "@/lib/hooks/use-match-detail"
import {
  MatchHeader,
  TabsNavigation,
  PredictionsTab,
  AnalysisTab,
  H2HTab,
  type TabId,
} from "@/lib/components/match-detail"

export default function MatchDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<TabId>("predictions")
  const { data: match, isLoading, isError } = useMatchDetail(params.id)

  if (isLoading) return <LoadingSkeleton />
  if (isError || !match) return <ErrorState />

  return (
    <div className="min-h-screen bg-background">
      <MatchHeader match={match} />
      <TabsNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="px-4 py-6 space-y-6">
        {activeTab === "predictions" && <PredictionsTab match={match} />}
        {activeTab === "analysis" && <AnalysisTab match={match} />}
        {activeTab === "h2h" && <H2HTab match={match} />}
      </div>
    </div>
  )
}
```

## Mobile-First Design

### Touch Targets
- Tous les boutons: ≥44px
- Bouton favoris: 44x44px
- Tabs: min-h-[44px]

### Safe Areas
- Header: padding-top pour iOS notch
- Content: pb-safe pour iOS home indicator

### Animations
- Framer Motion pour les transitions de tabs
- Ripple effect sur le bouton favoris
- Scale animations sur les interactions

### Swipe Gestures
- Delta: 100px minimum
- Prevent scroll on swipe: false (permet scroll vertical)
- Touch event options: passive

## Sticky Layout

La page utilise un système de sticky layers:

```
┌─────────────────────────────────────┐
│ MatchHeader (sticky top-0 z-50)    │ ← 180px height
├─────────────────────────────────────┤
│ TabsNavigation (sticky top-[180px] │ ← Auto height
│ z-40)                               │
├─────────────────────────────────────┤
│                                     │
│ Content (scrollable)                │
│                                     │
│ - PredictionsTab                    │
│ - AnalysisTab                       │
│ - H2HTab                            │
│                                     │
└─────────────────────────────────────┘
```

## TypeScript

Tous les composants sont typés avec TypeScript strict.

### Types principaux

```tsx
// Match detail data
interface MatchDetail {
  id: string
  fixtureId: number
  homeTeam: { id: number; name: string; logo: string }
  awayTeam: { id: number; name: string; logo: string }
  league: { id: number; name: string; logo: string; country: string }
  kickoffTime: Date
  status: "scheduled" | "live" | "finished"
  score?: { home: number; away: number }
  venue?: string
  referee?: string
}

// Tab IDs
type TabId = "predictions" | "analysis" | "h2h"
```

## Points d'attention pour Agent 2

1. **PredictionsTab:**
   - Implémenter les 8 types de prédictions
   - Fetch des données via API
   - Affichage des probabilités et cotes
   - Animations de transition entre types

2. **AnalysisTab:**
   - Team comparison avec graphiques
   - Recent matches avec résultats
   - Detailed stats avec visualisations

3. **H2HTab:**
   - Historique complet des confrontations
   - Stats globales H2H
   - Graphiques de tendances

4. **Intégrations à vérifier:**
   - Hook `usePredictions` existant
   - Services API pour les stats
   - Format des données de l'API

## Dépendances

- `react-swipeable` (^7.0.2) - Swipe gestures
- `framer-motion` (^12.23.24) - Animations
- `lucide-react` (^0.552.0) - Icons
- `next/image` - Optimisation images
- `zustand` - Favorites store
- `@tanstack/react-query` - Data fetching

## Tests

Pour tester les composants:

```bash
# Dev server
pnpm dev

# Navigation vers la page
http://localhost:3000/match/123456
```

## Checklist de validation

- [x] TypeScript strict mode
- [x] Mobile-first design
- [x] Touch targets ≥44px
- [x] Safe area insets
- [x] Sticky positioning
- [x] Swipe gestures
- [x] Loading states
- [x] Error handling
- [x] Animations Framer Motion
- [x] Intégration favorites store
- [x] React Query cache strategy
- [x] Barrel exports
