"use client"

import { useQuery } from "@tanstack/react-query"
import { httpService } from "@/lib/core/services/http-service"

export interface MatchDetail {
  id: string
  fixtureId: number
  homeTeam: {
    id: number
    name: string
    logo: string
  }
  awayTeam: {
    id: number
    name: string
    logo: string
  }
  league: {
    id: number
    name: string
    logo: string
    country: string
  }
  kickoffTime: Date
  status: "scheduled" | "live" | "finished"
  score?: {
    home: number
    away: number
  }
  venue?: string
  referee?: string
}

interface ApiFixtureResponse {
  fixture: {
    fixture_id: number
    home_team: {
      id: number
      name: string
      logo: string
    }
    away_team: {
      id: number
      name: string
      logo: string
    }
    league: {
      id: number
      name: string
      logo: string
      country: string
    }
    kickoff_time: string
    status: "scheduled" | "live" | "finished"
    score?: {
      home: number
      away: number
    }
    venue?: string
    referee?: string
  }
}

/**
 * Hook React Query pour récupérer les détails d'un match
 * @param fixtureId - L'ID du match (fixture)
 * @returns Query result avec les données du match
 */
export function useMatchDetail(fixtureId: string) {
  return useQuery({
    queryKey: ["match-detail", fixtureId],
    queryFn: async (): Promise<MatchDetail> => {
      const response = await httpService.get<ApiFixtureResponse>(
        `/fixtures/${fixtureId}`
      )

      // Transform API response to MatchDetail interface
      const fixture = response.fixture
      return {
        id: fixture.fixture_id.toString(),
        fixtureId: fixture.fixture_id,
        homeTeam: {
          id: fixture.home_team.id,
          name: fixture.home_team.name,
          logo: fixture.home_team.logo,
        },
        awayTeam: {
          id: fixture.away_team.id,
          name: fixture.away_team.name,
          logo: fixture.away_team.logo,
        },
        league: {
          id: fixture.league.id,
          name: fixture.league.name,
          logo: fixture.league.logo,
          country: fixture.league.country,
        },
        kickoffTime: new Date(fixture.kickoff_time),
        status: fixture.status,
        score: fixture.score,
        venue: fixture.venue,
        referee: fixture.referee,
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - données fraîches pendant 5min
    gcTime: 10 * 60 * 1000, // 10 minutes - garde en cache 10min
    refetchOnWindowFocus: true, // Refetch au retour sur la fenêtre
    refetchInterval: (query) => {
      // Auto-refetch toutes les 30s si le match est live
      const data = query.state.data
      return data?.status === "live" ? 30 * 1000 : false
    },
    enabled: !!fixtureId && fixtureId !== "", // N'exécute que si fixtureId existe
    retry: 2, // Retry 2 fois en cas d'erreur
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  })
}
