"use client"

import { Grid3x3 } from "lucide-react"
import { Badge } from "@/lib/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/lib/components/ui/card"
import { cn } from "@/lib/utils"
import type { MatchDetail } from "@/lib/hooks/use-match-detail"

interface CorrectScorePrediction {
  type: "correct_score"
  topScores: Array<{
    home: number
    away: number
    probability: number
    odds?: number
  }>
  scoreMatrix: number[][]
  confidence: "high" | "medium" | "low"
}

interface CorrectScoreCardProps {
  prediction: CorrectScorePrediction
  match: MatchDetail
}

const confidenceVariants = {
  high: { variant: "success" as const, label: "Confiance élevée" },
  medium: { variant: "warning" as const, label: "Confiance moyenne" },
  low: { variant: "error" as const, label: "Confiance faible" },
}

/**
 * Card de prédiction Score exact
 * Affiche les scores les plus probables et une matrice interactive
 */
export function CorrectScoreCard({ prediction, match }: CorrectScoreCardProps) {
  const { topScores, scoreMatrix, confidence } = prediction
  const confidenceConfig = confidenceVariants[confidence]

  // Trouver la probabilité maximale pour la heatmap
  const maxProbability = Math.max(...scoreMatrix.flat())

  // Fonction pour obtenir la couleur basée sur la probabilité
  const getHeatmapColor = (probability: number) => {
    const intensity = probability / maxProbability
    if (intensity > 0.8) return "bg-lime/80 text-white border-lime"
    if (intensity > 0.6) return "bg-lime/60 text-white border-lime/60"
    if (intensity > 0.4) return "bg-lime/40 text-navy dark:text-white border-lime/40"
    if (intensity > 0.2) return "bg-lime/20 text-navy dark:text-white border-lime/20"
    return "bg-muted text-muted-foreground border-border"
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Grid3x3 className="w-5 h-5 text-navy dark:text-lime" />
            <h3 className="text-lg font-semibold">Score exact</h3>
          </div>
          <Badge variant={confidenceConfig.variant}>
            {confidenceConfig.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Top 5 Scores */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-muted-foreground">
            Scores les plus probables
          </h4>

          <div className="space-y-2">
            {topScores.slice(0, 5).map((score, index) => {
              const isTopPick = index === 0
              return (
                <div
                  key={`${score.home}-${score.away}`}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border-2 transition-all",
                    isTopPick
                      ? "border-lime bg-lime/10 dark:bg-lime/5"
                      : "border-border bg-card hover:bg-muted/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
                        isTopPick
                          ? "bg-lime text-navy"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {index + 1}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">
                        {score.home} - {score.away}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-navy dark:text-lime">
                      {score.probability}%
                    </span>
                    {score.odds && (
                      <span className="text-xs text-muted-foreground">
                        Cote: {score.odds.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Score Matrix (Heatmap) */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-muted-foreground">
            Grille des scores
          </h4>

          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              {/* Header - Away Goals */}
              <div className="flex items-center mb-1">
                <div className="w-10 h-8 flex items-center justify-center">
                  <span className="text-xs font-semibold text-muted-foreground">
                    {match.awayTeam.name.slice(0, 3)}
                  </span>
                </div>
                {scoreMatrix[0]?.map((_, colIndex) => (
                  <div
                    key={colIndex}
                    className="w-12 h-8 flex items-center justify-center"
                  >
                    <span className="text-xs font-bold text-muted-foreground">
                      {colIndex}
                    </span>
                  </div>
                ))}
              </div>

              {/* Matrix Rows */}
              {scoreMatrix.map((row, homeGoals) => (
                <div key={homeGoals} className="flex items-center mb-1">
                  {/* Row Header - Home Goals */}
                  <div className="w-10 h-12 flex items-center justify-center">
                    <span className="text-xs font-bold text-muted-foreground">
                      {homeGoals}
                    </span>
                  </div>

                  {/* Score Cells */}
                  {row.map((probability, awayGoals) => (
                    <button
                      key={`${homeGoals}-${awayGoals}`}
                      className={cn(
                        "w-12 h-12 flex flex-col items-center justify-center rounded border-2 text-xs font-semibold transition-all hover:scale-105 active:scale-95",
                        getHeatmapColor(probability),
                        "mx-0.5"
                      )}
                      title={`${homeGoals}-${awayGoals}: ${probability}%`}
                    >
                      <span className="text-[10px] leading-tight">
                        {probability > 0 ? `${probability}%` : ""}
                      </span>
                    </button>
                  ))}
                </div>
              ))}

              {/* Legend */}
              <div className="mt-3 text-xs text-muted-foreground">
                <span className="font-semibold">{match.homeTeam.name.slice(0, 3)}</span>
                {" en ligne, "}
                <span className="font-semibold">{match.awayTeam.name.slice(0, 3)}</span>
                {" en colonne"}
              </div>
            </div>
          </div>
        </div>

        {/* Recommendation */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between p-3 bg-lime/10 dark:bg-lime/5 rounded-lg">
            <span className="text-sm font-medium">Score le plus probable</span>
            <span className="text-sm font-bold text-navy dark:text-lime">
              {topScores[0]?.home} - {topScores[0]?.away}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
