import "server-only";
import { cache } from "react";
import { cacheLife, cacheTag } from "next/cache";
import { env } from "@/core/config/env";
import {
  transform1X2ToPrediction,
  transformMarketsToOverUnder,
  transformMarketsToBTTS,
  transformMarketsToCorrectScore,
  transformMarketsToDrawNoBet,
  transformMarketsToAsianHandicap,
  transformMarketsToDoubleChance,
  type PredictionData,
  type API1X2Response,
  type APIMarketsResponse,
  type APIOddsResponse,
} from "@/shared/hooks/use-predictions-transforms";
import { PREDICTIONS_CACHE } from "../cache/profile";

export type PredictionType =
  | "match_result"
  | "over_under"
  | "both_teams_score"
  | "correct_score"
  | "double_chance"
  | "draw_no_bet"
  | "asian_handicap"
  | "half_time"
  | "corners"
  | "first_goal";

function getEndpointForType(type: PredictionType): "1x2" | "markets" {
  return type === "match_result" ? "1x2" : "markets";
}

async function fetchSinglePrediction(
  fixtureId: number,
  type: PredictionType
): Promise<PredictionData | null> {
  const endpoint = getEndpointForType(type);
  const baseUrl = env.NEXT_PUBLIC_API_BASE_URL;

  try {
    const [predictionResponse, oddsResponse] = await Promise.allSettled([
      endpoint === "1x2"
        ? fetch(`${baseUrl}/v1/matches/${fixtureId}/probabilities/1x2`, {
            cache: "force-cache",
          })
        : fetch(`${baseUrl}/v1/matches/${fixtureId}/probabilities/markets`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              model: "poisson",
              cap: 10,
              include_scores_top: 10,
            }),
            cache: "force-cache",
          }),
      fetch(`${baseUrl}/v1/matches/${fixtureId}/odds`, { cache: "force-cache" }),
    ]);

    if (predictionResponse.status === "rejected") {
      console.warn(`Failed to fetch predictions for ${fixtureId}:`, predictionResponse.reason);
      return null;
    }

    const predictionRes = predictionResponse.value;
    if (!predictionRes.ok) {
      console.warn(`Failed to fetch predictions for ${fixtureId}:`, predictionRes.statusText);
      return null;
    }

    const predictions =
      endpoint === "1x2"
        ? ((await predictionRes.json()) as API1X2Response)
        : ((await predictionRes.json()) as APIMarketsResponse);

    const odds =
      oddsResponse.status === "fulfilled" && oddsResponse.value.ok
        ? ((await oddsResponse.value.json()) as APIOddsResponse)
        : null;

    switch (type) {
      case "match_result":
        return transform1X2ToPrediction(predictions as API1X2Response, odds, fixtureId);
      case "over_under":
        return transformMarketsToOverUnder(predictions as APIMarketsResponse, odds, fixtureId);
      case "both_teams_score":
        return transformMarketsToBTTS(predictions as APIMarketsResponse, odds, fixtureId);
      case "correct_score":
        return transformMarketsToCorrectScore(predictions as APIMarketsResponse, fixtureId);
      case "draw_no_bet":
        return transformMarketsToDrawNoBet(predictions as APIMarketsResponse, odds, fixtureId);
      case "asian_handicap":
        return transformMarketsToAsianHandicap(predictions as APIMarketsResponse, odds, fixtureId);
      case "double_chance":
        return transformMarketsToDoubleChance(predictions as APIMarketsResponse, fixtureId);
      case "half_time":
      case "corners":
      case "first_goal":
        console.warn(
          `Prediction type "${type}" not yet implemented, falling back to match_result`
        );
        if (endpoint === "1x2") {
          return transform1X2ToPrediction(predictions as API1X2Response, odds, fixtureId);
        }
        const marketsPredictions = predictions as APIMarketsResponse;
        const fake1x2: API1X2Response = {
          generated_at: new Date().toISOString(),
          model_version: "ensemble-1.0.0",
          inputs: {
            match_id: String(fixtureId),
            home_team: "",
            away_team: "",
            kickoff_utc: null,
            mu_home: marketsPredictions.inputs.mu_home,
            mu_away: marketsPredictions.inputs.mu_away,
          },
          markets: marketsPredictions.oneXtwo,
          implied_odds: {
            home: 1 / marketsPredictions.oneXtwo.home,
            draw: 1 / marketsPredictions.oneXtwo.draw,
            away: 1 / marketsPredictions.oneXtwo.away,
          },
        };
        return transform1X2ToPrediction(fake1x2, odds, fixtureId);
      default:
        throw new Error(`Unknown prediction type: ${type}`);
    }
  } catch (error) {
    console.warn(`Failed to fetch prediction for fixture ${fixtureId}:`, error);
    return null;
  }
}

export const getPredictions = cache(
  async (fixtureIds: number[], type: PredictionType): Promise<PredictionData[]> => {
    'use cache';
    if (fixtureIds.length === 0) return [];

    const matchIds = fixtureIds.slice(0, 50);
    const uniqueFixtures = [...new Set(matchIds)];
    uniqueFixtures.forEach((id) => cacheTag(PREDICTIONS_CACHE.tags.byFixture(id)));
    cacheLife(PREDICTIONS_CACHE.life.default);

    try {
      const predictions = await Promise.allSettled(
        matchIds.map((fixtureId) => fetchSinglePrediction(fixtureId, type))
      );

      return predictions
        .filter(
          (result): result is PromiseFulfilledResult<PredictionData> =>
            result.status === "fulfilled" && result.value !== null
        )
        .map((result) => result.value);
    } catch (error) {
      console.error("Error fetching predictions:", error);
      return [];
    }
  }
);

export const getPrediction = cache(
  async (fixtureId: number, type: PredictionType): Promise<PredictionData | null> => {
    'use cache';
    cacheTag(PREDICTIONS_CACHE.tags.byFixture(fixtureId));
    cacheLife(PREDICTIONS_CACHE.life.default);
    return fetchSinglePrediction(fixtureId, type);
  }
);

export type { PredictionData };
