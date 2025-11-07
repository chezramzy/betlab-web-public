"use client"

import { Flag } from "lucide-react"
import { Badge } from "@/lib/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/lib/components/ui/card"
import { Progress } from "@/lib/components/ui/progress"
import { cn } from "@/lib/utils"
import type { MatchDetail } from "@/lib/hooks/use-match-detail"

interface CornersPrediction {
  type: "corners"
  overUnder: {
    "8.5": { over: number; under: number }
    "9.5": { over: number; under: number }
    "10.5": { over: number; under: number }
  }
  expectedCorners: number
  homeAvgCorners: number
  awayAvgCorners: number
  homeAvgCornersAgainst: number
  awayAvgCornersAgainst: number
  confidence: "high" | "medium" | "low"
}

interface CornersCardProps {
  prediction: CornersPrediction
  match: MatchDetail
}

const confidenceVariants = {
  high: { variant: "success" as const, label: "Confiance élevée" },
  medium: { variant: "warning" as const, label: "Confiance moyenne" },
  low: { variant: "error" as const, label: "Confiance faible" },
}

/**
 * Card de prédiction Corners
 * Affiche les probabilités Over/Under pour les corners
 */
export function CornersCard({ prediction, match }: CornersCardProps) {
  const {
    overUnder,
    expectedCorners,
    homeAvgCorners,
    awayAvgCorners,
    homeAvgCornersAgainst,
    awayAvgCornersAgainst,
    confidence,
  } = prediction
  const confidenceConfig = confidenceVariants[confidence]

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flag className="w-5 h-5 text-navy dark:text-lime" />
            <h3 className="text-lg font-semibold">Corners</h3>
          </div>
          <Badge variant={confidenceConfig.variant}>
            {confidenceConfig.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Expected Corners */}
        <div className="p-4 bg-lime/10 dark:bg-lime/5 rounded-lg border border-lime/30">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-muted-foreground">
              Corners attendus
            </span>
            <span className="text-3xl font-bold text-navy dark:text-lime">
              {expectedCorners.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Over/Under Lines */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-muted-foreground">
            Plus / Moins de corners
          </h4>

          {(Object.keys(overUnder) as Array<keyof typeof overUnder>).map((line) => {
            const lineData = overUnder[line]
            const isOver = lineData.over > lineData.under

            return (
              <div key={line} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{line} corners</span>
                  <span
                    className={cn(
                      "font-bold",
                      isOver ? "text-lime" : "text-navy dark:text-lime"
                    )}
                  >
                    {isOver ? "Plus" : "Moins"} ({Math.max(lineData.over, lineData.under)}%)
                  </span>
                </div>

                <div className="h-3 bg-muted rounded-full overflow-hidden flex">
                  <div
                    className="bg-navy dark:bg-navy transition-all"
                    style={{ width: `${lineData.under}%` }}
                  />
                  <div
                    className="bg-lime transition-all"
                    style={{ width: `${lineData.over}%` }}
                  />
                </div>

                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Moins: {lineData.under}%</span>
                  <span>Plus: {lineData.over}%</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Team Corner Stats */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-muted-foreground">
            Statistiques par équipe
          </h4>

          <div className="grid grid-cols-2 gap-4">
            {/* Home Team */}
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-center mb-3">
                <span className="text-xs font-semibold text-muted-foreground">
                  {match.homeTeam.name}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-muted-foreground">Pour</span>
                    <span className="text-sm font-bold text-navy dark:text-lime">
                      {homeAvgCorners.toFixed(1)}
                    </span>
                  </div>
                  <Progress value={(homeAvgCorners / 10) * 100} className="h-1.5" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-muted-foreground">Contre</span>
                    <span className="text-sm font-bold text-navy dark:text-lime">
                      {homeAvgCornersAgainst.toFixed(1)}
                    </span>
                  </div>
                  <Progress value={(homeAvgCornersAgainst / 10) * 100} className="h-1.5" />
                </div>
              </div>
            </div>

            {/* Away Team */}
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-center mb-3">
                <span className="text-xs font-semibold text-muted-foreground">
                  {match.awayTeam.name}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-muted-foreground">Pour</span>
                    <span className="text-sm font-bold text-navy dark:text-lime">
                      {awayAvgCorners.toFixed(1)}
                    </span>
                  </div>
                  <Progress value={(awayAvgCorners / 10) * 100} className="h-1.5" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-muted-foreground">Contre</span>
                    <span className="text-sm font-bold text-navy dark:text-lime">
                      {awayAvgCornersAgainst.toFixed(1)}
                    </span>
                  </div>
                  <Progress value={(awayAvgCornersAgainst / 10) * 100} className="h-1.5" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendation */}
        <div className="pt-4 border-t">
          {(() => {
            // Trouver la meilleure ligne
            const bestLine = Object.entries(overUnder).reduce((prev, [line, data]) => {
              const currentConfidence = Math.max(data.over, data.under)
              const prevConfidence = Math.max(prev.data.over, prev.data.under)
              return currentConfidence > prevConfidence
                ? { line, data }
                : prev
            }, { line: "9.5", data: overUnder["9.5"] })

            const isOver = bestLine.data.over > bestLine.data.under

            return (
              <div className="flex items-center justify-between p-3 bg-lime/10 dark:bg-lime/5 rounded-lg">
                <span className="text-sm font-medium">Meilleur pari</span>
                <span className="text-sm font-bold text-navy dark:text-lime">
                  {isOver ? "Plus" : "Moins"} de {bestLine.line} corners
                </span>
              </div>
            )
          })()}
        </div>
      </CardContent>
    </Card>
  )
}
