"use client"

import { ShieldCheck, TrendingUp } from "lucide-react"
import { cn } from "@/shared/utils"
import type { MatchDetailVM } from "@/application/view-models/match-detail/match-detail.vm"

interface PredictionHeroProps {
    vm: MatchDetailVM
}

export function PredictionHero({ vm }: PredictionHeroProps) {
    const { bestMarket } = vm
    if (!bestMarket) return null

    return (
        <div className="px-4 py-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col gap-6 relative overflow-hidden">
                {/* Background Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#B8CC3A]/5 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />

                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-[#003366] flex items-center justify-center shadow-lg shadow-[#003366]/20">
                            <ShieldCheck className="w-5 h-5 text-[#B8CC3A]" />
                        </div>
                        <span className="text-xs font-bold text-[#003366] uppercase tracking-wider">
                            Prono Elite v4
                        </span>
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1 bg-[#B8CC3A]/10 rounded-full border border-[#B8CC3A]/20">
                        <TrendingUp className="w-3 h-3 text-[#003366]" />
                        <span className="text-[10px] font-black text-[#003366] uppercase tracking-tighter">
                            Confident
                        </span>
                    </div>
                </div>

                {/* Prediction Content */}
                <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Marché Recommandé
                        </span>
                        <h2 className="text-2xl font-black text-[#003366] leading-none">
                            {bestMarket.label}
                        </h2>
                    </div>

                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                            Probabilité
                        </span>
                        <div className="flex items-baseline gap-0.5">
                            <span className="text-4xl font-black text-[#003366] tracking-tighter">
                                {bestMarket.prob.toFixed(1)}
                            </span>
                            <span className="text-lg font-bold text-[#B8CC3A]">%</span>
                        </div>
                    </div>
                </div>

                {/* Action / Value Area */}
                {bestMarket.odds && (
                    <div className="flex items-center gap-3 pt-2">
                        <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-[#003366] to-[#B8CC3A]"
                                style={{ width: `${bestMarket.prob}%` }}
                            />
                        </div>
                        <div className="px-3 py-1.5 bg-[#003366] rounded-xl flex items-center gap-2">
                            <span className="text-[10px] font-bold text-white/50 uppercase">Cote</span>
                            <span className="text-sm font-black text-[#B8CC3A]">{bestMarket.odds.toFixed(2)}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
