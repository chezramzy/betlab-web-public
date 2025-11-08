
import { HomeFixturesClient } from "./home-fixtures.client";
import { getTodayFixturesWithPredictions } from "@/modules/fixtures/server/queries";
import type { PredictionType } from "@/modules/predictions/domain/types";

interface HomeFixturesSectionProps {
  asOf?: Date;
  predictionType?: PredictionType;
}

export async function HomeFixturesSection({ asOf, predictionType }: HomeFixturesSectionProps = {}) {
  const matches = await getTodayFixturesWithPredictions({
    date: asOf,
    type: predictionType,
  });
  return <HomeFixturesClient initialMatches={matches} />;
}
