"use client"

import { Zap } from "lucide-react"
import { Badge } from "@/lib/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/lib/components/ui/card"
import { Progress } from "@/lib/components/ui/progress"
import { cn } from "@/lib/utils"
import type { MatchDetail } from "@/lib/hooks/use-match-detail"

interface FirstGoalPrediction {
  type: "first_goal"
  homeScoresFirst: { probability: number; odds?: number }
  awayScoresFirst: { probability: number; odds?: number }
  noGoal: { probability: number; odds?: number }
  avgTimeFirstGoal: number
  homeTopScorers: Array<{
    name: string
    probability: number
    odds?: number
  }>
  awayTopScorers: Array<{
    name: string
    probability: number
    odds?: number
  }>
  confidence: "high" | "medium" | "low"
}

interface FirstGoalCardProps {
  prediction: FirstGoalPrediction
  match: MatchDetail
}

const confidenceVariants = {
  high: { variant: "success" as const, label: "Confiance élevée" },
  medium: { variant: "warning" as const, label: "Confiance moyenne" },
  low: { variant: "error" as const, label: "Confiance faible" },
}

/**
 * Card de prédiction Premier But
 * Affiche quelle équipe va marquer en premier et les buteurs probables
 */
export function FirstGoalCard({ prediction, match }: FirstGoalCardProps) {
  const {
    homeScoresFirst,
    awayScoresFirst,
    noGoal,
    avgTimeFirstGoal,
    homeTopScorers,
    awayTopScorers,
    confidence,
  } = prediction
  const confidenceConfig = confidenceVariants[confidence]

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-navy dark:text-lime" />
            <h3 className="text-lg font-semibold">Premier but</h3>
          </div>
          <Badge variant={confidenceConfig.variant}>
            {confidenceConfig.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* First Team to Score */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-muted-foreground">
            Première équipe à marquer
          </h4>

          {/* Home Scores First */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">{match.homeTeam.name}</span>
              <span className="font-bold text-lg">{homeScoresFirst.probability}%</span>
            </div>
            <Progress
              value={homeScoresFirst.probability}
              className={cn(
                "h-3",
                homeScoresFirst.probability > awayScoresFirst.probability && "bg-lime/20"
              )}
            />
            {homeScoresFirst.odds && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Cote</span>
                <span className="text-sm font-semibold text-navy dark:text-lime">
                  {homeScoresFirst.odds.toFixed(2)}
                </span>
              </div>
            )}
          </div>

          {/* Away Scores First */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">{match.awayTeam.name}</span>
              <span className="font-bold text-lg">{awayScoresFirst.probability}%</span>
            </div>
            <Progress
              value={awayScoresFirst.probability}
              className={cn(
                "h-3",
                awayScoresFirst.probability > homeScoresFirst.probability && "bg-lime/20"
              )}
            />
            {awayScoresFirst.odds && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Cote</span>
                <span className="text-sm font-semibold text-navy dark:text-lime">
                  {awayScoresFirst.odds.toFixed(2)}
                </span>
              </div>
            )}
          </div>

          {/* No Goal */}
          {noGoal.probability > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">Aucun but</span>
                <span className="font-bold text-lg">{noGoal.probability}%</span>
              </div>
              <Progress value={noGoal.probability} className="h-3" />
            </div>
          )}
        </div>

        {/* Average Time First Goal */}
        <div className="p-4 bg-lime/10 dark:bg-lime/5 rounded-lg border border-lime/30">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-muted-foreground">
              Temps moyen du 1er but
            </span>
            <span className="text-2xl font-bold text-navy dark:text-lime">
              {avgTimeFirstGoal}&apos;
            </span>
          </div>
        </div>

        {/* Top Scorers */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-muted-foreground">
            Buteurs probables
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Home Top Scorers */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-muted-foreground mb-2">
                {match.homeTeam.name}
              </div>
              {homeTopScorers.slice(0, 3).map((scorer, index) => (
                <div
                  key={scorer.name}
                  className={cn(
                    "flex items-center justify-between p-2 rounded-lg border transition-all",
                    index === 0
                      ? "border-lime bg-lime/10 dark:bg-lime/5"
                      : "border-border bg-card hover:bg-muted/50"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                        index === 0
                          ? "bg-lime text-navy"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {index + 1}
                    </div>
                    <span className="text-sm font-medium">{scorer.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-navy dark:text-lime">
                      {scorer.probability}%
                    </span>
                    {scorer.odds && (
                      <span className="text-xs text-muted-foreground ml-2">
                        {scorer.odds.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Away Top Scorers */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-muted-foreground mb-2">
                {match.awayTeam.name}
              </div>
              {awayTopScorers.slice(0, 3).map((scorer, index) => (
                <div
                  key={scorer.name}
                  className={cn(
                    "flex items-center justify-between p-2 rounded-lg border transition-all",
                    index === 0
                      ? "border-lime bg-lime/10 dark:bg-lime/5"
                      : "border-border bg-card hover:bg-muted/50"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                        index === 0
                          ? "bg-lime text-navy"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {index + 1}
                    </div>
                    <span className="text-sm font-medium">{scorer.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-navy dark:text-lime">
                      {scorer.probability}%
                    </span>
                    {scorer.odds && (
                      <span className="text-xs text-muted-foreground ml-2">
                        {scorer.odds.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommendation */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between p-3 bg-lime/10 dark:bg-lime/5 rounded-lg">
            <span className="text-sm font-medium">Prédiction</span>
            <span className="text-sm font-bold text-navy dark:text-lime">
              {homeScoresFirst.probability > awayScoresFirst.probability
                ? `${match.homeTeam.name} marque en premier`
                : `${match.awayTeam.name} marque en premier`}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
