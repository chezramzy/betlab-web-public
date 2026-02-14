"use client"

import React, { useMemo } from "react"
import { ChevronRight } from "lucide-react"
import { cn } from "@/shared/utils"
import { MatchCardVM, formatBestMarketPercent } from "@/application/view-models/fixtures/match-card.vm"
import NextLink from "next/link"

// ─── Quality Constants ─────────────────────────────────────────────────────
const MIN_PROB = 0.55                                        // Aligned with backend select_best_market
const MIN_EDGE = 0.02                                        // Minimum edge for curated picks
const MAX_PICKS = 2                                          // Number of picks to show
const EXCLUDED_SOURCES = new Set(["fallback_1x2"])           // Never show fabricated picks in Élite

// ─── Scoring ───────────────────────────────────────────────────────────────

function pickScore(bm: NonNullable<MatchCardVM["bestMarket"]>): number {
    const prob = bm.prob
    const edge = bm.edge ?? 0
    const sourceBonus = bm.source === "curated" ? 0.10 : bm.source === "opportunity" ? 0.05 : 0
    // Composite: prob dominates (60%), edge contributes (30%), source quality (10%)
    return prob * 0.60 + edge * 0.30 + sourceBonus
}

// ─── Component ─────────────────────────────────────────────────────────────

interface TeamChoiceSectionProps {
    matches: MatchCardVM[]
}

export function TeamChoiceSection({ matches }: TeamChoiceSectionProps) {
    const topPicks = useMemo(() => {
        return matches
            .filter((m) => {
                if (!m.bestMarket || m.status !== "scheduled") return false
                // Quality gate 1: exclude fabricated fallback picks
                if (EXCLUDED_SOURCES.has(m.bestMarket.source)) return false
                // Quality gate 2: minimum probability threshold
                if (m.bestMarket.prob < MIN_PROB) return false
                // Quality gate 3: curated picks must have minimum edge (if edge available)
                if (m.bestMarket.source === "curated" && m.bestMarket.edge !== undefined && m.bestMarket.edge < MIN_EDGE) return false
                return true
            })
            .sort((a, b) => pickScore(b.bestMarket!) - pickScore(a.bestMarket!))
            .slice(0, MAX_PICKS)
    }, [matches])

    if (topPicks.length === 0) return null
    const isEuropeanHandicapLabel = (label: string) =>
        /\(\d+\s*:\s*\d+\)\s*(v1|v2|x)/i.test(label)

    return (
        <div className="space-y-6 pt-6">
            {/* Elegant Section Header */}
            <div className="flex items-center justify-between px-2 sm:px-0">
                <div className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-lime rounded-full" />
                    <div>
                        <h2 className="text-[14px] font-black text-navy uppercase tracking-[0.2em] leading-none mb-1">
                            L'Élite du Jour
                        </h2>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                            Sélections Stratégiques
                        </span>
                    </div>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-lime animate-pulse" />
                    <span className="text-[9px] font-black text-navy uppercase tracking-tight">Algorithme v2.1</span>
                </div>
            </div>

            {/* Vertical List / Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topPicks.map((match) => (
                    <NextLink
                        key={match.id}
                        href={`/match/${match.id}`}
                        className={cn(
                            "group relative flex flex-col overflow-hidden rounded-[2rem] transition-all duration-500",
                            "bg-white border border-gray-100",
                            "shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)]",
                            "hover:border-lime/30 hover:-translate-y-1"
                        )}
                    >
                        <div className="p-6 flex flex-col h-full relative z-10">
                            {/* Header: League & Confidence */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-7 h-7 rounded-xl bg-gray-50 flex items-center justify-center p-1.5 border border-gray-100">
                                        <img src={match.league.logo} alt="" className="w-full h-full object-contain opacity-60 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        {match.league.name}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime text-navy text-[11px] font-black shadow-[0_4px_12px_rgba(184,204,58,0.2)]">
                                    {formatBestMarketPercent(match.bestMarket?.prob)}
                                </div>
                            </div>

                            {/* Teams + Proposition */}
                            <div className="mb-3 space-y-3">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <img src={match.home.logo} alt="" className="w-5 h-5 object-contain" />
                                        <span className="text-xs font-black text-navy-950 truncate leading-none dark:text-white">
                                            {match.home.name}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <img src={match.away.logo} alt="" className="w-5 h-5 object-contain" />
                                        <span className="text-xs font-black text-navy-950 truncate leading-none dark:text-white">
                                            {match.away.name}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1 px-3 py-2 rounded-xl bg-lime-50 border border-lime-200/50 group-hover:bg-lime/20 dark:bg-lime-900/10 dark:border-lime-800/20 transition-colors">
                                    <span className="text-[8px] font-black text-lime-700 uppercase tracking-widest dark:text-lime-400">
                                        {isEuropeanHandicapLabel(match.bestMarket?.label || "")
                                            ? "Handicap européen"
                                            : "Proposition du jour"}
                                    </span>
                                    <span className="text-[11px] font-black uppercase leading-tight text-navy-950 dark:text-white text-balance line-clamp-2">
                                        {match.bestMarket?.label}
                                    </span>
                                    <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-navy transition-colors group-hover:bg-navy-900">
                                        <span className="text-[11px] font-black uppercase text-white leading-none">
                                            {match.bestMarket?.label}
                                        </span>
                                        <ChevronRight className="w-3.5 h-3.5 text-lime opacity-0 translate-x-[-4px] group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Subtle Underline Accent */}
                        <div className="h-1 w-full bg-transparent group-hover:bg-lime/20 transition-colors" />
                    </NextLink>
                ))}
            </div>
        </div>
    )
}
