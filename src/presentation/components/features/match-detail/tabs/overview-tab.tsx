"use client"

import { cn } from "@/shared/utils"
import { useState, useEffect } from "react"
import type { MatchDetail } from "@/core/entities/match-detail/match-detail.entity"
import type { MatchDetailVM } from "@/application/view-models/match-detail/match-detail.vm"
import {
    getMatch1x2,
    getMatchConfidence,
    getMatchFormIndex,
    getMatchPrediction,
} from "@/application/view-models/match-detail/match-detail.selectors"
import { TrendingUp, Activity, Target, Shield, Sparkles, CheckCircle2 } from "lucide-react"

interface OverviewTabProps {
    match: MatchDetail
    vm?: MatchDetailVM
}

export function OverviewTab({ match, vm }: OverviewTabProps) {
    const [accuracy, setAccuracy] = useState<{ accuracy: number } | null>(null);
    const probabilities = match.probabilities
    const mainPrediction = getMatchPrediction(match)
    const analytics = mainPrediction?.analytics
    const reasoning = vm?.overview.reasoning ?? (mainPrediction?.reasoning ?? "")
    const headline = vm?.overview.headline ?? (reasoning.split(".")[0] || "Analyse en cours...")
    const probs = vm?.overview.probs ?? getMatch1x2(match, mainPrediction ?? undefined)
    const formIndex = vm?.analysis.formIndex ?? getMatchFormIndex(match, mainPrediction ?? undefined)
    const confidence = vm?.overview.confidence ?? getMatchConfidence(match, mainPrediction ?? undefined)

    useEffect(() => {
        const fetchAccuracy = async () => {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
                // Fetch global accuracy for now, potentially filter by league later
                const res = await fetch(`${baseUrl}/api/predictions/accuracy`);
                if (res.ok) {
                    const data = await res.json();
                    setAccuracy(data);
                }
            } catch (e) {
                console.error("Failed to fetch accuracy", e);
            }
        };
        fetchAccuracy();
    }, []);

    // Determine main confidence color
    const confidenceColor = confidence === "high"
        ? "text-green-500"
        : confidence === "medium"
            ? "text-yellow-500"
            : "text-red-500"

    const confidenceBg = confidence === "high"
        ? "bg-green-500/10 border-green-500/20"
        : confidence === "medium"
            ? "bg-yellow-500/10 border-yellow-500/20"
            : "bg-red-500/10 border-red-500/20"

    const topOpportunities = (vm?.analysis.opportunities ?? analytics?.opportunities ?? [])
        .slice()
        .sort((a, b) => b.prob - a.prob)
        .slice(0, 3)


    return (
        <div className="space-y-6 p-4 max-w-4xl mx-auto animation-fade-in">
            {/* 1. Reasoning & Insight Section */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-4 bg-[#B8CC3A] rounded-full" />
                    <h3 className="text-sm font-black text-[#003366] uppercase tracking-wider">Analyse de l'expert IA</h3>
                </div>

                {/* Dynamic narration headline */}
                {vm?.narration && (
                    <p className="text-[#003366] text-base font-bold mb-3">
                        {vm.narration.headline}
                    </p>
                )}

                {/* Insight tags */}
                {vm?.narration?.tags && vm.narration.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {vm.narration.tags.map((tag, i) => (
                            <span key={i} className="px-2.5 py-1 bg-[#B8CC3A]/15 text-[#003366] text-[10px] font-black uppercase tracking-wider rounded-full border border-[#B8CC3A]/30">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Rich multi-paragraph analysis */}
                {vm?.narration?.paragraphs && vm.narration.paragraphs.length > 0 ? (
                    <div className="space-y-3">
                        {vm.narration.paragraphs.map((para, i) => (
                            <p key={i} className="text-[#003366]/70 text-sm leading-relaxed">
                                {para.split(/\*\*(.*?)\*\*/g).map((segment, j) =>
                                    j % 2 === 1
                                        ? <strong key={j} className="text-[#003366] font-semibold">{segment}</strong>
                                        : <span key={j}>{segment}</span>
                                )}
                            </p>
                        ))}
                    </div>
                ) : (
                    <p className="text-[#003366]/70 text-sm leading-relaxed italic">
                        &quot;{reasoning || "Aucun commentaire supplementaire disponible."}&quot;
                    </p>
                )}

                {/* Accuracy Badge */}
                {accuracy && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-[#003366]/5 rounded-xl border border-[#003366]/10 w-fit mt-4">
                        <CheckCircle2 className="w-4 h-4 text-[#B8CC3A]" />
                        <span className="text-[10px] font-bold text-[#003366] uppercase tracking-tight">Précision historique du modèle : {accuracy.accuracy}%</span>
                    </div>
                )}
            </div>

            {/* 2. Key Insights / Opportunities */}
            {analytics?.opportunities && analytics.opportunities.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {analytics.opportunities.slice(0, 4).map((opp, i) => (
                        <div key={i} className="flex items-start gap-4 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all group">
                            <div className={cn(
                                "p-2.5 rounded-xl transition-colors",
                                opp.type === "positive" ? "bg-[#B8CC3A]/10 text-[#003366]" : "bg-[#003366]/5 text-[#003366]"
                            )}>
                                {opp.type === "positive" ? <TrendingUp size={20} /> : <Target size={20} />}
                            </div>
                            <div className="flex-1">
                                <h4 className="font-black text-xs text-[#003366] uppercase tracking-wide mb-2 group-hover:text-[#B8CC3A] transition-colors">{opp.label}</h4>
                                <div className="flex items-center gap-3">
                                    <div className="h-1.5 flex-1 bg-slate-50 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-[#003366] to-[#B8CC3A]" style={{ width: `${opp.prob * 100}%` }} />
                                    </div>
                                    <span className="text-xs font-black text-[#003366]">{(opp.prob * 100).toFixed(0)}<span className="text-[#B8CC3A] ml-0.5">%</span></span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {topOpportunities.length > 0 && (
                <div className="rounded-2xl border bg-card p-4 md:p-5">
                    <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-4 h-4 text-[var(--navy)]" />
                        <h3 className="text-sm font-bold">Top 3 propositions</h3>
                    </div>
                    <div className="space-y-2">
                        {topOpportunities.map((opportunity, index) => (
                            <div
                                key={`${opportunity.label}-${index}`}
                                className="flex items-center justify-between rounded-xl border bg-muted/30 px-3 py-2"
                            >
                                <div className="flex items-center gap-2 min-w-0">
                                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--navy)] text-white text-[10px] font-bold">
                                        {index + 1}
                                    </span>
                                    <span className="text-sm font-medium truncate">{opportunity.label}</span>
                                </div>
                                <span className="text-sm font-bold text-[var(--navy)] tabular-nums">
                                    {(opportunity.prob * 100).toFixed(1)}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 3. Quick Stats Comparison */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                    label="ELO Index"
                    home={analytics?.ratings?.home}
                    away={analytics?.ratings?.away}
                    icon={<Shield className="w-4 h-4 text-[#B8CC3A]" />}
                />
                <StatCard
                    label="Exp. Goals"
                    home={vm?.analysis.xg.home || 1.45}
                    away={vm?.analysis.xg.away || 1.20}
                    icon={<Target className="w-4 h-4 text-[#B8CC3A]" />}
                    isFloat
                />
                <StatCard
                    label="Fatigue"
                    home={((analytics?.fatigue?.fatigueFactors?.home || 0) * 100)}
                    away={((analytics?.fatigue?.fatigueFactors?.away || 0) * 100)}
                    icon={<Activity className="w-4 h-4 text-[#B8CC3A]" />}
                    inverse
                />
                <StatCard
                    label="Defense"
                    home={((analytics?.defenseFactor?.home || 0) * 100)}
                    away={((analytics?.defenseFactor?.away || 0) * 100)}
                    icon={<Shield className="w-4 h-4 text-[#B8CC3A]" />}
                />
            </div>

        </div>
    )
}

interface StatCardProps {
    label: string
    home?: number
    away?: number
    icon: React.ReactNode
    isFloat?: boolean
    inverse?: boolean
}

function StatCard({ label, home, away, icon, isFloat, inverse }: StatCardProps) {
    if (home === undefined || away === undefined) return null

    const homeVal = Number(home)
    const awayVal = Number(away)

    const homeIsBetter = inverse ? homeVal < awayVal : homeVal > awayVal

    return (
        <div className="bg-white border border-slate-100 rounded-2xl p-5 flex flex-col items-center text-center shadow-sm">
            <div className="flex items-center gap-2 text-[#003366]/40 mb-3">
                {icon}
                <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
            </div>
            <div className="flex items-end gap-1 w-full justify-center">
                <div className="flex flex-col items-center flex-1">
                    <span className={cn("text-xl font-black tabular-nums", homeIsBetter ? "text-[#003366]" : "text-[#003366]/30")}>
                        {isFloat ? homeVal.toFixed(1) : homeVal.toFixed(0)}
                    </span>
                    {homeIsBetter && <div className="h-1 w-4 bg-[#B8CC3A] rounded-full mt-1" />}
                </div>
                <span className="text-slate-100 text-sm font-bold mb-1">VS</span>
                <div className="flex flex-col items-center flex-1">
                    <span className={cn("text-xl font-black tabular-nums", !homeIsBetter ? "text-[#003366]" : "text-[#003366]/30")}>
                        {isFloat ? awayVal.toFixed(1) : awayVal.toFixed(0)}
                    </span>
                    {!homeIsBetter && <div className="h-1 w-4 bg-[#B8CC3A] rounded-full mt-1" />}
                </div>
            </div>
        </div>
    )
}
