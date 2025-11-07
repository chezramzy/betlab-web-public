"use client"

import { useState } from "react"
import { TrendingUp } from "lucide-react"
import { Badge } from "@/lib/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/lib/components/ui/card"
import { Progress } from "@/lib/components/ui/progress"
import { cn } from "@/lib/utils"
import type { MatchDetail } from "@/lib/hooks/use-match-detail"

interface OverUnderPrediction {
  type: "over_under"
  lines: {
    "1.5": { over: number; under: number }
    "2.5": { over: number; under: number }
    "3.5": { over: number; under: number }
  }
  expectedGoals: number
  homeAvgGoals: number
  awayAvgGoals: number
  confidence: "high" | "medium" | "low"
}

interface OverUnderCardProps {
  prediction: OverUnderPrediction
  match: MatchDetail
}

type GoalLine = "1.5" | "2.5" | "3.5"

const confidenceVariants = {
  high: { variant: "success" as const, label: "Confiance élevée" },
  medium: { variant: "warning" as const, label: "Confiance moyenne" },
  low: { variant: "error" as const, label: "Confiance faible" },
}

/**
 * Card de prédiction Over/Under buts
 * Affiche les probabilités pour 1.5, 2.5, 3.5 buts
 */
export function OverUnderCard({ prediction, match }: OverUnderCardProps) {
  const [selectedLine, setSelectedLine] = useState<GoalLine>("2.5")
  const { lines, expectedGoals, homeAvgGoals, awayAvgGoals, confidence } = prediction
  const confidenceConfig = confidenceVariants[confidence]

  const currentLine = lines[selectedLine]

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-navy dark:text-lime" />
            <h3 className="text-lg font-semibold">Plus / Moins de buts</h3>
          </div>
          <Badge variant={confidenceConfig.variant}>
            {confidenceConfig.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Line Selector */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {(["1.5", "2.5", "3.5"] as GoalLine[]).map((line) => (
            <button
              key={line}
              onClick={() => setSelectedLine(line)}
              className={cn(
                "flex-1 min-h-[44px] px-4 py-2 rounded-lg text-sm font-medium transition-all",
                selectedLine === line
                  ? "bg-navy dark:bg-lime text-white dark:text-navy shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {line} buts
            </button>
          ))}
        </div>

        {/* Over/Under Display */}
        <div className="grid grid-cols-2 gap-4">
          {/* Over */}
          <div
            className={cn(
              "p-4 rounded-lg border-2 transition-all",
              currentLine.over > currentLine.under
                ? "border-lime bg-lime/10 dark:bg-lime/5"
                : "border-border bg-card"
            )}
          >
            <div className="flex flex-col items-center gap-2 text-center">
              <span className="text-sm font-medium text-muted-foreground">
                Plus de {selectedLine}
              </span>
              <span className="text-3xl font-bold">{currentLine.over}%</span>
            </div>
          </div>

          {/* Under */}
          <div
            className={cn(
              "p-4 rounded-lg border-2 transition-all",
              currentLine.under > currentLine.over
                ? "border-lime bg-lime/10 dark:bg-lime/5"
                : "border-border bg-card"
            )}
          >
            <div className="flex flex-col items-center gap-2 text-center">
              <span className="text-sm font-medium text-muted-foreground">
                Moins de {selectedLine}
              </span>
              <span className="text-3xl font-bold">{currentLine.under}%</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Moins de {selectedLine}</span>
            <span>Plus de {selectedLine}</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden flex">
            <div
              className="bg-navy dark:bg-navy transition-all"
              style={{ width: `${currentLine.under}%` }}
            />
            <div
              className="bg-lime transition-all"
              style={{ width: `${currentLine.over}%` }}
            />
          </div>
        </div>

        {/* Expected Goals */}
        <div className="p-4 bg-muted rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-muted-foreground">
              Buts attendus (xG)
            </span>
            <span className="text-2xl font-bold text-navy dark:text-lime">
              {expectedGoals.toFixed(1)}
            </span>
          </div>

          {/* Team Average Goals */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{match.homeTeam.name}</span>
              <span className="font-bold">{homeAvgGoals.toFixed(1)} buts/match</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{match.awayTeam.name}</span>
              <span className="font-bold">{awayAvgGoals.toFixed(1)} buts/match</span>
            </div>
          </div>
        </div>

        {/* All Lines Summary */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-muted-foreground">
            Résumé de toutes les lignes
          </h4>
          <div className="space-y-1">
            {(Object.keys(lines) as GoalLine[]).map((line) => {
              const lineData = lines[line]
              const isOver = lineData.over > lineData.under
              return (
                <div
                  key={line}
                  className="flex items-center justify-between p-2 rounded bg-muted/50"
                >
                  <span className="text-xs font-medium">{line} buts</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {isOver ? "Plus" : "Moins"}
                    </span>
                    <span className="text-sm font-bold text-navy dark:text-lime">
                      {Math.max(lineData.over, lineData.under)}%
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recommendation */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between p-3 bg-lime/10 dark:bg-lime/5 rounded-lg">
            <span className="text-sm font-medium">Meilleur pari</span>
            <span className="text-sm font-bold text-navy dark:text-lime">
              {currentLine.over > currentLine.under
                ? `Plus de ${selectedLine} buts`
                : `Moins de ${selectedLine} buts`}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
