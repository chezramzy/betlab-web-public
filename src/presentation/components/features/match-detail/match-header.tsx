"use client"

import { Heart, ShieldCheck } from "lucide-react"
import Image from "next/image"
import { cn } from "@/shared/utils"
import type { MatchDetail } from "@/core/entities/match-detail/match-detail.entity"
import type { MatchResultPrediction } from "@/core/entities/predictions/prediction.entity"
import type { MatchDetailVM } from "@/application/view-models/match-detail/match-detail.vm"
import { getMatchConfidence, getMatchPrediction } from "@/application/view-models/match-detail/match-detail.selectors"

interface MatchHeaderProps {
  match: MatchDetail
  vm?: MatchDetailVM
}

/**
 * Header sticky premium du match — gradient navy avec impact visuel
 * Mobile-first avec touch targets >= 44px
 */
export function MatchHeader({ match, vm }: MatchHeaderProps) {
  const isLive = match.status === "live"
  const isFinished = match.status === "finished"
  const isScheduled = match.status === "scheduled"
  const leagueLogo = (match.league.logo || "").trim() || "/globe.svg"
  const homeLogo = (match.homeTeam.logo || "").trim() || "/icon-32.png"
  const awayLogo = (match.awayTeam.logo || "").trim() || "/icon-32.png"

  const mainPrediction = getMatchPrediction(match)
  const confidence = vm?.header.confidence ?? getMatchConfidence(match, mainPrediction ?? undefined)

  return (
    <div className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
      {/* Safe area pour iOS notch */}
      <div className="h-[env(safe-area-inset-top)]" />

      <div className="container mx-auto px-4 py-4 flex flex-col gap-6">
        {/* League Info + Favorite */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative w-5 h-5">
              <Image
                src={leagueLogo}
                alt={match.league.name}
                fill
                className="object-contain opacity-60"
                sizes="20px"
              />
            </div>
            <span className="text-[10px] text-[#003366]/40 font-bold uppercase tracking-[0.2em]">
              {match.league.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-[#003366]/30 active:text-red-500 transition-colors"
            >
              <Heart className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Teams & Score Section */}
        <div className="flex items-center justify-between px-2">
          {/* Home Team */}
          <div className="flex flex-col items-center gap-3 flex-1">
            <div className="relative w-16 h-16 rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-100">
              <Image
                src={homeLogo}
                alt={match.homeTeam.name}
                fill
                className="object-contain p-1.5"
                sizes="64px"
                priority
              />
            </div>
            <span className="text-xs font-black text-[#003366] text-center leading-[1.1] max-w-[100px] uppercase tracking-tight">
              {match.homeTeam.name}
            </span>
          </div>

          {/* Center: Score or Time */}
          <div className="flex flex-col items-center justify-center min-w-[80px]">
            {isLive && (
              <div className="mb-2">
                <LiveBadge elapsed={match.elapsed} />
              </div>
            )}

            <div className="flex items-center gap-3">
              {isScheduled ? (
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-black text-[#003366] tracking-tighter tabular-nums">
                    {match.kickoffTime.getHours().toString().padStart(2, "0")}:
                    {match.kickoffTime.getMinutes().toString().padStart(2, "0")}
                  </span>
                  <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Aujourd'hui</span>
                </div>
              ) : (
                <>
                  <span className="text-4xl font-black text-[#003366] tabular-nums">
                    {match.score?.home ?? 0}
                  </span>
                  <span className="text-xl font-bold text-slate-200">-</span>
                  <span className="text-4xl font-black text-[#003366] tabular-nums">
                    {match.score?.away ?? 0}
                  </span>
                </>
              )}
            </div>

            {isFinished && (
              <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-2">Terminé</span>
            )}
          </div>

          {/* Away Team */}
          <div className="flex flex-col items-center gap-3 flex-1">
            <div className="relative w-16 h-16 rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-100">
              <Image
                src={awayLogo}
                alt={match.awayTeam.name}
                fill
                className="object-contain p-1.5"
                sizes="64px"
                priority
              />
            </div>
            <span className="text-xs font-black text-[#003366] text-center leading-[1.1] max-w-[100px] uppercase tracking-tight">
              {match.awayTeam.name}
            </span>
          </div>
        </div>

        {/* Bottom Metadata */}
        <div className="flex items-center justify-center gap-4 border-t border-slate-50 pt-4 pb-1">
          <div className="flex items-center gap-1.5">
            <div className="w-1 h-1 rounded-full bg-[#B8CC3A]" />
            <span className="text-[9px] font-black text-[#003366]/60 uppercase tracking-wider">{match.venue || "Stade Principal"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1 h-1 rounded-full bg-[#B8CC3A]" />
            <span className="text-[9px] font-black text-[#003366]/60 uppercase tracking-wider">{match.referee || "Arbitre Elite"}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function LiveBadge({ elapsed }: { elapsed?: number }) {
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-red-500/90 backdrop-blur-md rounded-full animate-pulse shadow-lg mb-1">
      <div className="w-1.5 h-1.5 bg-white rounded-full" />
      <span className="text-[10px] font-bold text-white uppercase tracking-wider leading-none">
        {elapsed ? `${elapsed}'` : "Live"}
      </span>
    </div>
  )
}

interface ScoreDisplayProps {
  homeScore: number
  awayScore: number
  isLive?: boolean
}

function ScoreDisplay({ homeScore, awayScore, isLive }: ScoreDisplayProps) {
  return (
    <div className={cn("flex items-center gap-4", isLive ? "scale-110" : "")}>
      <span className="text-5xl font-black text-white tabular-nums drop-shadow-lg">{homeScore}</span>
      <span className="text-xl font-medium text-white/20">-</span>
      <span className="text-5xl font-black text-white tabular-nums drop-shadow-lg">{awayScore}</span>
    </div>
  )
}

interface KickoffTimeProps {
  time: Date
}

function KickoffTime({ time }: KickoffTimeProps) {
  const hours = time.getHours().toString().padStart(2, "0")
  const minutes = time.getMinutes().toString().padStart(2, "0")

  return (
    <div className="flex flex-col items-center gap-0.5 bg-white/5 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/5">
      <span className="text-3xl font-black text-white tabular-nums tracking-tight">
        {hours}:{minutes}
      </span>
      <span className="text-[10px] text-white/60 font-medium uppercase tracking-wider">
        {time.toLocaleDateString("fr-FR", {
          weekday: "short",
          day: "numeric",
          month: "short",
        })}
      </span>
    </div>
  )
}
