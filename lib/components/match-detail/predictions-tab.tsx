"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Loader2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { MatchDetail } from "@/lib/hooks/use-match-detail"
import { usePredictions } from "@/lib/hooks/use-predictions"
import {
  MatchResultCard,
  BTTSCard,
  OverUnderCard,
  CorrectScoreCard,
  HalfTimeCard,
  DoubleChanceCard,
  CornersCard,
  FirstGoalCard,
} from "./prediction-cards"

interface PredictionsTabProps {
  match: MatchDetail
}

type PredictionType =
  | "match_result"
  | "both_teams_score"
  | "over_under"
  | "double_chance"
  | "correct_score"
  | "first_goal"
  | "half_time"
  | "corners"

interface PredictionTypeInfo {
  id: PredictionType
  label: string
  shortLabel: string
}

const predictionTypes: PredictionTypeInfo[] = [
  { id: "match_result", label: "Résultat du match", shortLabel: "1X2" },
  { id: "both_teams_score", label: "Les 2 équipes marquent", shortLabel: "BTTS" },
  { id: "over_under", label: "Plus/Moins de buts", shortLabel: "O/U" },
  { id: "double_chance", label: "Double chance", shortLabel: "DC" },
  { id: "correct_score", label: "Score exact", shortLabel: "Score" },
  { id: "first_goal", label: "Premier buteur", shortLabel: "1er but" },
  { id: "half_time", label: "Mi-temps", shortLabel: "HT" },
  { id: "corners", label: "Corners", shortLabel: "Corners" },
]

/**
 * Onglet Prédictions
 * Affiche un sélecteur de type de prédiction et la card correspondante
 */
export function PredictionsTab({ match }: PredictionsTabProps) {
  const [selectedType, setSelectedType] = useState<PredictionType>("match_result")

  const { data: predictions, isLoading, isError, error } = usePredictions({
    fixtureIds: [match.fixtureId],
    type: selectedType,
  })

  const prediction = predictions?.[0]

  return (
    <div className="space-y-6">
      {/* Type Selector - Horizontal scrollable tabs */}
      <div className="relative -mx-4 px-4 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 pb-2">
          {predictionTypes.map((type) => {
            const isActive = selectedType === type.id

            return (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={cn(
                  // Layout & sizing
                  "flex-shrink-0 px-4 py-2 rounded-lg",
                  "min-h-[44px] flex items-center justify-center",
                  // Typography
                  "text-sm font-medium whitespace-nowrap",
                  // Transitions
                  "transition-all duration-200",
                  // Active state
                  isActive
                    ? "bg-navy dark:bg-lime text-white dark:text-navy shadow-md scale-105"
                    : "bg-gray-100 dark:bg-gray-800 text-muted-foreground hover:bg-gray-200 dark:hover:bg-gray-700"
                )}
              >
                {type.shortLabel}
              </button>
            )
          })}
        </div>
      </div>

      {/* Prediction Content */}
      <motion.div
        key={selectedType}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Loading State */}
        {isLoading && <PredictionCardSkeleton />}

        {/* Error State */}
        {isError && (
          <div className="bg-card border rounded-lg p-6">
            <div className="flex flex-col items-center gap-4 text-center py-8">
              <AlertCircle className="w-12 h-12 text-destructive" />
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Impossible de charger la prédiction
                </h3>
                <p className="text-sm text-muted-foreground">
                  {error instanceof Error
                    ? error.message
                    : "Une erreur s'est produite lors du chargement"}
                </p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="min-h-[44px] px-6 py-2 bg-navy dark:bg-lime text-white dark:text-navy rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Réessayer
              </button>
            </div>
          </div>
        )}

        {/* Prediction Cards */}
        {!isLoading && !isError && prediction && (
          <>
            {selectedType === "match_result" && (
              <MatchResultCard prediction={prediction as any} match={match} />
            )}
            {selectedType === "both_teams_score" && (
              <BTTSCard prediction={prediction as any} match={match} />
            )}
            {selectedType === "over_under" && (
              <OverUnderCard prediction={prediction as any} match={match} />
            )}
            {selectedType === "correct_score" && (
              <CorrectScoreCard prediction={prediction as any} match={match} />
            )}
            {selectedType === "half_time" && (
              <HalfTimeCard prediction={prediction as any} match={match} />
            )}
            {selectedType === "double_chance" && (
              <DoubleChanceCard prediction={prediction as any} match={match} />
            )}
            {selectedType === "corners" && (
              <CornersCard prediction={prediction as any} match={match} />
            )}
            {selectedType === "first_goal" && (
              <FirstGoalCard prediction={prediction as any} match={match} />
            )}
          </>
        )}

        {/* No Data State */}
        {!isLoading && !isError && !prediction && (
          <div className="bg-card border rounded-lg p-6">
            <div className="text-center space-y-4 py-8">
              <h3 className="text-lg font-semibold">
                Aucune prédiction disponible
              </h3>
              <p className="text-sm text-muted-foreground">
                Les prédictions pour ce type ne sont pas encore disponibles
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

/**
 * Skeleton de chargement pour les cards de prédiction
 */
function PredictionCardSkeleton() {
  return (
    <div className="bg-card border rounded-lg p-6 animate-pulse">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-muted rounded" />
            <div className="h-6 w-40 bg-muted rounded" />
          </div>
          <div className="h-7 w-24 bg-muted rounded-full" />
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="h-4 w-3/4 bg-muted rounded" />
            <div className="h-3 w-full bg-muted rounded-full" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-2/3 bg-muted rounded" />
            <div className="h-3 w-full bg-muted rounded-full" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-3/4 bg-muted rounded" />
            <div className="h-3 w-full bg-muted rounded-full" />
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t">
          <div className="h-12 w-full bg-muted rounded-lg" />
        </div>
      </div>
    </div>
  )
}
