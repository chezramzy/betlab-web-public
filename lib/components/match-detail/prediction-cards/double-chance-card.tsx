"use client"

import { Shield } from "lucide-react"
import { Badge } from "@/lib/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/lib/components/ui/card"
import { cn } from "@/lib/utils"
import type { MatchDetail } from "@/lib/hooks/use-match-detail"

interface DoubleChancePrediction {
  type: "double_chance"
  homeOrDraw: { probability: number; odds?: number }
  homeOrAway: { probability: number; odds?: number }
  drawOrAway: { probability: number; odds?: number }
  confidence: "high" | "medium" | "low"
  reasoning?: string
}

interface DoubleChanceCardProps {
  prediction: DoubleChancePrediction
  match: MatchDetail
}

const confidenceVariants = {
  high: { variant: "success" as const, label: "Confiance élevée" },
  medium: { variant: "warning" as const, label: "Confiance moyenne" },
  low: { variant: "error" as const, label: "Confiance faible" },
}

/**
 * Card de prédiction Double Chance
 * Affiche les probabilités pour 1X, 12, X2
 */
export function DoubleChanceCard({ prediction, match }: DoubleChanceCardProps) {
  const { homeOrDraw, homeOrAway, drawOrAway, confidence, reasoning } = prediction
  const confidenceConfig = confidenceVariants[confidence]

  // Trouver la meilleure option
  const bestOption = [
    { name: "1X", value: homeOrDraw, label: `${match.homeTeam.name} ou Nul` },
    { name: "12", value: homeOrAway, label: "Pas de nul" },
    { name: "X2", value: drawOrAway, label: `Nul ou ${match.awayTeam.name}` },
  ].reduce((prev, current) =>
    prev.value.probability > current.value.probability ? prev : current
  )

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-navy dark:text-lime" />
            <h3 className="text-lg font-semibold">Double Chance</h3>
          </div>
          <Badge variant={confidenceConfig.variant}>
            {confidenceConfig.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Description */}
        <p className="text-sm text-muted-foreground">
          Paris sécurisés avec 2 issues gagnantes sur 3
        </p>

        {/* Double Chance Options */}
        <div className="grid grid-cols-1 gap-3">
          {/* 1X - Home or Draw */}
          <div
            className={cn(
              "p-4 rounded-lg border-2 transition-all",
              homeOrDraw.probability === bestOption.value.probability
                ? "border-lime bg-lime/10 dark:bg-lime/5"
                : "border-border bg-card hover:bg-muted/50"
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-navy dark:bg-lime text-white dark:text-navy flex items-center justify-center font-bold">
                  1X
                </div>
                <div>
                  <p className="font-semibold text-sm">
                    {match.homeTeam.name} ou Nul
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Victoire domicile ou match nul
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-navy dark:text-lime">
                  {homeOrDraw.probability}%
                </p>
                {homeOrDraw.odds && (
                  <p className="text-xs text-muted-foreground">
                    Cote: {homeOrDraw.odds.toFixed(2)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 12 - Home or Away */}
          <div
            className={cn(
              "p-4 rounded-lg border-2 transition-all",
              homeOrAway.probability === bestOption.value.probability
                ? "border-lime bg-lime/10 dark:bg-lime/5"
                : "border-border bg-card hover:bg-muted/50"
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-navy dark:bg-lime text-white dark:text-navy flex items-center justify-center font-bold">
                  12
                </div>
                <div>
                  <p className="font-semibold text-sm">Pas de nul</p>
                  <p className="text-xs text-muted-foreground">
                    Victoire domicile ou extérieur
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-navy dark:text-lime">
                  {homeOrAway.probability}%
                </p>
                {homeOrAway.odds && (
                  <p className="text-xs text-muted-foreground">
                    Cote: {homeOrAway.odds.toFixed(2)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* X2 - Draw or Away */}
          <div
            className={cn(
              "p-4 rounded-lg border-2 transition-all",
              drawOrAway.probability === bestOption.value.probability
                ? "border-lime bg-lime/10 dark:bg-lime/5"
                : "border-border bg-card hover:bg-muted/50"
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-navy dark:bg-lime text-white dark:text-navy flex items-center justify-center font-bold">
                  X2
                </div>
                <div>
                  <p className="font-semibold text-sm">
                    Nul ou {match.awayTeam.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Match nul ou victoire extérieur
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-navy dark:text-lime">
                  {drawOrAway.probability}%
                </p>
                {drawOrAway.odds && (
                  <p className="text-xs text-muted-foreground">
                    Cote: {drawOrAway.odds.toFixed(2)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reasoning */}
        {reasoning && (
          <div className="p-4 bg-muted rounded-lg border border-border">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {reasoning}
            </p>
          </div>
        )}

        {/* Recommendation */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between p-3 bg-lime/10 dark:bg-lime/5 rounded-lg">
            <span className="text-sm font-medium">Paris le plus sûr</span>
            <span className="text-sm font-bold text-navy dark:text-lime">
              {bestOption.name} - {bestOption.label}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
