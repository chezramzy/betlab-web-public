"use client"

import { motion } from "framer-motion"
import { Loader2, AlertCircle, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { Progress } from "@/lib/components/ui/progress"
import { cn } from "@/lib/utils"
import type { MatchDetail } from "@/lib/hooks/use-match-detail"
import { useTeamStats } from "@/lib/hooks/use-team-stats"
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

interface AnalysisTabProps {
  match: MatchDetail
}

/**
 * Onglet Analyse
 * Affiche une comparaison détaillée des deux équipes avec:
 * - Radar chart de comparaison
 * - Barres de stats comparatives
 * - Forme récente
 * - Stats clés
 */
export function AnalysisTab({ match }: AnalysisTabProps) {
  const { data: homeStats, isLoading: loadingHome } = useTeamStats(match.homeTeam.id)
  const { data: awayStats, isLoading: loadingAway } = useTeamStats(match.awayTeam.id)

  const isLoading = loadingHome || loadingAway
  const hasError = !homeStats || !awayStats

  if (isLoading) {
    return <AnalysisSkeleton />
  }

  if (hasError) {
    return (
      <div className="bg-card border rounded-lg p-6">
        <div className="flex flex-col items-center gap-4 text-center py-8">
          <AlertCircle className="w-12 h-12 text-destructive" />
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Impossible de charger l&apos;analyse
            </h3>
            <p className="text-sm text-muted-foreground">
              Les statistiques des équipes ne sont pas disponibles
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Préparer les données pour le radar chart
  const radarData = [
    {
      category: "Attaque",
      home: homeStats.attack,
      away: awayStats.attack,
    },
    {
      category: "Défense",
      home: homeStats.defense,
      away: awayStats.defense,
    },
    {
      category: "Possession",
      home: homeStats.possession,
      away: awayStats.possession,
    },
    {
      category: "Passes",
      home: homeStats.passing,
      away: awayStats.passing,
    },
    {
      category: "Tirs",
      home: homeStats.shots,
      away: awayStats.shots,
    },
    {
      category: "Discipline",
      home: homeStats.discipline,
      away: awayStats.discipline,
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Radar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Comparaison générale</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e5e7eb" strokeDasharray="3 3" />
              <PolarAngleAxis
                dataKey="category"
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} />
              <Radar
                name={match.homeTeam.name}
                dataKey="home"
                stroke="#C8DC3F"
                fill="#C8DC3F"
                fillOpacity={0.5}
                strokeWidth={2}
              />
              <Radar
                name={match.awayTeam.name}
                dataKey="away"
                stroke="#003366"
                fill="#003366"
                fillOpacity={0.5}
                strokeWidth={2}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
            </RadarChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-lime" />
              <span className="text-sm text-muted-foreground">
                {match.homeTeam.name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-navy" />
              <span className="text-sm text-muted-foreground">
                {match.awayTeam.name}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Comparison Bars */}
      <Card>
        <CardHeader>
          <CardTitle>Statistiques comparées</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <StatComparison
            label="Buts marqués (moy.)"
            homeValue={homeStats.avgGoalsScored}
            awayValue={awayStats.avgGoalsScored}
            homeTeam={match.homeTeam.name}
            awayTeam={match.awayTeam.name}
          />
          <StatComparison
            label="Buts encaissés (moy.)"
            homeValue={homeStats.avgGoalsConceded}
            awayValue={awayStats.avgGoalsConceded}
            homeTeam={match.homeTeam.name}
            awayTeam={match.awayTeam.name}
            inverted
          />
          <StatComparison
            label="Clean sheets"
            homeValue={homeStats.cleanSheets}
            awayValue={awayStats.cleanSheets}
            homeTeam={match.homeTeam.name}
            awayTeam={match.awayTeam.name}
          />
          <StatComparison
            label="Attaque (%)"
            homeValue={homeStats.attack}
            awayValue={awayStats.attack}
            homeTeam={match.homeTeam.name}
            awayTeam={match.awayTeam.name}
          />
          <StatComparison
            label="Défense (%)"
            homeValue={homeStats.defense}
            awayValue={awayStats.defense}
            homeTeam={match.homeTeam.name}
            awayTeam={match.awayTeam.name}
          />
        </CardContent>
      </Card>

      {/* Recent Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RecentFormCard team={match.homeTeam.name} form={homeStats.form} />
        <RecentFormCard team={match.awayTeam.name} form={awayStats.form} />
      </div>

      {/* Key Stats Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Statistiques détaillées</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              label="Possession"
              homeValue={`${homeStats.possession}%`}
              awayValue={`${awayStats.possession}%`}
              homeTeam={match.homeTeam.name}
              awayTeam={match.awayTeam.name}
            />
            <StatCard
              label="Passes"
              homeValue={`${homeStats.passing}%`}
              awayValue={`${awayStats.passing}%`}
              homeTeam={match.homeTeam.name}
              awayTeam={match.awayTeam.name}
            />
            <StatCard
              label="Tirs"
              homeValue={`${homeStats.shots}%`}
              awayValue={`${awayStats.shots}%`}
              homeTeam={match.homeTeam.name}
              awayTeam={match.awayTeam.name}
            />
            <StatCard
              label="Discipline"
              homeValue={`${homeStats.discipline}%`}
              awayValue={`${awayStats.discipline}%`}
              homeTeam={match.homeTeam.name}
              awayTeam={match.awayTeam.name}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

/**
 * Composant de comparaison de statistiques avec barre
 */
function StatComparison({
  label,
  homeValue,
  awayValue,
  homeTeam,
  awayTeam,
  inverted = false,
}: {
  label: string
  homeValue: number
  awayValue: number
  homeTeam: string
  awayTeam: string
  inverted?: boolean
}) {
  const total = homeValue + awayValue
  const homePercent = total > 0 ? (homeValue / total) * 100 : 50

  // Pour les stats inversées (moins c'est mieux), inverser les couleurs
  const homeBetter = inverted ? awayValue > homeValue : homeValue > awayValue

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm font-medium text-muted-foreground">
        <span>{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className={cn("text-sm font-bold w-12 text-right", homeBetter && "text-lime")}>
          {homeValue.toFixed(1)}
        </span>
        <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full transition-all",
              homeBetter ? "bg-lime" : "bg-navy dark:bg-navy"
            )}
            style={{ width: `${homePercent}%` }}
          />
        </div>
        <span className={cn("text-sm font-bold w-12", !homeBetter && "text-lime")}>
          {awayValue.toFixed(1)}
        </span>
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{homeTeam}</span>
        <span>{awayTeam}</span>
      </div>
    </div>
  )
}

/**
 * Card de forme récente d'une équipe
 */
function RecentFormCard({ team, form }: { team: string; form: ("W" | "D" | "L")[] }) {
  const wins = form.filter((r) => r === "W").length
  const draws = form.filter((r) => r === "D").length
  const losses = form.filter((r) => r === "L").length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{team}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Form Badges */}
        <div className="flex gap-2 justify-center">
          {form.map((result, index) => (
            <div
              key={index}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold",
                result === "W" && "bg-lime/20 text-lime border-2 border-lime",
                result === "D" && "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600",
                result === "L" && "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-2 border-red-300 dark:border-red-800"
              )}
            >
              {result}
            </div>
          ))}
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-lime/10 dark:bg-lime/5 rounded-lg">
            <div className="text-lg font-bold text-lime">{wins}</div>
            <div className="text-xs text-muted-foreground">V</div>
          </div>
          <div className="p-2 bg-muted rounded-lg">
            <div className="text-lg font-bold">{draws}</div>
            <div className="text-xs text-muted-foreground">N</div>
          </div>
          <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
            <div className="text-lg font-bold text-red-600 dark:text-red-400">
              {losses}
            </div>
            <div className="text-xs text-muted-foreground">D</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Card de statistique individuelle
 */
function StatCard({
  label,
  homeValue,
  awayValue,
  homeTeam,
  awayTeam,
}: {
  label: string
  homeValue: string
  awayValue: string
  homeTeam: string
  awayTeam: string
}) {
  return (
    <div className="p-4 bg-muted rounded-lg space-y-2">
      <div className="text-xs font-semibold text-muted-foreground text-center">
        {label}
      </div>
      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span className="text-xs text-muted-foreground truncate">
            {homeTeam.slice(0, 8)}
          </span>
          <span className="font-bold text-navy dark:text-lime">{homeValue}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-xs text-muted-foreground truncate">
            {awayTeam.slice(0, 8)}
          </span>
          <span className="font-bold text-navy dark:text-lime">{awayValue}</span>
        </div>
      </div>
    </div>
  )
}

/**
 * Skeleton de chargement pour l'onglet analyse
 */
function AnalysisSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Radar Chart Skeleton */}
      <Card>
        <CardHeader>
          <div className="h-6 w-48 bg-muted rounded" />
        </CardHeader>
        <CardContent>
          <div className="h-[300px] bg-muted rounded-lg" />
        </CardContent>
      </Card>

      {/* Stats Skeleton */}
      <Card>
        <CardHeader>
          <div className="h-6 w-48 bg-muted rounded" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-32 bg-muted rounded" />
              <div className="h-4 w-full bg-muted rounded-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
