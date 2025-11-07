# Guide d'intégration - Composants Home BATCH 6

## Quick Start

### Import unique
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

### Usage basique dans une page

```tsx
"use client"

import { useState } from "react"
import {
  CalendarWidget,
  SportSelector,
  LeaguesSelector,
  PredictionsSelector,
  PredictionType,
  FiltersPanel,
  ConfidenceLevel,
} from "@/lib/components/home"

export default function HomePage() {
  // State management
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedLeague, setSelectedLeague] = useState<string | "all" | "favorites">("all")
  const [selectedPrediction, setSelectedPrediction] = useState<PredictionType>("internal")
  const [selectedConfidences, setSelectedConfidences] = useState<ConfidenceLevel[]>(["high"])
  const [xGRange, setXGRange] = useState<[number, number]>([0, 5])
  const [minProbability, setMinProbability] = useState(50)

  // Fetch your data here
  const matchCountsByDate = new Map() // Map<string, number>
  const leagues = [] // Array<{id, name, matchCount, logo?}>

  return (
    <div className="space-y-4 p-4">
      {/* Date Selection */}
      <CalendarWidget
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        matchCountsByDate={matchCountsByDate}
      />

      {/* Sport Toggle */}
      <SportSelector />

      {/* Leagues Dropdown */}
      <LeaguesSelector
        leagues={leagues}
        selectedLeagueId={selectedLeague}
        onLeagueChange={setSelectedLeague}
      />

      {/* Prediction Types */}
      <PredictionsSelector
        selectedType={selectedPrediction}
        onTypeChange={setSelectedPrediction}
      />

      {/* Filters */}
      <FiltersPanel
        selectedConfidences={selectedConfidences}
        onConfidencesChange={setSelectedConfidences}
        xGRange={xGRange}
        onXGRangeChange={setXGRange}
        minProbability={minProbability}
        onMinProbabilityChange={setMinProbability}
      />

      {/* Vos Match Cards ici (Agent 2) */}
    </div>
  )
}
```

## Connexion avec les données réelles

### CalendarWidget - Match Counts

```tsx
// Exemple: Compter les matchs par date depuis votre API
const matches = await fetchMatches()
const matchCountsByDate = new Map<string, number>()

matches.forEach(match => {
  const dateKey = format(new Date(match.date), "yyyy-MM-dd")
  matchCountsByDate.set(dateKey, (matchCountsByDate.get(dateKey) || 0) + 1)
})

<CalendarWidget
  selectedDate={selectedDate}
  onDateChange={setSelectedDate}
  matchCountsByDate={matchCountsByDate}
/>
```

### LeaguesSelector - Extraction dynamique

```tsx
// Exemple: Extraire les ligues depuis vos matchs
const leagues = Array.from(
  new Map(
    matches.map(m => [
      m.league.id,
      {
        id: m.league.id,
        name: m.league.name,
        logo: m.league.logo,
        matchCount: matches.filter(x => x.league.id === m.league.id).length
      }
    ])
  ).values()
)

<LeaguesSelector
  leagues={leagues}
  selectedLeagueId={selectedLeague}
  onLeagueChange={setSelectedLeague}
/>
```

### SportSelector - Zustand

Le SportSelector est automatiquement connecté au store Zustand.
Pas besoin de props!

```tsx
// Dans n'importe quel composant
import { useSportStore } from "@/lib/stores/sport-store"

const { activeSport } = useSportStore()

// Filtrer les matchs par sport
const filteredMatches = matches.filter(m => m.sport === activeSport)
```

## Filtrage combiné

```tsx
// Exemple: Appliquer tous les filtres
const filteredMatches = useMemo(() => {
  return matches.filter(match => {
    // Date
    if (!isSameDay(new Date(match.date), selectedDate)) return false

    // Sport (depuis Zustand)
    if (match.sport !== activeSport) return false

    // League
    if (selectedLeague !== "all" && match.league.id !== selectedLeague) return false

    // Prediction type
    const prediction = match.predictions[selectedPrediction]
    if (!prediction) return false

    // Confidence
    if (selectedConfidences.length > 0 &&
        !selectedConfidences.includes(prediction.confidence)) return false

    // xG Range (pour type "internal")
    if (selectedPrediction === "internal") {
      const xg = prediction.xG || 0
      if (xg < xGRange[0] || xg > xGRange[1]) return false
    }

    // Min Probability
    if (prediction.probability < minProbability) return false

    return true
  })
}, [
  matches,
  selectedDate,
  activeSport,
  selectedLeague,
  selectedPrediction,
  selectedConfidences,
  xGRange,
  minProbability
])
```

