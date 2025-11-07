# Composants Home - Vue d'ensemble visuelle

## Structure des fichiers

```
betlab-web/
├── lib/
│   ├── components/
│   │   ├── home/                              ← BATCH 6 Agent 1
│   │   │   ├── calendar-widget.tsx           ← 🗓️ Date picker
│   │   │   ├── sport-selector.tsx            ← ⚽ Football/Basketball
│   │   │   ├── leagues-selector.tsx          ← 🏆 Dropdown ligues
│   │   │   ├── predictions-selector.tsx      ← 📊 8 tabs types
│   │   │   ├── filters-panel.tsx             ← 🔧 Filtres avancés
│   │   │   ├── index.ts                      ← 📦 Exports
│   │   │   ├── demo.tsx                      ← 🎨 Démo interactive
│   │   │   ├── README.md                     ← 📖 Documentation
│   │   │   ├── BATCH6_AGENT1_REPORT.md       ← 📋 Rapport final
│   │   │   ├── INTEGRATION_GUIDE.md          ← 🚀 Guide intégration
│   │   │   └── COMPONENTS_OVERVIEW.md        ← 👁️ Ce fichier
│   │   └── ui/
│   │       └── slider.tsx                    ← 🎚️ Slider shadcn
│   ├── stores/
│   │   └── sport-store.ts                    ← 💾 Zustand store
│   └── core/
│       └── enums/
│           └── sport-type.ts                 ← 🏷️ Enums sports
└── app/
    └── globals.css                           ← 🎨 + scrollbar-hide
```

## Hiérarchie des composants

```
HomePage
│
├── CalendarWidget
│   ├── Navigation (chevrons + "Aujourd'hui")
│   └── Days Grid (7 jours scrollables)
│       └── Day Button × 7
│           ├── Day name (Lun, Mar...)
│           ├── Day number (15, 16...)
│           └── Match badge (optionnel)
│
├── SportSelector
│   ├── Football Button (⚽)
│   └── Basketball Button (🏀)
│
├── LeaguesSelector
│   ├── [Mobile] Sheet
│   │   └── League List
│   │       └── League Item × N
│   └── [Desktop] DropdownMenu
│       └── League Item × N
│
├── PredictionsSelector
│   └── Tabs Container (horizontal scroll)
│       └── Tab Button × 8
│           ├── Internal
│           ├── Over 1.5
│           ├── BTTS
│           ├── Exact Score
│           ├── HT/FT
│           ├── Half Compare
│           ├── Clean Sheet
│           └── Corners
│
└── FiltersPanel
    ├── Header (collapsible)
    │   ├── Filter icon
    │   ├── Title
    │   ├── Badge (count)
    │   └── Chevron
    └── Content (if open)
        ├── Confidence Section
        │   └── Chip Button × 3 (High, Med, Low)
        ├── xG Range Section
        │   └── Dual Slider (0-5)
        └── Min Probability Section
            └── Single Slider (0-100%)
```

## Flow de données

```
┌─────────────────────────────────────────────────────────────┐
│                       HomePage (Parent)                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  State Management:                                            │
│  • selectedDate: Date                                         │
│  • selectedLeague: string | "all" | "favorites"              │
│  • selectedPrediction: PredictionType                         │
│  • selectedConfidences: ConfidenceLevel[]                     │
│  • xGRange: [number, number]                                 │
│  • minProbability: number                                    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Props down
                            ▼
    ┌───────────────────────────────────────────────────┐
    │                    Components                      │
    ├───────────────────────────────────────────────────┤
    │                                                     │
    │  CalendarWidget                                    │
    │  ├─ Input: selectedDate, matchCountsByDate        │
    │  └─ Output: onDateChange(date)                    │
    │                                                     │
    │  SportSelector                                     │
    │  ├─ Input: (none - uses Zustand)                  │
    │  └─ Output: (updates store directly)   ──────┐    │
    │                                              │    │
    │  LeaguesSelector                             │    │
    │  ├─ Input: leagues[], selectedLeagueId      │    │
    │  └─ Output: onLeagueChange(id)               │    │
    │                                              │    │
    │  PredictionsSelector                         │    │
    │  ├─ Input: selectedType                      │    │
    │  └─ Output: onTypeChange(type)               │    │
    │                                              │    │
    │  FiltersPanel                                │    │
    │  ├─ Input: selected*, xGRange, minProbability│    │
    │  └─ Output: on*Change(value)                 │    │
    │                                              │    │
    └───────────────────────────────────────────────────┘
                            │                      │
                            │ State up             │ Zustand
                            ▼                      ▼
                    ┌────────────┐        ┌────────────┐
                    │  useState  │        │ useSport   │
                    │   Hooks    │        │   Store    │
                    └────────────┘        └────────────┘
```

## Types exportés

```typescript
// From predictions-selector.tsx
export type PredictionType =
  | "internal"
  | "over15"
  | "btts"
  | "exact"
  | "htft"
  | "half"
  | "cleansheet"
  | "corners"

// From filters-panel.tsx
export type ConfidenceLevel = "high" | "medium" | "low"

// From leagues-selector.tsx
interface League {
  id: string
  name: string
  logo?: string
  matchCount: number
}

// From calendar-widget.tsx
interface CalendarWidgetProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
  matchCountsByDate?: Map<string, number>
}
```

## Style system

