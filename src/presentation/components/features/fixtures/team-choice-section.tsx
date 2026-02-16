"use client";

import { useMemo } from "react";
import { ChevronRight } from "lucide-react";
import NextLink from "next/link";

import type { TeamChoicePick } from "@/core/entities/fixtures/fixture.entity";
import { MatchCardVM, formatBestMarketPercent } from "@/application/view-models/fixtures/match-card.vm";
import { formatTeamChoiceLabel } from "@/application/view-models/fixtures/team-choice-label.fr";
import { cn } from "@/shared/utils";

const MIN_PROB = 0.55;
const MIN_EDGE = 0.02;
const MAX_PICKS = 2;
const EXCLUDED_SOURCES = new Set(["fallback_1x2"]);

function pickScore(bm: NonNullable<MatchCardVM["bestMarket"]>): number {
  const prob = bm.prob;
  const edge = bm.edge ?? 0;
  const sourceBonus = bm.source === "curated" ? 0.1 : bm.source === "opportunity" ? 0.05 : 0;
  return prob * 0.6 + edge * 0.3 + sourceBonus;
}

type RenderPick = {
  id: string;
  href: string;
  leagueName: string;
  leagueLogo: string;
  homeName: string;
  homeLogo: string;
  awayName: string;
  awayLogo: string;
  label: string;
  prob: number;
  summary?: string;
  source: "external_ai" | "fallback_internal" | "internal";
};

function isEuropeanHandicapLabel(label: string) {
  return /\(\d+\s*:\s*\d+\)\s*(v1|v2|x)/i.test(label);
}

interface TeamChoiceSectionProps {
  matches: MatchCardVM[];
  teamChoices?: TeamChoicePick[];
}

export function TeamChoiceSection({ matches, teamChoices = [] }: TeamChoiceSectionProps) {
  const aiPicks = useMemo<RenderPick[]>(() => {
    if (!teamChoices.length) return [];
    return teamChoices
      .slice(0, MAX_PICKS)
      .map((pick) => {
        const label = formatTeamChoiceLabel({
          recommendedMarket: pick.recommendedMarket,
          selection: pick.selection,
          homeName: pick.homeTeam.name,
          awayName: pick.awayTeam.name,
          teamName: pick.teamName,
        });
        return {
          id: String(pick.fixtureId),
          href: `/match/${pick.fixtureId}`,
          leagueName: pick.league.name,
          leagueLogo: pick.league.logo || "/globe.svg",
          homeName: pick.homeTeam.name,
          homeLogo: pick.homeTeam.logo || "/icon-32.png",
          awayName: pick.awayTeam.name,
          awayLogo: pick.awayTeam.logo || "/icon-32.png",
          label,
          prob: pick.confidence,
          summary: pick.summary,
          source: pick.source,
        };
      });
  }, [teamChoices]);

  const fallbackPicks = useMemo<RenderPick[]>(() => {
    return matches
      .filter((m) => {
        if (!m.bestMarket || m.status !== "scheduled") return false;
        if (EXCLUDED_SOURCES.has(m.bestMarket.source)) return false;
        if (m.bestMarket.prob < MIN_PROB) return false;
        if (m.bestMarket.source === "curated" && m.bestMarket.edge !== undefined && m.bestMarket.edge < MIN_EDGE) {
          return false;
        }
        return true;
      })
      .sort((a, b) => pickScore(b.bestMarket!) - pickScore(a.bestMarket!))
      .slice(0, MAX_PICKS)
      .map((match) => ({
        id: match.id,
        href: `/match/${match.id}`,
        leagueName: match.league.name,
        leagueLogo: match.league.logo,
        homeName: match.home.name,
        homeLogo: match.home.logo,
        awayName: match.away.name,
        awayLogo: match.away.logo,
        label: match.bestMarket?.label || "Proposition",
        prob: match.bestMarket?.prob || 0,
        source: "internal",
      }));
  }, [matches]);

  const picks = aiPicks.length > 0 ? aiPicks : fallbackPicks;
  if (!picks.length) return null;

  const usingExternalAI = aiPicks.length > 0;

  return (
    <div className="space-y-6 pt-6">
      <div className="flex items-center justify-between px-2 sm:px-0">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-lime rounded-full" />
          <div>
            <h2 className="text-[14px] font-black text-navy uppercase tracking-[0.2em] leading-none mb-1">
              L&apos;Elite du Jour
            </h2>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
              Selections Strategiques
            </span>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-100">
          <span className="w-1.5 h-1.5 rounded-full bg-lime animate-pulse" />
          <span className="text-[9px] font-black text-navy uppercase tracking-tight">
            {usingExternalAI ? "IA Externe + BetLab" : "Algorithme v2.1"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {picks.map((pick) => (
          <NextLink
            key={pick.id}
            href={pick.href}
            className={cn(
              "group relative flex flex-col overflow-hidden rounded-[2rem] transition-all duration-500",
              "bg-white border border-gray-100",
              "shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)]",
              "hover:border-lime/30 hover:-translate-y-1"
            )}
          >
            <div className="p-6 flex flex-col h-full relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-xl bg-gray-50 flex items-center justify-center p-1.5 border border-gray-100">
                    <img src={pick.leagueLogo} alt="" className="w-full h-full object-contain opacity-60 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    {pick.leagueName}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime text-navy text-[11px] font-black shadow-[0_4px_12px_rgba(184,204,58,0.2)]">
                  {formatBestMarketPercent(pick.prob)}
                </div>
              </div>

              <div className="mb-3 space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <img src={pick.homeLogo} alt="" className="w-5 h-5 object-contain" />
                    <span className="text-xs font-black text-navy-950 truncate leading-none dark:text-white">
                      {pick.homeName}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <img src={pick.awayLogo} alt="" className="w-5 h-5 object-contain" />
                    <span className="text-xs font-black text-navy-950 truncate leading-none dark:text-white">
                      {pick.awayName}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1 px-3 py-2 rounded-xl bg-lime-50 border border-lime-200/50 group-hover:bg-lime/20 dark:bg-lime-900/10 dark:border-lime-800/20 transition-colors">
                  <span className="text-[8px] font-black text-lime-700 uppercase tracking-widest dark:text-lime-400">
                    {isEuropeanHandicapLabel(pick.label) ? "Handicap europeen" : "Proposition du jour"}
                  </span>
                  <span className="text-[11px] font-black uppercase leading-tight text-navy-950 dark:text-white text-balance line-clamp-2">
                    {pick.label}
                  </span>
                  {pick.summary && (
                    <p className="text-[10px] leading-tight text-gray-600 line-clamp-2">
                      {pick.summary}
                    </p>
                  )}
                  <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-navy transition-colors group-hover:bg-navy-900">
                    <span className="text-[11px] font-black uppercase text-white leading-none">
                      {pick.label}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-lime opacity-0 translate-x-[-4px] group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </div>
                </div>
              </div>
            </div>
            <div className="h-1 w-full bg-transparent group-hover:bg-lime/20 transition-colors" />
          </NextLink>
        ))}
      </div>
    </div>
  );
}
