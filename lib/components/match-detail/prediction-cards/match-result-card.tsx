"use client"

import { Trophy } from "lucide-react"
import { Badge } from "@/lib/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/lib/components/ui/card"
import { Progress } from "@/lib/components/ui/progress"
import { cn } from "@/lib/utils"
import type { MatchDetail } from "@/lib/hooks/use-match-detail"

interface MatchResultPrediction {
  type: "match_result"
  homeWin: { probability: number; odds?: number }
  draw: { probability: number; odds?: number }
  awayWin: { probability: number; odds?: number }
  confidence: "high" | "medium" | "low"
  reasoning?: string
}

interface MatchResultCardProps {
  prediction: MatchResultPrediction
  match: MatchDetail
}

const confidenceVariants = {
  high: { variant: "success" as const, label: "Confiance élevée" },
  medium: { variant: "warning" as const, label: "Confiance moyenne" },
  low: { variant: "error" as const, label: "Confiance faible" },
}

/**
 * Card de prédiction pour le résultat du match (1X2)
 * Affiche les probabilités pour Home Win, Draw, Away Win
 */
export function MatchResultCard({ prediction, match }: MatchResultCardProps) {
  const { homeWin, draw, awayWin, confidence, reasoning } = prediction
  const confidenceConfig = confidenceVariants[confidence]

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-navy dark:text-lime" />
            <h3 className="text-lg font-semibold">Résultat du match</h3>
          </div>
          <Badge variant={confidenceConfig.variant}>
            {confidenceConfig.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Home Win */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium">{match.homeTeam.name} gagne</span>
            <span className="font-bold text-lg">{homeWin.probability}%</span>
          </div>
          <Progress
            value={homeWin.probability}
            className={cn(
              "h-3",
              homeWin.probability > 50 && "bg-lime/20"
            )}
          />
          {homeWin.odds && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Cote recommandée</span>
              <span className="text-sm font-semibold text-navy dark:text-lime">
                {homeWin.odds.toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {/* Draw */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium">Match nul</span>
            <span className="font-bold text-lg">{draw.probability}%</span>
          </div>
          <Progress
            value={draw.probability}
            className={cn(
              "h-3",
              draw.probability > 50 && "bg-lime/20"
            )}
          />
          {draw.odds && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Cote recommandée</span>
              <span className="text-sm font-semibold text-navy dark:text-lime">
                {draw.odds.toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {/* Away Win */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium">{match.awayTeam.name} gagne</span>
            <span className="font-bold text-lg">{awayWin.probability}%</span>
          </div>
          <Progress
            value={awayWin.probability}
            className={cn(
              "h-3",
              awayWin.probability > 50 && "bg-lime/20"
            )}
          />
          {awayWin.odds && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Cote recommandée</span>
              <span className="text-sm font-semibold text-navy dark:text-lime">
                {awayWin.odds.toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {/* Reasoning */}
        {reasoning && (
          <div className="mt-4 p-4 bg-muted rounded-lg border border-border">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {reasoning}
            </p>
          </div>
        )}

        {/* Best Bet */}
        <div className="pt-4 border-t">
          {homeWin.probability > draw.probability &&
            homeWin.probability > awayWin.probability && (
              <div className="flex items-center justify-between p-3 bg-lime/10 dark:bg-lime/5 rounded-lg">
                <span className="text-sm font-medium">Meilleur pari</span>
                <span className="text-sm font-bold text-navy dark:text-lime">
                  {match.homeTeam.name} gagne
                </span>
              </div>
            )}
          {draw.probability > homeWin.probability &&
            draw.probability > awayWin.probability && (
              <div className="flex items-center justify-between p-3 bg-lime/10 dark:bg-lime/5 rounded-lg">
                <span className="text-sm font-medium">Meilleur pari</span>
                <span className="text-sm font-bold text-navy dark:text-lime">
                  Match nul
                </span>
              </div>
            )}
          {awayWin.probability > homeWin.probability &&
            awayWin.probability > draw.probability && (
              <div className="flex items-center justify-between p-3 bg-lime/10 dark:bg-lime/5 rounded-lg">
                <span className="text-sm font-medium">Meilleur pari</span>
                <span className="text-sm font-bold text-navy dark:text-lime">
                  {match.awayTeam.name} gagne
                </span>
              </div>
            )}
        </div>
      </CardContent>
    </Card>
  )
}
