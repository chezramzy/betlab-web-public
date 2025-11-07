"use client"

/**
 * MatchListDemo - Démo interactive des composants d'affichage de matchs
 *
 * Démontre l'utilisation de:
 * - MatchList avec grouping par créneaux
 * - MatchCardCompact avec swipe actions
 * - PredictionDisplay avec différents types
 * - Loading states avec skeletons
 * - Empty states
 *
 * Usage: Importez ce composant dans une page pour tester
 */

import * as React from "react"
import { MatchList } from "./match-list"
import { type Match } from "./match-card-compact"
import { type Prediction } from "./prediction-display"

export function MatchListDemo() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [favorites, setFavorites] = React.useState<Set<string>>(new Set())

  // Données de démo
  const mockMatches: Match[] = [
    {
      id: "1",
      homeTeam: {
        name: "Paris Saint-Germain",
        logo: "https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg",
      },
      awayTeam: {
        name: "Olympique Marseille",
        logo: "https://upload.wikimedia.org/wikipedia/commons/d/d8/Olympique_Marseille_logo.svg",
      },
      league: {
        name: "Ligue 1",
        logo: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Ligue1.svg",
      },
      kickoffTime: new Date(2025, 10, 7, 9, 0), // Matin
      status: "scheduled",
      prediction: {
        type: "over15",
        confidence: "high",
        value: "Over 1.5",
        probability: 85,
        edge: 12.3,
      } as Prediction,
      isFavorite: false,
    },
    {
      id: "2",
      homeTeam: {
        name: "Manchester City",
        logo: "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg",
      },
      awayTeam: {
        name: "Liverpool",
        logo: "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg",
      },
      league: {
        name: "Premier League",
        logo: "https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg",
      },
      kickoffTime: new Date(2025, 10, 7, 13, 30), // Après-midi
      status: "live",
      prediction: {
        type: "btts",
        confidence: "high",
        value: "BTTS Yes",
        probability: 78,
        edge: 8.5,
      } as Prediction,
      isFavorite: false,
    },
    {
      id: "3",
      homeTeam: {
        name: "Real Madrid",
        logo: "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg",
      },
      awayTeam: {
        name: "Barcelona",
        logo: "https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg",
      },
      league: {
        name: "La Liga",
        logo: "https://upload.wikimedia.org/wikipedia/commons/1/13/LaLiga.svg",
      },
      kickoffTime: new Date(2025, 10, 7, 20, 0), // Soirée
      status: "scheduled",
      prediction: {
        type: "exact",
        confidence: "medium",
        value: "2-1",
        probability: 22,
        edge: 3.2,
        details: {
          topScores: ["2-1", "1-1", "2-0"],
        },
      } as Prediction,
      isFavorite: false,
    },
    {
      id: "4",
      homeTeam: {
        name: "Bayern Munich",
        logo: "https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg",
      },
      awayTeam: {
        name: "Borussia Dortmund",
        logo: "https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg",
      },
      league: {
        name: "Bundesliga",
        logo: "https://upload.wikimedia.org/wikipedia/en/d/df/Bundesliga_logo_%282017%29.svg",
      },
      kickoffTime: new Date(2025, 10, 7, 23, 30), // Nuit
      status: "scheduled",
      prediction: {
        type: "htft",
        confidence: "medium",
        value: "1-1",
        probability: 45,
        edge: 5.7,
      } as Prediction,
      isFavorite: false,
    },
  ]

  const [matches, setMatches] = React.useState<Match[]>(mockMatches)

  // Handlers
  const handleMatchClick = (matchId: string) => {
    console.log("Match clicked:", matchId)
    // Dans une vraie app: router.push(`/matches/${matchId}`)
  }

  const handleFavoriteToggle = (matchId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(matchId)) {
        newFavorites.delete(matchId)
      } else {
        newFavorites.add(matchId)
      }
      return newFavorites
    })

    // Update match favorite status
    setMatches((prev) =>
      prev.map((match) =>
        match.id === matchId
          ? { ...match, isFavorite: !match.isFavorite }
          : match
      )
    )
  }

  // Toggle loading pour démo
  const toggleLoading = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Match List Demo</h1>
        <p className="text-sm text-muted-foreground">
          Démo des composants d'affichage de matchs (BATCH 6 Agent 2)
        </p>
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <button
          onClick={toggleLoading}
          className="px-4 py-2 bg-[var(--lime)] text-[var(--navy)] rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          Toggle Loading
        </button>
        <button
          onClick={() => setMatches([])}
          className="px-4 py-2 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors"
        >
          Clear Matches
        </button>
        <button
          onClick={() => setMatches(mockMatches)}
          className="px-4 py-2 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors"
        >
          Reset Matches
        </button>
      </div>

      {/* Match List */}
      <MatchList
        matches={matches}
        isLoading={isLoading}
        onMatchClick={handleMatchClick}
        onFavoriteToggle={handleFavoriteToggle}
        emptyMessage="Aucun match trouvé. Utilisez le bouton 'Reset Matches' pour charger les données de démo."
      />

      {/* Infos */}
      <div className="p-4 rounded-lg bg-muted/50 space-y-2">
        <h3 className="font-semibold text-sm">Features testées:</h3>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>✓ Grouping par créneau horaire (Matin/Après-midi/Soir/Nuit)</li>
          <li>✓ Swipe left sur les cards pour toggle favorite</li>
          <li>✓ Ripple effect au tap</li>
          <li>✓ Live badge pour matchs en cours</li>
          <li>✓ Affichage de différents types de prédictions</li>
          <li>✓ Loading skeletons</li>
          <li>✓ Empty state</li>
          <li>✓ Collapse/expand sections</li>
        </ul>
        <p className="text-xs text-muted-foreground mt-2">
          Favoris actifs: {favorites.size}
        </p>
      </div>
    </div>
  )
}
