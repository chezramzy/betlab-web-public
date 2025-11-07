"use client"

/**
 * Fichier de démonstration pour les composants BATCH 6 Agent 1
 * Ce fichier montre l'utilisation de tous les composants de sélection/filtrage
 */

import { useState } from "react"
import { CalendarWidget } from "./calendar-widget"
import { SportSelector } from "./sport-selector"
import { LeaguesSelector } from "./leagues-selector"
import { PredictionsSelector, PredictionType } from "./predictions-selector"
import { FiltersPanel, ConfidenceLevel } from "./filters-panel"

export function HomeFiltersDemo() {
  // State management
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedLeague, setSelectedLeague] = useState<string | "all" | "favorites">("all")
  const [selectedPrediction, setSelectedPrediction] = useState<PredictionType>("internal")
  const [selectedConfidences, setSelectedConfidences] = useState<ConfidenceLevel[]>(["high", "medium"])
  const [xGRange, setXGRange] = useState<[number, number]>([0, 5])
  const [minProbability, setMinProbability] = useState(50)

  // Mock data
  const matchCountsByDate = new Map<string, number>([
    ["2025-11-07", 15],
    ["2025-11-08", 12],
    ["2025-11-09", 18],
    ["2025-11-10", 20],
  ])

  const mockLeagues = [
    { id: "1", name: "Premier League", matchCount: 10 },
    { id: "2", name: "La Liga", matchCount: 8 },
    { id: "3", name: "Serie A", matchCount: 7 },
    { id: "4", name: "Bundesliga", matchCount: 9 },
  ]

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-6">BATCH 6 - Composants de Filtrage Home</h1>

      {/* Calendar Widget */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">1. Calendar Widget</h2>
        <CalendarWidget
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          matchCountsByDate={matchCountsByDate}
        />
        <p className="text-sm text-muted-foreground">
          Date sélectionnée: {selectedDate.toLocaleDateString("fr-FR")}
        </p>
      </section>

      {/* Sport Selector */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">2. Sport Selector</h2>
        <SportSelector />
        <p className="text-sm text-muted-foreground">
          Intégré avec useSportStore (Zustand)
        </p>
      </section>

      {/* Leagues Selector */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">3. Leagues Selector</h2>
        <LeaguesSelector
          leagues={mockLeagues}
          selectedLeagueId={selectedLeague}
          onLeagueChange={setSelectedLeague}
        />
        <p className="text-sm text-muted-foreground">
          Ligue sélectionnée: {selectedLeague}
        </p>
      </section>

      {/* Predictions Selector */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">4. Predictions Selector</h2>
        <PredictionsSelector
          selectedType={selectedPrediction}
          onTypeChange={setSelectedPrediction}
        />
        <p className="text-sm text-muted-foreground">
          Type de prédiction: {selectedPrediction}
        </p>
      </section>

      {/* Filters Panel */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">5. Filters Panel</h2>
        <FiltersPanel
          selectedConfidences={selectedConfidences}
          onConfidencesChange={setSelectedConfidences}
          xGRange={xGRange}
          onXGRangeChange={setXGRange}
          minProbability={minProbability}
          onMinProbabilityChange={setMinProbability}
        />
        <p className="text-sm text-muted-foreground">
          Filtres actifs: {selectedConfidences.join(", ")} | xG: {xGRange[0]}-{xGRange[1]} | Proba: {minProbability}%
        </p>
      </section>
    </div>
  )
}
