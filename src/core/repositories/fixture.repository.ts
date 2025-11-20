import type { Match, MatchWithPrediction } from "@/core/entities/fixtures/fixture.entity";

export interface IFixtureRepository {
  findByDate(date: string): Promise<Match[]>;
  findLive(): Promise<Match[]>;
  /**
   * Fetch fixtures with predictions in one optimized call
   * This uses the /v1/web/matches/daily endpoint from betlab-api
   */
  findByDateWithPredictions(date: string): Promise<MatchWithPrediction[]>;
}