## Optimisation avec React Query

```tsx
import { useQuery } from "@tanstack/react-query"

function HomePage() {
  const { activeSport } = useSportStore()

  // Query avec cache et refetch automatique
  const { data: matches, isLoading } = useQuery({
    queryKey: ["matches", selectedDate, activeSport, selectedLeague],
    queryFn: () => fetchMatches({
      date: selectedDate,
      sport: activeSport,
      league: selectedLeague === "all" ? undefined : selectedLeague,
    }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  if (isLoading) return <LoadingSpinner />

  return (
    <div>
      <CalendarWidget {...} />
      {/* ... autres composants */}
      <MatchList matches={filteredMatches} />
    </div>
  )
}
```

## Persistence avec URL Search Params

```tsx
import { useSearchParams, useRouter } from "next/navigation"

function HomePage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Initialiser depuis URL
  const [selectedPrediction, setSelectedPrediction] = useState<PredictionType>(
    (searchParams.get("type") as PredictionType) || "internal"
  )

  // Mettre à jour URL
  const handlePredictionChange = (type: PredictionType) => {
    setSelectedPrediction(type)

    const params = new URLSearchParams(searchParams.toString())
    params.set("type", type)
    router.push(`?${params.toString()}`)
  }

  return (
    <PredictionsSelector
      selectedType={selectedPrediction}
      onTypeChange={handlePredictionChange}
    />
  )
}
```

## Composants mobiles vs desktop

Tous les composants sont responsive par défaut:

- **CalendarWidget**: Toujours horizontal scroll
- **SportSelector**: Toujours pills
- **LeaguesSelector**:
  - Mobile (< 1024px): Bottom Sheet
  - Desktop (≥ 1024px): Dropdown Menu
- **PredictionsSelector**: Toujours horizontal scroll
- **FiltersPanel**: Collapsible sur toutes tailles

Pas de logique conditionnelle nécessaire!

## Dark Mode

Tous les composants supportent le dark mode automatiquement via Tailwind:

```tsx
// globals.css définit déjà les variables
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  // ...
}
```

Utiliser `next-themes`:

```tsx
import { ThemeProvider } from "next-themes"

<ThemeProvider attribute="class" defaultTheme="system">
  <HomePage />
</ThemeProvider>
```

## Animations personnalisées

Pour ajouter des animations supplémentaires:

```tsx
import { motion } from "framer-motion"

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  <CalendarWidget {...} />
</motion.div>
```

## Tests

### Test unitaire exemple (Jest/Vitest)

```tsx
import { render, screen, fireEvent } from "@testing-library/react"
import { SportSelector } from "@/lib/components/home"

describe("SportSelector", () => {
  it("should toggle between sports", () => {
    render(<SportSelector />)

    const footballButton = screen.getByText("Football")
    const basketballButton = screen.getByText("Basketball")

    fireEvent.click(basketballButton)

    expect(basketballButton).toHaveAttribute("aria-pressed", "true")
    expect(footballButton).toHaveAttribute("aria-pressed", "false")
  })
})
```

## Troubleshooting

### Problème: Scrollbar visible malgré scrollbar-hide

**Solution:** Vérifier que `app/globals.css` contient:

```css
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
```

### Problème: Slider ne bouge pas

**Solution:** Vérifier que vous utilisez bien le dual-value pour range:

```tsx
// ✅ Correct
<Slider value={[min, max]} onValueChange={(v) => setRange(v as [number, number])} />

// ❌ Incorrect
<Slider value={min} onValueChange={setMin} />
```

### Problème: Date formatting incorrect

**Solution:** Importer la locale française:

```tsx
import { fr } from "date-fns/locale"

format(date, "EEE", { locale: fr }) // ✅ "Lun"
format(date, "EEE") // ❌ "Mon"
```

## Support

Pour toute question sur ces composants:
- Voir `README.md` pour la documentation complète
- Voir `demo.tsx` pour des exemples d'utilisation
- Voir `BATCH6_AGENT1_REPORT.md` pour le rapport technique

---

**Prêt pour les Agents 2 et 3!**
