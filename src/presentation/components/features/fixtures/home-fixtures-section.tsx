import { headers } from "next/headers";
import { HomeFixturesClient } from "./home-fixtures.client";
import type { PredictionType } from "@/core/entities/predictions/prediction.entity";
import type { TeamChoicePick } from "@/core/entities/fixtures/fixture.entity";
import { container } from "@/presentation/di/container";

interface HomeFixturesSectionProps {
  asOf?: Date;
  predictionType?: PredictionType;
}

export async function HomeFixturesSection({
  asOf,
  predictionType,
}: HomeFixturesSectionProps = {}) {
  // Access dynamic data before using Date() to satisfy Next.js 16 requirements
  await headers();

  const fixturesService = container.createFixturesService();
  const matches = await fixturesService.getFixturesWithPredictions({
    date: asOf,
    predictionType,
  });

  let teamChoices: TeamChoicePick[] = [];
  try {
    teamChoices = await Promise.race([
      fixturesService.getTeamChoiceByDate({
        date: asOf,
        limit: 2,
      }),
      new Promise<TeamChoicePick[]>((resolve) => {
        setTimeout(() => resolve([]), 3500);
      }),
    ]);
  } catch {
    teamChoices = [];
  }

  return <HomeFixturesClient initialMatches={matches} initialTeamChoices={teamChoices} />;
}
