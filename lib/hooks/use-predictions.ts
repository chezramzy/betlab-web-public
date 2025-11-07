"use client"

import { useQuery } from "@tanstack/react-query"
import { httpService } from "@/lib/core/services/http-service"
import type { PredictionType } from "@/lib/components/home"

export interface Prediction {
  fixtureId: number
  type: PredictionType
  confidence: "high" | "medium" | "low"
  value: string
  probability?: number
  edge?: number
  details?: any
}

interface UsePredictionsOptions {
  fixtureIds: number[]
  type: PredictionType
  enabled?: boolean
}

export function usePredictions({ fixtureIds, type, enabled = true }: UsePredictionsOptions) {
  return useQuery({
    queryKey: ["predictions", type, fixtureIds.join(",")],
    queryFn: async () => {
      if (fixtureIds.length === 0) return []

      // Backend uses /v1/matches/{match_id}/probabilities/1x2
      // No batch endpoint yet, so we fetch predictions individually
      // Limit to first 50 matches to get more predictions
      const matchIds = fixtureIds.slice(0, 50)

      try {
        // Fetch all predictions in parallel
        const predictions = await Promise.allSettled(
          matchIds.map(async (fixtureId) => {
            try {
              const response = await httpService.get<any>(
                `v1/matches/${fixtureId}/probabilities/1x2`
              )

              // Extract 1x2 probabilities
              const markets = response.markets || {}
              const homeProb = markets.home || 0
              const drawProb = markets.draw || 0
              const awayProb = markets.away || 0

              // Determine prediction based on highest probability
              let value = "Draw"
              let probability = drawProb
              let confidence: "high" | "medium" | "low" = "low"

              if (homeProb > drawProb && homeProb > awayProb) {
                value = "Home"
                probability = homeProb
              } else if (awayProb > drawProb && awayProb > homeProb) {
                value = "Away"
                probability = awayProb
              }

              // Confidence based on probability
              if (probability > 0.55) confidence = "high"
              else if (probability > 0.45) confidence = "medium"

              return {
                fixtureId,
                type: "1x2" as PredictionType,
                confidence,
                value,
                probability,
                edge: 0, // Could calculate from implied odds
                details: response,
              }
            } catch (error) {
              // If prediction fails for one match, continue with others
              console.warn(`Failed to fetch prediction for fixture ${fixtureId}`, error)
              return null
            }
          })
        )

        // Filter out failed requests and null values
        return predictions
          .filter((result): result is PromiseFulfilledResult<Prediction | null> =>
            result.status === "fulfilled" && result.value !== null
          )
          .map(result => result.value as Prediction)

      } catch (error) {
        console.error("Error fetching predictions:", error)
        return [] // Return empty array on error to not break the UI
      }
    },
    staleTime: 10 * 60 * 1000, // 10 min
    enabled: enabled && fixtureIds.length > 0,
    retry: 1, // Only retry once to avoid too many API calls
  })
}
