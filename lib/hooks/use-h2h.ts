"use client"

import { useQuery } from "@tanstack/react-query"
import { httpService } from "@/lib/core/services/http-service"

export interface H2HMatch {
  id: string
  date: Date
  homeTeam: string
  awayTeam: string
  score: { home: number; away: number }
  winner: "home" | "away" | "draw"
  competition: string
  venue?: string
}

export interface H2HTrendData {
  date: string
  homeForm: number
  awayForm: number
}

export interface H2HData {
  homeWins: number
  draws: number
  awayWins: number
  totalMatches: number
  recentMatches: H2HMatch[]
  trendData: H2HTrendData[]
  homeAvgGoals: number
  awayAvgGoals: number
  lastMeeting?: H2HMatch
}

interface ApiH2HResponse {
  h2h: {
    home_wins: number
    draws: number
    away_wins: number
    total_matches: number
    recent_matches: Array<{
      fixture_id: number
      date: string
      home_team: string
      away_team: string
      home_score: number
      away_score: number
      winner: "home" | "away" | "draw"
      competition: string
      venue?: string
    }>
    trend_data: Array<{
      date: string
      home_form: number
      away_form: number
    }>
    home_avg_goals: number
    away_avg_goals: number
  }
}

/**
 * Transforme les données H2H API en format H2HData
 */
function transformH2H(apiH2H: ApiH2HResponse["h2h"]): H2HData {
  const recentMatches = apiH2H.recent_matches.map((match) => ({
    id: match.fixture_id.toString(),
    date: new Date(match.date),
    homeTeam: match.home_team,
    awayTeam: match.away_team,
    score: { home: match.home_score, away: match.away_score },
    winner: match.winner,
    competition: match.competition,
    venue: match.venue,
  }))

  return {
    homeWins: apiH2H.home_wins,
    draws: apiH2H.draws,
    awayWins: apiH2H.away_wins,
    totalMatches: apiH2H.total_matches,
    recentMatches,
    trendData: apiH2H.trend_data.map((data) => ({
      date: data.date,
      homeForm: data.home_form,
      awayForm: data.away_form,
    })),
    homeAvgGoals: apiH2H.home_avg_goals,
    awayAvgGoals: apiH2H.away_avg_goals,
    lastMeeting: recentMatches[0],
  }
}

/**
 * Hook React Query pour récupérer les données Head-to-Head entre deux équipes
 * @param homeTeamId - L'ID de l'équipe à domicile
 * @param awayTeamId - L'ID de l'équipe à l'extérieur
 * @returns Query result avec les données H2H
 */
export function useH2H(homeTeamId: number, awayTeamId: number) {
  return useQuery({
    queryKey: ["h2h", homeTeamId, awayTeamId],
    queryFn: async (): Promise<H2HData> => {
      const response = await httpService.get<ApiH2HResponse>(
        `/h2h/${homeTeamId}/${awayTeamId}`
      )
      return transformH2H(response.h2h)
    },
    staleTime: 15 * 60 * 1000, // 15 minutes - données H2H fraîches pendant 15min
    gcTime: 60 * 60 * 1000, // 60 minutes - garde en cache 1h
    enabled: !!homeTeamId && !!awayTeamId && homeTeamId > 0 && awayTeamId > 0,
    retry: 2, // Retry 2 fois en cas d'erreur
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  })
}
