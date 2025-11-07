"use client"

import { useQuery } from "@tanstack/react-query"
import { httpService } from "@/lib/core/services/http-service"

export interface TeamStats {
  teamId: number
  attack: number // 0-100
  defense: number // 0-100
  possession: number // 0-100
  passing: number // 0-100
  shots: number // 0-100
  discipline: number // 0-100
  avgGoalsScored: number
  avgGoalsConceded: number
  cleanSheets: number
  form: ("W" | "D" | "L")[] // 5 derniers matchs
}

interface ApiTeamStatsResponse {
  stats: {
    team_id: number
    attack: number
    defense: number
    possession: number
    passing: number
    shots: number
    discipline: number
    avg_goals_scored: number
    avg_goals_conceded: number
    clean_sheets: number
    recent_form: string[] // ["W", "L", "D", "W", "W"]
  }
}

/**
 * Transforme les stats API en format TeamStats
 */
function transformTeamStats(apiStats: ApiTeamStatsResponse["stats"]): TeamStats {
  return {
    teamId: apiStats.team_id,
    attack: apiStats.attack,
    defense: apiStats.defense,
    possession: apiStats.possession,
    passing: apiStats.passing,
    shots: apiStats.shots,
    discipline: apiStats.discipline,
    avgGoalsScored: apiStats.avg_goals_scored,
    avgGoalsConceded: apiStats.avg_goals_conceded,
    cleanSheets: apiStats.clean_sheets,
    form: apiStats.recent_form.map((result) => {
      if (result === "W" || result === "D" || result === "L") {
        return result
      }
      return "D" // Fallback
    }),
  }
}

/**
 * Hook React Query pour récupérer les statistiques d'une équipe
 * @param teamId - L'ID de l'équipe
 * @returns Query result avec les stats de l'équipe
 */
export function useTeamStats(teamId: number) {
  return useQuery({
    queryKey: ["team-stats", teamId],
    queryFn: async (): Promise<TeamStats> => {
      const response = await httpService.get<ApiTeamStatsResponse>(
        `/teams/${teamId}/stats`
      )
      return transformTeamStats(response.stats)
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - stats fraîches pendant 10min
    gcTime: 30 * 60 * 1000, // 30 minutes - garde en cache 30min
    enabled: !!teamId && teamId > 0, // N'exécute que si teamId est valide
    retry: 2, // Retry 2 fois en cas d'erreur
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  })
}
