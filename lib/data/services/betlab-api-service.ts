/**
 * BetLab API Service
 * Basé sur lib/data/services/betlab_api_service.dart
 */

import { httpService } from '@/lib/core/services/http-service';
import { ApiConfig } from '@/lib/core/config/api-config';
import { SportType } from '@/lib/core/enums/sport-type';
import { Fixture, LiveFixture } from '@/lib/types/fixture';
import { PredictionsResponse } from '@/lib/types/prediction';

export class BetLabApiService {
  private static instance: BetLabApiService;

  private constructor() {}

  static getInstance(): BetLabApiService {
    if (!BetLabApiService.instance) {
      BetLabApiService.instance = new BetLabApiService();
    }
    return BetLabApiService.instance;
  }

  // Fixtures
  async getFixtures(sport?: SportType): Promise<Fixture[]> {
    const endpoint = ApiConfig.endpoints.fixtures;
    const params = sport ? { sport } : {};
    return httpService.get<Fixture[]>(endpoint, { params });
  }

  async getLiveFixtures(sport?: SportType): Promise<LiveFixture[]> {
    const endpoint = ApiConfig.endpoints.fixturesLive;
    const params = sport ? { sport } : {};
    return httpService.get<LiveFixture[]>(endpoint, { params });
  }

  async getFixturesByDate(date: string, leagueId?: number, sport?: SportType): Promise<Fixture[]> {
    const endpoint = ApiConfig.endpoints.fixtures;
    const params: Record<string, string | number> = { date };

    if (leagueId) {
      params.league = leagueId;
    }

    if (sport) {
      params.sport = sport;
    }

    return httpService.get<Fixture[]>(endpoint, { params });
  }

  async getPopularTodayFixtures(leagueId?: number, sport?: SportType): Promise<Fixture[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.getFixturesByDate(today, leagueId, sport);
  }

  async getFixtureById(fixtureId: number): Promise<Fixture> {
    const endpoint = `${ApiConfig.endpoints.fixtures}/${fixtureId}`;
    return httpService.get<Fixture>(endpoint);
  }

  // Predictions
  async getPredictions(fixtureId: number): Promise<PredictionsResponse> {
    const endpoint = ApiConfig.endpoints.predictions;
    return httpService.get<PredictionsResponse>(endpoint, {
      params: { fixture_id: fixtureId },
    });
  }

  async getBatchPredictions(fixtureIds: number[]): Promise<Record<number, PredictionsResponse>> {
    const promises = fixtureIds.map(async (id) => {
      const predictions = await this.getPredictions(id);
      return { id, predictions };
    });

    const results = await Promise.all(promises);

    return results.reduce((acc, { id, predictions }) => {
      acc[id] = predictions;
      return acc;
    }, {} as Record<number, PredictionsResponse>);
  }

  // Odds
  async getOdds(fixtureId: number): Promise<unknown> {
    const endpoint = ApiConfig.endpoints.odds;
    return httpService.get(endpoint, {
      params: { fixture_id: fixtureId },
    });
  }

  // Portfolio & Recommendations
  async getRecommendations(sport?: SportType): Promise<unknown> {
    const endpoint = ApiConfig.endpoints.portfolioRecommendations;
    const params = sport ? { sport } : {};
    return httpService.get(endpoint, { params });
  }

  async getMatchOpportunities(fixtureId: number): Promise<unknown> {
    const endpoint = `${ApiConfig.endpoints.portfolioMatchOpportunities}/${fixtureId}`;
    return httpService.get(endpoint);
  }

  // Teams
  async getTeams(): Promise<unknown> {
    const endpoint = ApiConfig.endpoints.teams;
    return httpService.get(endpoint);
  }

  // Standings
  async getStandings(leagueId: number, season: number): Promise<unknown> {
    const endpoint = ApiConfig.endpoints.standings;
    return httpService.get(endpoint, {
      params: { league: leagueId, season },
    });
  }

  // Metadata
  async getMetadata(): Promise<unknown> {
    const endpoint = ApiConfig.endpoints.metadata;
    return httpService.get(endpoint);
  }
}

export const betlabApiService = BetLabApiService.getInstance();
