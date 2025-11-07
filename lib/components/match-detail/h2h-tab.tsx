"use client"

import { motion } from "framer-motion"
import { Loader2, AlertCircle, Calendar, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { cn } from "@/lib/utils"
import type { MatchDetail } from "@/lib/hooks/use-match-detail"
import { useH2H } from "@/lib/hooks/use-h2h"
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface H2HTabProps {
  match: MatchDetail
}

/**
 * Onglet Head-to-Head
 * Affiche l'historique des confrontations entre deux équipes:
 * - Stats globales H2H
 * - Derniers matchs
 * - Graphique d'évolution
 */
export function H2HTab({ match }: H2HTabProps) {
  const { data: h2h, isLoading, isError } = useH2H(
    match.homeTeam.id,
    match.awayTeam.id
  )

  if (isLoading) {
    return <H2HSkeleton />
  }

  if (isError || !h2h) {
    return (
      <div className="bg-card border rounded-lg p-6">
        <div className="flex flex-col items-center gap-4 text-center py-8">
          <AlertCircle className="w-12 h-12 text-destructive" />
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Impossible de charger les données H2H
            </h3>
            <p className="text-sm text-muted-foreground">
              L&apos;historique des confrontations n&apos;est pas disponible
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Global H2H Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Statistiques globales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <StatCard
              label={match.homeTeam.name}
              value={h2h.homeWins}
              total={h2h.totalMatches}
              color="lime"
            />
            <StatCard
              label="Nuls"
              value={h2h.draws}
              total={h2h.totalMatches}
              color="gray"
            />
            <StatCard
              label={match.awayTeam.name}
              value={h2h.awayWins}
              total={h2h.totalMatches}
              color="navy"
            />
          </div>

          {/* Average Goals */}
          <div className="mt-6 pt-6 border-t">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">
                  Buts moyens {match.homeTeam.name}
                </div>
                <div className="text-2xl font-bold text-navy dark:text-lime">
                  {h2h.homeAvgGoals.toFixed(1)}
                </div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">
                  Buts moyens {match.awayTeam.name}
                </div>
                <div className="text-2xl font-bold text-navy dark:text-lime">
                  {h2h.awayAvgGoals.toFixed(1)}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Matches */}
      <Card>
        <CardHeader>
          <CardTitle>Dernières confrontations ({h2h.recentMatches.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {h2h.recentMatches.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">Aucune confrontation récente</p>
            </div>
          ) : (
            h2h.recentMatches.map((matchItem) => (
              <H2HMatchCard
                key={matchItem.id}
                match={matchItem}
                currentHomeTeam={match.homeTeam.name}
                currentAwayTeam={match.awayTeam.name}
              />
            ))
          )}
        </CardContent>
      </Card>

      {/* Trend Chart */}
      {h2h.trendData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Évolution de la forme</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={h2h.trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  tickFormatter={(value) => {
                    try {
                      return format(new Date(value), "dd/MM", { locale: fr })
                    } catch {
                      return value
                    }
                  }}
                />
                <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="homeForm"
                  stroke="#C8DC3F"
                  fill="#C8DC3F"
                  fillOpacity={0.3}
                  name={match.homeTeam.name}
                />
                <Area
                  type="monotone"
                  dataKey="awayForm"
                  stroke="#003366"
                  fill="#003366"
                  fillOpacity={0.3}
                  name={match.awayTeam.name}
                />
              </AreaChart>
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
      )}
    </motion.div>
  )
}

/**
 * Card de statistique H2H
 */
function StatCard({
  label,
  value,
  total,
  color,
}: {
  label: string
  value: number
  total: number
  color: "lime" | "navy" | "gray"
}) {
  const percentage = total > 0 ? (value / total) * 100 : 0

  const colorClasses = {
    lime: "bg-lime/10 dark:bg-lime/5 text-lime border-lime",
    navy: "bg-navy/10 dark:bg-navy/5 text-navy dark:text-lime border-navy dark:border-lime",
    gray: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600",
  }

  return (
    <div className="space-y-2">
      <div className="text-sm text-muted-foreground truncate">{label}</div>
      <div
        className={cn(
          "text-4xl font-bold p-4 rounded-lg border-2",
          colorClasses[color]
        )}
      >
        {value}
      </div>
      <div className="text-xs text-muted-foreground">{percentage.toFixed(0)}%</div>
    </div>
  )
}

/**
 * Card d'un match H2H
 */
function H2HMatchCard({
  match,
  currentHomeTeam,
  currentAwayTeam,
}: {
  match: {
    id: string
    date: Date
    homeTeam: string
    awayTeam: string
    score: { home: number; away: number }
    winner: "home" | "away" | "draw"
    competition: string
    venue?: string
  }
  currentHomeTeam: string
  currentAwayTeam: string
}) {
  // Déterminer si l'équipe à domicile actuelle a gagné
  const currentHomeWon =
    (match.homeTeam === currentHomeTeam && match.winner === "home") ||
    (match.awayTeam === currentHomeTeam && match.winner === "away")

  const currentAwayWon =
    (match.homeTeam === currentAwayTeam && match.winner === "home") ||
    (match.awayTeam === currentAwayTeam && match.winner === "away")

  const isDraw = match.winner === "draw"

  return (
    <div
      className={cn(
        "flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border-2 transition-all hover:shadow-md",
        currentHomeWon && "border-lime bg-lime/5",
        currentAwayWon && "border-navy dark:border-lime bg-navy/5 dark:bg-lime/5",
        isDraw && "border-gray-300 dark:border-gray-600 bg-muted/50"
      )}
    >
      {/* Date & Competition */}
      <div className="flex items-center gap-2 mb-2 md:mb-0 md:w-32">
        <div className="text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {format(match.date, "dd MMM yyyy", { locale: fr })}
          </div>
          <div className="mt-1">{match.competition}</div>
        </div>
      </div>

      {/* Match Result */}
      <div className="flex-1 flex items-center justify-center gap-3">
        <div className="text-right flex-1">
          <div className={cn("font-semibold text-sm", match.homeTeam === currentHomeTeam && "text-navy dark:text-lime")}>
            {match.homeTeam}
          </div>
        </div>

        <div className="px-4 py-2 bg-muted rounded-lg min-w-[60px] text-center">
          <span className="text-lg font-bold">
            {match.score.home} - {match.score.away}
          </span>
        </div>

        <div className="text-left flex-1">
          <div className={cn("font-semibold text-sm", match.awayTeam === currentAwayTeam && "text-navy dark:text-lime")}>
            {match.awayTeam}
          </div>
        </div>
      </div>

      {/* Venue */}
      {match.venue && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2 md:mt-0 md:w-32 md:justify-end">
          <MapPin className="w-3 h-3" />
          <span className="truncate">{match.venue}</span>
        </div>
      )}
    </div>
  )
}

/**
 * Skeleton de chargement pour l'onglet H2H
 */
function H2HSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Stats Skeleton */}
      <Card>
        <CardHeader>
          <div className="h-6 w-48 bg-muted rounded" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-20 bg-muted rounded mx-auto" />
                <div className="h-16 bg-muted rounded" />
                <div className="h-3 w-12 bg-muted rounded mx-auto" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Matches Skeleton */}
      <Card>
        <CardHeader>
          <div className="h-6 w-48 bg-muted rounded" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 bg-muted rounded-lg" />
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
