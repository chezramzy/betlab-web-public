"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface Match {
  homeTeam: { name: string; logo: string };
  awayTeam: { name: string; logo: string };
  league: { name: string; logo: string };
}

export default function TestLogosPage() {
  const [match, setMatch] = useState<Match | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("https://fastapi-production-2b94.up.railway.app/v1/web/matches/daily?date=2025-11-22")
      .then((res) => res.json())
      .then((data) => {
        if (data.matches && data.matches.length > 0) {
          setMatch(data.matches[0]);
        } else {
          setError("No matches found");
        }
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  const handleImageError = (key: string, error: any) => {
    setImageErrors(prev => ({ ...prev, [key]: error.toString() }));
  };

  if (error) {
    return <div className="p-8">Error: {error}</div>;
  }

  if (!match) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">Test Logos Loading</h1>

      <div className="space-y-4">
        <div className="p-4 border rounded">
          <h2 className="font-semibold mb-2">Home Team: {match.homeTeam.name}</h2>
          <p className="text-sm mb-2">URL: {match.homeTeam.logo}</p>

          <div className="space-y-4">
            <div>
              <p className="text-xs mb-1">Next.js Image (optimized):</p>
              <Image
                src={match.homeTeam.logo}
                alt={match.homeTeam.name}
                width={48}
                height={48}
                className="border"
                onError={(e) => handleImageError("home-optimized", e)}
              />
              {imageErrors["home-optimized"] && (
                <p className="text-red-500 text-xs mt-1">Error: {imageErrors["home-optimized"]}</p>
              )}
            </div>

            <div>
              <p className="text-xs mb-1">Regular img tag:</p>
              <img
                src={match.homeTeam.logo}
                alt={match.homeTeam.name}
                width={48}
                height={48}
                className="border"
                onError={(e) => handleImageError("home-regular", e)}
              />
              {imageErrors["home-regular"] && (
                <p className="text-red-500 text-xs mt-1">Error: {imageErrors["home-regular"]}</p>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold mb-2">Away Team: {match.awayTeam.name}</h2>
          <p className="text-sm mb-2">URL: {match.awayTeam.logo}</p>

          <div className="space-y-4">
            <div>
              <p className="text-xs mb-1">Next.js Image (optimized):</p>
              <Image
                src={match.awayTeam.logo}
                alt={match.awayTeam.name}
                width={48}
                height={48}
                className="border"
                onError={(e) => handleImageError("away-optimized", e)}
              />
              {imageErrors["away-optimized"] && (
                <p className="text-red-500 text-xs mt-1">Error: {imageErrors["away-optimized"]}</p>
              )}
            </div>

            <div>
              <p className="text-xs mb-1">Regular img tag:</p>
              <img
                src={match.awayTeam.logo}
                alt={match.awayTeam.name}
                width={48}
                height={48}
                className="border"
                onError={(e) => handleImageError("away-regular", e)}
              />
              {imageErrors["away-regular"] && (
                <p className="text-red-500 text-xs mt-1">Error: {imageErrors["away-regular"]}</p>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold mb-2">League: {match.league.name}</h2>
          <p className="text-sm mb-2">URL: {match.league.logo}</p>

          <div className="space-y-4">
            <div>
              <p className="text-xs mb-1">Next.js Image (optimized):</p>
              <Image
                src={match.league.logo}
                alt={match.league.name}
                width={48}
                height={48}
                className="border"
                onError={(e) => handleImageError("league-optimized", e)}
              />
              {imageErrors["league-optimized"] && (
                <p className="text-red-500 text-xs mt-1">Error: {imageErrors["league-optimized"]}</p>
              )}
            </div>

            <div>
              <p className="text-xs mb-1">Regular img tag:</p>
              <img
                src={match.league.logo}
                alt={match.league.name}
                width={48}
                height={48}
                className="border"
                onError={(e) => handleImageError("league-regular", e)}
              />
              {imageErrors["league-regular"] && (
                <p className="text-red-500 text-xs mt-1">Error: {imageErrors["league-regular"]}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">Debug Info</h3>
        <pre className="text-xs overflow-auto">{JSON.stringify({
          match: {
            homeTeam: match.homeTeam,
            awayTeam: match.awayTeam,
            league: match.league,
          },
          imageErrors,
        }, null, 2)}</pre>
      </div>
    </div>
  );
}