```
Colors (BetLab Design System):
├── Primary
│   ├── Navy (#003366)      → bg-navy, text-navy
│   └── Lime (#C8DC3F)      → bg-lime, text-lime
├── Semantic
│   ├── Success (#10B981)   → text-success, bg-success
│   ├── Warning (#F59E0B)   → text-warning, bg-warning
│   └── Error (#EF4444)     → text-error, bg-error
└── Neutral
    ├── Background          → bg-background
    ├── Foreground          → text-foreground
    ├── Muted              → bg-muted, text-muted-foreground
    └── Border             → border

Animations:
├── transition-all         → All properties (150ms)
├── scale-105             → Active state (105%)
└── rotate-180            → Chevron rotation

Spacing:
├── gap-2                 → 8px (between items)
├── gap-4                 → 16px (between sections)
├── p-4                   → 16px padding
└── space-y-6             → 24px vertical spacing

Responsive:
├── Base                  → Mobile (< 1024px)
└── lg:                   → Desktop (≥ 1024px)

Touch Targets:
└── min-h-[44px]          → iOS/Android guidelines
```

## Scroll patterns

```css
/* Horizontal Scroll with Snap */
.container {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -ms-overflow-style: none;  /* IE/Edge */
  scrollbar-width: none;      /* Firefox */
}

.container::-webkit-scrollbar {
  display: none;              /* Chrome/Safari */
}

.item {
  flex-shrink: 0;
  scroll-snap-align: center;
}
```

Utilisé dans:
- CalendarWidget (days)
- PredictionsSelector (tabs)

## Accessibility features

```
ARIA Attributes:
├── aria-label             → Screen reader text
├── aria-pressed           → Toggle button state
├── aria-expanded          → Collapsible state
└── aria-controls          → Panel relationship

HTML Semantics:
├── <button>               → Interactive elements
├── <label>                → Form labels
└── Heading hierarchy      → h1 → h2 → h3

Keyboard:
├── Tab navigation         → All focusable
├── Enter/Space            → Button activation
└── Focus visible          → ring-offset-background

Touch:
└── min-h-[44px]          → 44×44px minimum
```

## Performance optimization

```
Code Splitting:
├── "use client"          → Client components only
└── Tree shaking          → Imports optimized

Memoization opportunities:
├── useMemo               → Filtered lists
├── useCallback           → Event handlers
└── React.memo            → Static components

Bundle size:
├── CalendarWidget        → ~3KB
├── SportSelector         → ~1KB
├── LeaguesSelector       → ~4KB
├── PredictionsSelector   → ~2KB
└── FiltersPanel          → ~4KB
Total:                     → ~14KB (gzipped: ~4KB)
```

## Browser support

```
✅ Chrome 90+
✅ Firefox 88+
✅ Safari 14+
✅ Edge 90+
✅ iOS Safari 14+
✅ Chrome Android 90+

Features utilisées:
├── CSS Grid/Flexbox      → 99%+ support
├── CSS Variables         → 99%+ support
├── ES2020                → 97%+ support
├── Scroll Snap           → 96%+ support
└── date-fns              → Universal (polyfills)
```

## Testing coverage

```
Unit Tests (suggérés):
├── CalendarWidget
│   ├── Renders 7 days
│   ├── Highlights selected date
│   ├── Navigates weeks
│   └── Displays match counts
├── SportSelector
│   ├── Renders both sports
│   ├── Updates Zustand store
│   └── Shows active state
├── LeaguesSelector
│   ├── Renders league list
│   ├── Filters by selection
│   └── Shows mobile/desktop UI
├── PredictionsSelector
│   ├── Renders all 8 types
│   ├── Changes selection
│   └── Scrolls horizontally
└── FiltersPanel
    ├── Toggles collapse
    ├── Multi-selects confidence
    ├── Updates xG range
    └── Updates probability

Integration Tests:
├── Full filtering flow
├── State persistence
└── URL params sync
```

## Mobile gestures

```
Swipe Gestures:
├── Horizontal scroll     → CalendarWidget, PredictionsSelector
├── Vertical scroll       → LeaguesSelector (Sheet)
└── Pull to dismiss       → LeaguesSelector (Sheet)

Tap Targets:
├── 44×44px minimum       → All buttons
├── 16px padding          → Touch area
└── No overlaps           → Clear separation

Feedback:
├── Scale transform       → Active state (105%)
├── Background change     → Hover/pressed
└── Smooth transitions    → 150ms
```

## Dark mode mapping

```
Light Mode                Dark Mode
├── bg-background         → hsl(222.2 84% 4.9%)
├── bg-muted              → hsl(217.2 32.6% 17.5%)
├── bg-lime               → #C8DC3F (unchanged)
├── bg-navy               → #003366 (unchanged)
├── text-foreground       → hsl(210 40% 98%)
└── border                → hsl(217.2 32.6% 17.5%)

Auto-handled by Tailwind classes!
No manual dark: variants needed.
```

## Quick reference

### Import
```tsx
import { ... } from "@/lib/components/home"
```

### Usage
```tsx
<CalendarWidget selectedDate={date} onDateChange={setDate} matchCountsByDate={counts} />
<SportSelector />
<LeaguesSelector leagues={leagues} selectedLeagueId={id} onLeagueChange={setId} />
<PredictionsSelector selectedType={type} onTypeChange={setType} />
<FiltersPanel ... />
```

### Zustand
```tsx
const { activeSport, setActiveSport } = useSportStore()
```

### Styling
```tsx
className="space-y-4 p-4"  // Container
```

---

**Documentation complète dans:**
- `README.md` - Guide détaillé
- `INTEGRATION_GUIDE.md` - Exemples d'intégration
- `BATCH6_AGENT1_REPORT.md` - Rapport technique
- `demo.tsx` - Code de démonstration
