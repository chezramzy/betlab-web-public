# Home Page Components - BATCH 6 Agent 1

Composants de sélection et filtrage pour la page Home du projet BetLab.

## Composants créés

### 1. CalendarWidget
**Fichier:** `calendar-widget.tsx`

Date picker mobile avec swipe horizontal.

**Features:**
- ✅ Affiche 7 jours (aujourd'hui ± 3 jours)
- ✅ Swipe horizontal entre jours avec snap scroll
- ✅ Jour actif: bg-lime, text-navy
- ✅ Affiche nombre de matchs par jour (badge)
- ✅ Bouton "Aujourd'hui" pour revenir à la date courante
- ✅ Format: "Lun 15" (jour abrégé + numéro)
- ✅ Responsive et mobile-first
- ✅ Dark mode support

**Usage:**
```tsx
import { CalendarWidget } from "@/lib/components/home"

const matchCounts = new Map([
  ["2025-11-07", 15],
  ["2025-11-08", 12],
])

<CalendarWidget
  selectedDate={selectedDate}
  onDateChange={setSelectedDate}
  matchCountsByDate={matchCounts}
/>
```

### 2. SportSelector
**Fichier:** `sport-selector.tsx`

Toggle Football/Basketball avec intégration Zustand.

**Features:**
- ✅ 2 pills: ⚽ Football / 🏀 Basketball
- ✅ Pills design mobile avec emojis
- ✅ Active state animé (scale + bg-lime)
- ✅ Intégration avec useSportStore (Zustand)
- ✅ Accessibility (aria-labels, min-height 44px)

**Usage:**
```tsx
import { SportSelector } from "@/lib/components/home"

<SportSelector />
// State automatiquement géré via useSportStore
```

### 3. LeaguesSelector
**Fichier:** `leagues-selector.tsx`

Dropdown/BottomSheet ligues avec mode mobile/desktop.

**Features:**
- ✅ Mobile: bottom sheet (Sheet de shadcn)
- ✅ Desktop: dropdown menu
- ✅ Options: "Toutes", "Favoris", puis liste des ligues
- ✅ Compteur matchs par ligue
- ✅ Support logo ligue (optionnel)
- ✅ Responsive avec breakpoints

**Usage:**
```tsx
import { LeaguesSelector } from "@/lib/components/home"

const leagues = [
  { id: "1", name: "Premier League", matchCount: 10, logo: "/logo.png" },
  { id: "2", name: "La Liga", matchCount: 8 },
]

<LeaguesSelector
  leagues={leagues}
  selectedLeagueId={selectedLeagueId}
  onLeagueChange={setSelectedLeagueId}
/>
```

### 4. PredictionsSelector
**Fichier:** `predictions-selector.tsx`

Tabs horizontales scrollables pour 8 types de prédictions.

**Features:**
- ✅ 8 tabs: Internal, Over 1.5, BTTS, Exact Score, HT/FT, Half Compare, Clean Sheet, Corners
- ✅ Horizontal scroll avec snap
- ✅ Active state navy avec design moderne
- ✅ Gradient fade pour indiquer scroll
- ✅ Touch-friendly (44px min-height)

**Usage:**
```tsx
import { PredictionsSelector, PredictionType } from "@/lib/components/home"

<PredictionsSelector
  selectedType={selectedType}
  onTypeChange={setSelectedType}
/>
```

**Types disponibles:**
- `"internal"` - Prédictions internes
- `"over15"` - Plus de 1.5 buts
- `"btts"` - Both Teams To Score
- `"exact"` - Score exact
- `"htft"` - Half Time / Full Time
- `"half"` - Comparaison mi-temps
- `"cleansheet"` - Feuille blanche
- `"corners"` - Corners

### 5. FiltersPanel
**Fichier:** `filters-panel.tsx`

Panel de filtres collapsible avec confidence chips et sliders.

**Features:**
- ✅ Collapsible (accordion style)
- ✅ Section Confidence: chips High/Med/Low (multi-select)
- ✅ Section xG: slider range 0-5
- ✅ Section Probabilité: slider 0-100%
- ✅ Badge compteur de filtres actifs
- ✅ Animations smooth

**Usage:**
```tsx
import { FiltersPanel, ConfidenceLevel } from "@/lib/components/home"

<FiltersPanel
  selectedConfidences={selectedConfidences}
  onConfidencesChange={setSelectedConfidences}
  xGRange={xGRange}
  onXGRangeChange={setXGRange}
  minProbability={minProbability}
  onMinProbabilityChange={setMinProbability}
/>
```

## Dépendances installées

```bash
pnpm add @radix-ui/react-slider
```

Dépendances déjà présentes:
- `date-fns` (avec locale fr)
- `@radix-ui/react-dialog` (Sheet)
- `@radix-ui/react-dropdown-menu`
- `zustand` (pour SportStore)

## CSS personnalisé ajouté

Ajout de la classe `.scrollbar-hide` dans `app/globals.css`:

```css
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
```

## Mobile-first specs

Tous les composants respectent:
- ✅ Touch targets ≥ 44px
- ✅ Swipe gestures avec snap scroll
- ✅ Animations smooth (transition-all)
- ✅ Dark mode support
- ✅ Safe area aware
- ✅ Responsive breakpoints (lg:)

## Export centralisé

```tsx
// Import depuis un seul fichier
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

## Démonstration

Voir `demo.tsx` pour un exemple complet d'utilisation de tous les composants.

## Intégration avec les stores

- **SportSelector**: Intégré automatiquement avec `useSportStore` (Zustand)
- **Autres composants**: State management via props (pattern contrôlé)

## Next steps (Agents 2 et 3)

Ces composants sont prêts à être intégrés dans:
- Agent 2: Match Cards & Lists
- Agent 3: Page Home finale avec intégration complète
