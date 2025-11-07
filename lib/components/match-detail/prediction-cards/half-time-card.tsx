"use client"

import { Clock } from "lucide-react"
import { Badge } from "@/lib/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/lib/components/ui/card"
import { Progress } from "@/lib/components/ui/progress"
import { cn } from "@/lib/utils"
import type { MatchDetail } from "@/lib/hooks/use-match-detail"

interface HalfTimePrediction {
  type: "half_time"
  homeLeading: { probability: number }
  draw: { probability: number }
  awayLeading: { probability: number }
  homeFirstHalfGoals: number
  awayFirstHalfGoals: number
  homeSecondHalfGoals: number
  awaySecondHalfGoals: number
  confidence: "high" | "medium" | "low"
}

interface HalfTimeCardProps {
  prediction: HalfTimePrediction
  match: MatchDetail
}

const confidenceVariants = {
  high: { variant: "success" as const, label: "Confiance élevée" },
  medium: { variant: "warning" as const, label: "Confiance moyenne" },
  low: { variant: "error" as const, label: "Confiance faible" },
}

/**
 * Card de prédiction Mi-temps
 * Affiche le résultat probable à la mi-temps et stats par période
 */
export function HalfTimeCard({ prediction, match }: HalfTimeCardProps) {
  const {
    homeLeading,
    draw,
    awayLeading,
    homeFirstHalfGoals,
    awayFirstHalfGoals,
    homeSecondHalfGoals,
    awaySecondHalfGoals,
    confidence,
  } = prediction
  const confidenceConfig = confidenceVariants[confidence]

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-navy dark:text-lime" />
            <h3 className="text-lg font-semibold">Résultat à la mi-temps</h3>
          </div>
          <Badge variant={confidenceConfig.variant}>
            {confidenceConfig.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Half-Time Result Prediction */}
        <div className="space-y-4">
          {/* Home Leading */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">{match.homeTeam.name} mène</span>
              <span className="font-bold text-lg">{homeLeading.probability}%</span>
            </div>
            <Progress
              value={homeLeading.probability}
              className={cn(
                "h-3",
                homeLeading.probability > 50 && "bg-lime/20"
              )}
            />
          </div>

          {/* Draw */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">Égalité à la pause</span>
              <span className="font-bold text-lg">{draw.probability}%</span>
            </div>
            <Progress
              value={draw.probability}
              className={cn(
                "h-3",
                draw.probability > 50 && "bg-lime/20"
              )}
            />
          </div>

          {/* Away Leading */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">{match.awayTeam.name} mène</span>
              <span className="font-bold text-lg">{awayLeading.probability}%</span>
            </div>
            <Progress
              value={awayLeading.probability}
              className={cn(
                "h-3",
                awayLeading.probability > 50 && "bg-lime/20"
              )}
            />
          </div>
        </div>

        {/* Half Stats Comparison */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-muted-foreground">
            Statistiques par période
          </h4>

          {/* First Half vs Second Half */}
          <div className="grid grid-cols-2 gap-4">
            {/* First Half */}
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-center mb-3">
                <span className="text-xs font-semibold text-muted-foreground">
                  1ère mi-temps
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {match.homeTeam.name.slice(0, 10)}
                  </span>
                  <span className="font-bold text-navy dark:text-lime">
                    {homeFirstHalfGoals.toFixed(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {match.awayTeam.name.slice(0, 10)}
                  </span>
                  <span className="font-bold text-navy dark:text-lime">
                    {awayFirstHalfGoals.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Second Half */}
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-center mb-3">
                <span className="text-xs font-semibold text-muted-foreground">
                  2ème mi-temps
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {match.homeTeam.name.slice(0, 10)}
                  </span>
                  <span className="font-bold text-navy dark:text-lime">
                    {homeSecondHalfGoals.toFixed(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {match.awayTeam.name.slice(0, 10)}
                  </span>
                  <span className="font-bold text-navy dark:text-lime">
                    {awaySecondHalfGoals.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Total Goals by Period */}
        <div className="p-4 bg-lime/10 dark:bg-lime/5 rounded-lg border border-lime/30">
          <h4 className="text-sm font-semibold text-muted-foreground mb-3">
            Buts moyens par période
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">1ère mi-temps</span>
              <span className="text-sm font-bold text-navy dark:text-lime">
                {(homeFirstHalfGoals + awayFirstHalfGoals).toFixed(1)} buts
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">2ème mi-temps</span>
              <span className="text-sm font-bold text-navy dark:text-lime">
                {(homeSecondHalfGoals + awaySecondHalfGoals).toFixed(1)} buts
              </span>
            </div>
          </div>
        </div>

        {/* Recommendation */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between p-3 bg-lime/10 dark:bg-lime/5 rounded-lg">
            <span className="text-sm font-medium">Prédiction mi-temps</span>
            <span className="text-sm font-bold text-navy dark:text-lime">
              {homeLeading.probability > draw.probability &&
                homeLeading.probability > awayLeading.probability &&
                `${match.homeTeam.name} mène`}
              {draw.probability > homeLeading.probability &&
                draw.probability > awayLeading.probability &&
                "Égalité"}
              {awayLeading.probability > homeLeading.probability &&
                awayLeading.probability > draw.probability &&
                `${match.awayTeam.name} mène`}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
