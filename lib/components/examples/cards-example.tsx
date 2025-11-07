/**
 * Cards Example - Démonstration interactive des composants Cards BetLab
 *
 * Affiche tous les types de cartes avec données de test
 */
"use client"

import * as React from "react"
import { MatchCard, MatchCardCompact } from "@/lib/components/cards/match-card"
import { MatchCardSkeleton, MatchCardSkeletonCompact } from "@/lib/components/cards/match-card-skeleton"
import {
  Over15Card,
  BTTSCard,
  ExactScoreCard,
  HTFTCard,
  HalfCompareCard,
  CleanSheetCard,
  CornersCard,
  InternalProbabilitiesCard
} from "@/lib/components/cards/prediction-variants"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/lib/components/ui/tabs"

export function CardsExample() {
  const [favoriteMatches, setFavoriteMatches] = React.useState<Set<number>>(new Set([1]))

  // Mock data pour les matchs
  const mockMatches = [
    {
      id: 1,
      homeTeam: {
        name: "PSG",
        logo: "https://via.placeholder.com/48/0033A0/FFFFFF?text=PSG"
      },
      awayTeam: {
        name: "OM",
        logo: "https://via.placeholder.com/48/009BDF/FFFFFF?text=OM"
      },
      league: {
        name: "Ligue 1",
        logo: "https://via.placeholder.com/24/0033A0/FFFFFF?text=L1"
      },
      date: new Date().toISOString(),
      status: "live" as const,
      score: { home: 2, away: 1 }
    },
    {
      id: 2,
      homeTeam: {
        name: "Real Madrid",
        logo: "https://via.placeholder.com/48/FFFFFF/000000?text=RMA"
      },
      awayTeam: {
        name: "Barcelona",
        logo: "https://via.placeholder.com/48/A50044/FFFFFF?text=BAR"
      },
      league: {
        name: "La Liga",
        logo: "https://via.placeholder.com/24/FF6900/FFFFFF?text=LL"
      },
      date: new Date(Date.now() + 3600000).toISOString(),
      status: "scheduled" as const
    },
    {
      id: 3,
      homeTeam: {
        name: "Manchester United",
        logo: "https://via.placeholder.com/48/DA291C/FFFFFF?text=MUN"
      },
      awayTeam: {
        name: "Liverpool",
        logo: "https://via.placeholder.com/48/C8102E/FFFFFF?text=LIV"
      },
      league: {
        name: "Premier League",
        logo: "https://via.placeholder.com/24/3D195B/FFFFFF?text=PL"
      },
      date: new Date(Date.now() - 7200000).toISOString(),
      status: "finished" as const,
      score: { home: 0, away: 2 }
    }
  ]

  const mockPrediction = {
    type: "Over/Under 1.5",
    value: "Over 1.5",
    confidence: "high" as const,
    edge: 12.5
  }

  const toggleFavorite = (matchId: number) => {
    setFavoriteMatches(prev => {
      const newSet = new Set(prev)
      if (newSet.has(matchId)) {
        newSet.delete(matchId)
      } else {
        newSet.add(matchId)
      }
      return newSet
    })
  }

  return (
    <div className="w-full space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold">BetLab Cards - Démonstration</h1>
        <p className="mt-2 text-muted-foreground">
          Composants de cartes pour les matchs et prédictions
        </p>
      </div>

      <Tabs defaultValue="match-cards" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="match-cards">Match Cards</TabsTrigger>
          <TabsTrigger value="prediction-cards">Prediction Cards</TabsTrigger>
          <TabsTrigger value="skeletons">Skeletons</TabsTrigger>
        </TabsList>

        {/* Match Cards Tab */}
        <TabsContent value="match-cards" className="space-y-6">
          <div>
            <h2 className="mb-4 text-xl font-semibold">MatchCard - Default</h2>
            <div className="space-y-4">
              {mockMatches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  prediction={mockPrediction}
                  isFavorite={favoriteMatches.has(match.id)}
                  onToggleFavorite={() => toggleFavorite(match.id)}
                  onClick={() => console.log(`Match ${match.id} clicked`)}
                />
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold">MatchCard - Compact</h2>
            <div className="space-y-3">
              {mockMatches.map((match) => (
                <MatchCardCompact
                  key={match.id}
                  match={match}
                  prediction={mockPrediction}
                  isFavorite={favoriteMatches.has(match.id)}
                  onToggleFavorite={() => toggleFavorite(match.id)}
                  onClick={() => console.log(`Match ${match.id} clicked`)}
                />
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold">MatchCard - Sans prédiction</h2>
            <MatchCard
              match={mockMatches[0]}
              isFavorite={favoriteMatches.has(mockMatches[0].id)}
              onToggleFavorite={() => toggleFavorite(mockMatches[0].id)}
            />
          </div>
        </TabsContent>

        {/* Prediction Cards Tab */}
        <TabsContent value="prediction-cards" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-3 text-lg font-semibold">Over/Under 1.5</h3>
              <Over15Card
                confidence="high"
                edge={15.2}
                value="Over 1.5"
                overProbability={68}
                underProbability={32}
                averageGoals={2.8}
                lastMatches={{ over15: 7, total: 10 }}
                updatedAt={new Date(Date.now() - 300000)}
                onCTAClick={() => console.log("Over15 CTA clicked")}
              />
            </div>

            <div>
              <h3 className="mb-3 text-lg font-semibold">Both Teams To Score</h3>
              <BTTSCard
                confidence="medium"
                edge={8.5}
                value="BTTS Oui"
                bttsYesProbability={62}
                bttsNoProbability={38}
                homeGoalsAvg={1.8}
                awayGoalsAvg={1.5}
                updatedAt={new Date(Date.now() - 600000)}
              />
            </div>

            <div>
              <h3 className="mb-3 text-lg font-semibold">Score Exact</h3>
              <ExactScoreCard
                confidence="medium"
                edge={10.2}
                value="2-1"
                topScores={[
                  { score: "2-1", probability: 18 },
                  { score: "1-1", probability: 15 },
                  { score: "2-0", probability: 12 },
                  { score: "1-0", probability: 10 }
                ]}
                updatedAt={new Date(Date.now() - 180000)}
              />
            </div>

            <div>
              <h3 className="mb-3 text-lg font-semibold">Mi-Temps / Temps Plein</h3>
              <HTFTCard
                confidence="high"
                edge={12.8}
                value="Domicile/Domicile"
                predictions={[
                  { label: "Domicile / Domicile", probability: 45 },
                  { label: "Nul / Domicile", probability: 22 },
                  { label: "Domicile / Nul", probability: 18 },
                  { label: "Nul / Nul", probability: 15 }
                ]}
                updatedAt={new Date(Date.now() - 420000)}
              />
            </div>

            <div>
              <h3 className="mb-3 text-lg font-semibold">Comparaison Mi-Temps</h3>
              <HalfCompareCard
                confidence="medium"
                edge={7.5}
                value="2ème mi-temps"
                firstHalfGoals={1.2}
                secondHalfGoals={1.8}
                moreGoalsIn="second"
                probability={65}
                updatedAt={new Date(Date.now() - 900000)}
              />
            </div>

            <div>
              <h3 className="mb-3 text-lg font-semibold">Clean Sheet</h3>
              <CleanSheetCard
                confidence="low"
                edge={5.2}
                value="Domicile"
                homeCleanSheetProb={35}
                awayCleanSheetProb={28}
                homeDefenseRating={7.5}
                awayDefenseRating={6.8}
                updatedAt={new Date(Date.now() - 1200000)}
              />
            </div>

            <div>
              <h3 className="mb-3 text-lg font-semibold">Corners</h3>
              <CornersCard
                confidence="high"
                edge={14.2}
                value="Over 8.5"
                totalCornersAvg={10.5}
                over85Probability={72}
                homeAvg={5.8}
                awayAvg={4.7}
                updatedAt={new Date(Date.now() - 240000)}
              />
            </div>

            <div>
              <h3 className="mb-3 text-lg font-semibold">Probabilités Internes</h3>
              <InternalProbabilitiesCard
                confidence="high"
                edge={11.5}
                value="Victoire Domicile"
                homeWin={55}
                draw={25}
                awayWin={20}
                updatedAt={new Date(Date.now() - 360000)}
                gradient
              />
            </div>
          </div>
        </TabsContent>

        {/* Skeletons Tab */}
        <TabsContent value="skeletons" className="space-y-6">
          <div>
            <h2 className="mb-4 text-xl font-semibold">MatchCardSkeleton - Default</h2>
            <div className="space-y-4">
              <MatchCardSkeleton />
              <MatchCardSkeleton />
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold">MatchCardSkeleton - Compact</h2>
            <div className="space-y-3">
              <MatchCardSkeletonCompact />
              <MatchCardSkeletonCompact />
              <MatchCardSkeletonCompact />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
