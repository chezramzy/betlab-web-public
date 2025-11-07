"use client"

import { useQuery } from "@tanstack/react-query"
import { httpService } from "@/lib/core/services/http-service"
import { useSportStore } from "@/lib/stores/sport-store"
import { format } from "date-fns"

export interface Match {
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
}

interface UseFixturesOptions {
  date: Date
  enabled?: boolean
}

export function useFixtures({ date, enabled = true }: UseFixturesOptions) {
  const { activeSport } = useSportStore()

  const dateKey = format(date, "yyyy-MM-dd")

  return useQuery({
    queryKey: ["fixtures", dateKey, activeSport],
    queryFn: async () => {
      // API returns array directly, not wrapped in {fixtures: []}
      const response = await httpService.get<any[]>("api/fixtures", {
        params: {
          date: dateKey,
          // Note: API doesn't filter by sport yet, would need backend support
        },
      })

      // Transform API-Football format to Match interface
      return response.map((item: any): Match => {
        const fixtureId = item.fixture?.id
        const status = item.fixture?.status?.short || "NS"

        // Map status codes to our simplified status
        let mappedStatus: "scheduled" | "live" | "finished" = "scheduled"
        if (["FT", "AET", "PEN"].includes(status)) {
          mappedStatus = "finished"
        } else if (["1H", "2H", "HT", "ET", "BT", "P", "LIVE"].includes(status)) {
          mappedStatus = "live"
        }

        return {
          id: `${fixtureId}`,
          fixtureId,
          homeTeam: {
            id: item.teams?.home?.id || 0,
            name: item.teams?.home?.name || "Unknown",
            logo: item.teams?.home?.logo || "",
          },
          awayTeam: {
            id: item.teams?.away?.id || 0,
            name: item.teams?.away?.name || "Unknown",
            logo: item.teams?.away?.logo || "",
          },
          league: {
            id: item.league?.id || 0,
            name: item.league?.name || "Unknown",
            logo: item.league?.logo || "",
            country: item.league?.country || "",
          },
          kickoffTime: new Date(item.fixture?.date || Date.now()),
          status: mappedStatus,
          score: item.goals ? {
            home: item.goals.home ?? 0,
            away: item.goals.away ?? 0,
          } : undefined,
        }
      })
    },
    staleTime: 5 * 60 * 1000, // 5 min
    refetchOnWindowFocus: true,
    retry: 2,
    enabled,
  })
}
