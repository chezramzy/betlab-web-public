"use client"

import { Target, CheckCircle, XCircle } from "lucide-react"
import { Badge } from "@/lib/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/lib/components/ui/card"
import { Progress } from "@/lib/components/ui/progress"
import { cn } from "@/lib/utils"
import type { MatchDetail } from "@/lib/hooks/use-match-detail"

interface BTTSPrediction {
  type: "both_teams_score"
  yes: { probability: number; odds?: number }
  no: { probability: number; odds?: number }
  confidence: "high" | "medium" | "low"
  homeTeamScoringRate: number
  awayTeamScoringRate: number
  recentBTTS: boolean[]
}

interface BTTSCardProps {
  prediction: BTTSPrediction
  match: MatchDetail
}

const confidenceVariants = {
  high: { variant: "success" as const, label: "Confiance élevée" },
  medium: { variant: "warning" as const, label: "Confiance moyenne" },
  low: { variant: "error" as const, label: "Confiance faible" },
}

/**
 * Card de prédiction Both Teams To Score (BTTS)
 * Affiche si les 2 équipes vont marquer ou non
 */
export function BTTSCard({ prediction, match }: BTTSCardProps) {
  const { yes, no, confidence, homeTeamScoringRate, awayTeamScoringRate, recentBTTS } = prediction
  const confidenceConfig = confidenceVariants[confidence]

  const bttsCount = recentBTTS.filter(Boolean).length
  const totalMatches = recentBTTS.length

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-navy dark:text-lime" />
            <h3 className="text-lg font-semibold">Les 2 équipes marquent</h3>
          </div>
          <Badge variant={confidenceConfig.variant}>
            {confidenceConfig.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Yes/No Cards */}
        <div className="grid grid-cols-2 gap-4">
          {/* Yes Card */}
          <div
            className={cn(
              "p-4 rounded-lg border-2 transition-all",
              yes.probability > no.probability
                ? "border-lime bg-lime/10 dark:bg-lime/5"
                : "border-border bg-card"
            )}
          >
            <div className="flex flex-col items-center gap-2 text-center">
              <CheckCircle
                className={cn(
                  "w-8 h-8",
                  yes.probability > no.probability
                    ? "text-lime"
                    : "text-muted-foreground"
                )}
              />
              <span className="text-sm font-medium text-muted-foreground">
                Oui
              </span>
              <span className="text-3xl font-bold">{yes.probability}%</span>
              {yes.odds && (
                <span className="text-xs text-muted-foreground">
                  Cote: {yes.odds.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* No Card */}
          <div
            className={cn(
              "p-4 rounded-lg border-2 transition-all",
              no.probability > yes.probability
                ? "border-lime bg-lime/10 dark:bg-lime/5"
                : "border-border bg-card"
            )}
          >
            <div className="flex flex-col items-center gap-2 text-center">
              <XCircle
                className={cn(
                  "w-8 h-8",
                  no.probability > yes.probability
                    ? "text-lime"
                    : "text-muted-foreground"
                )}
              />
              <span className="text-sm font-medium text-muted-foreground">
                Non
              </span>
              <span className="text-3xl font-bold">{no.probability}%</span>
              {no.odds && (
                <span className="text-xs text-muted-foreground">
                  Cote: {no.odds.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Team Scoring Rates */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-muted-foreground">
            Taux de réussite au but
          </h4>

          {/* Home Team */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span>{match.homeTeam.name}</span>
              <span className="font-bold">{homeTeamScoringRate}%</span>
            </div>
            <Progress value={homeTeamScoringRate} className="h-2" />
          </div>

          {/* Away Team */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span>{match.awayTeam.name}</span>
              <span className="font-bold">{awayTeamScoringRate}%</span>
            </div>
            <Progress value={awayTeamScoringRate} className="h-2" />
          </div>
        </div>

        {/* Recent BTTS History */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-muted-foreground">
            Historique BTTS ({bttsCount}/{totalMatches} derniers matchs)
          </h4>

          <div className="flex gap-2 justify-center">
            {recentBTTS.map((btts, index) => (
              <div
                key={index}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold",
                  btts
                    ? "bg-lime/20 text-lime border-2 border-lime"
                    : "bg-muted text-muted-foreground border-2 border-muted"
                )}
              >
                {btts ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              </div>
            ))}
          </div>
        </div>

        {/* Recommendation */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between p-3 bg-lime/10 dark:bg-lime/5 rounded-lg">
            <span className="text-sm font-medium">Recommandation</span>
            <span className="text-sm font-bold text-navy dark:text-lime">
              {yes.probability > no.probability ? "Les 2 équipes marquent" : "Une seule équipe marque"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
