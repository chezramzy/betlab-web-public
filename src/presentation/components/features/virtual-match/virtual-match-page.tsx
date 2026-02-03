"use client"

import * as React from "react"
import { TeamSearch } from "./team-search"
import { Zap, Swords, Trophy, TrendingUp, Info, Loader2, Play } from "lucide-react"
import { cn } from "@/shared/utils"
import { Button } from "@/presentation/components/ui/button"
import { GoalsHeatmap } from "../match-detail/smart-analysis/goals-heatmap"
import { AsianMarketsSummary } from "../match-detail/smart-analysis/asian-markets"
import { OpportunitiesList } from "../match-detail/smart-analysis/opportunities"

interface VirtualTeam {
    id: number
    name: string
    logo: string
}

export default function VirtualMatchPage() {
    const [teamHome, setTeamHome] = React.useState<VirtualTeam | null>(null)
    const [teamAway, setTeamAway] = React.useState<VirtualTeam | null>(null)
    const [loading, setLoading] = React.useState(false)
    const [result, setResult] = React.useState<any>(null)

    const handleSimulate = async () => {
        if (!teamHome || !teamAway) return

        setLoading(true)
        setResult(null)

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/matches/v1/predictions/virtual`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    home_team_id: teamHome.id,
                    away_team_id: teamAway.id
                })
            })

            const data = await res.json()
            setResult(data)
        } catch (err) {
            console.error("Simulation failed:", err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto p-4 max-w-5xl space-y-8 pb-20">
            {/* Header section */}
            <div className="text-center space-y-4 pt-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--navy-ultra-light)] border border-[var(--navy-light)]/20 rounded-full">
                    <Zap className="h-4 w-4 text-[var(--navy)]" />
                    <span className="text-xs font-bold text-[var(--navy)] uppercase tracking-wider">Moteur Prédictif V2.1</span>
                </div>
                <h1 className="text-4xl font-black text-[var(--navy)] tracking-tight">Confrontation Virtuelle</h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Simulez n'importe quelle rencontre. Notre IA analyse les performances récentes pour générer des probabilités précises.
                </p>
            </div>

            {/* Team Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                {/* Home Team */}
                <div className={cn(
                    "bg-card border rounded-2xl p-6 shadow-sm transition-all duration-300",
                    teamHome ? "border-[var(--navy)]" : "border-dashed"
                )}>
                    <div className="flex flex-col items-center gap-6">
                        <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-border/50">
                            {teamHome ? (
                                <img src={teamHome.logo} alt="" className="h-16 w-16 object-contain" />
                            ) : (
                                <div className="text-muted-foreground italic text-xs">Home</div>
                            )}
                        </div>
                        <div className="w-full space-y-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground text-center block tracking-widest">Équipe Domicile</label>
                            <TeamSearch
                                placeholder="Chercher domicile..."
                                onSelect={(id, name, logo) => setTeamHome({ id, name, logo })}
                            />
                            {teamHome && (
                                <div className="text-center font-bold text-[var(--navy)] mt-2">{teamHome.name}</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* VS / Action */}
                <div className="flex flex-col items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-[var(--navy)] flex items-center justify-center shadow-lg">
                        <span className="text-white font-black text-xl italic uppercase">VS</span>
                    </div>
                    <Button
                        size="lg"
                        onClick={handleSimulate}
                        disabled={!teamHome || !teamAway || loading}
                        className="w-full h-14 rounded-xl bg-[var(--navy)] hover:bg-[var(--navy-light)] text-white font-bold gap-3 shadow-md"
                    >
                        {loading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <>
                                <Play className="h-5 w-5 fill-current" />
                                SIMULER MAINTENANT
                            </>
                        )}
                    </Button>
                </div>

                {/* Away Team */}
                <div className={cn(
                    "bg-card border rounded-2xl p-6 shadow-sm transition-all duration-300",
                    teamAway ? "border-[var(--navy)]" : "border-dashed"
                )}>
                    <div className="flex flex-col items-center gap-6">
                        <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-border/50">
                            {teamAway ? (
                                <img src={teamAway.logo} alt="" className="h-16 w-16 object-contain" />
                            ) : (
                                <div className="text-muted-foreground italic text-xs">Away</div>
                            )}
                        </div>
                        <div className="w-full space-y-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground text-center block tracking-widest">Équipe Extérieur</label>
                            <TeamSearch
                                placeholder="Chercher extérieur..."
                                onSelect={(id, name, logo) => setTeamAway({ id, name, logo })}
                            />
                            {teamAway && (
                                <div className="text-center font-bold text-[var(--navy)] mt-2">{teamAway.name}</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Result Display */}
            {result && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
                    <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

                    {/* Main Probabilities Tooltip style */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-card border rounded-xl p-6 text-center shadow-sm">
                            <div className="text-sm font-bold text-muted-foreground uppercase mb-2">Victoire Domicile</div>
                            <div className="text-4xl font-black text-[var(--navy)]">{(result.probabilities["1"] * 100).toFixed(1)}%</div>
                        </div>
                        <div className="bg-card border rounded-xl p-6 text-center shadow-sm">
                            <div className="text-sm font-bold text-muted-foreground uppercase mb-2">Match Nul</div>
                            <div className="text-4xl font-black text-muted-foreground">{(result.probabilities["X"] * 100).toFixed(1)}%</div>
                        </div>
                        <div className="bg-card border rounded-xl p-6 text-center shadow-sm border-b-4 border-b-[var(--navy)]">
                            <div className="text-sm font-bold text-muted-foreground uppercase mb-2">Victoire Extérieur</div>
                            <div className="text-4xl font-black text-[var(--navy)]">{(result.probabilities["2"] * 100).toFixed(1)}%</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Opportunities section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-[var(--navy)]" />
                                <h3 className="font-bold text-xl text-[var(--navy)] lowercase first-letter:uppercase">Insights Stratégiques</h3>
                            </div>
                            <OpportunitiesList opportunities={result.analytics.opportunities || []} />
                        </div>

                        {/* Goals section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Trophy className="h-5 w-5 text-[var(--navy)]" />
                                <h3 className="font-bold text-xl text-[var(--navy)] lowercase first-letter:uppercase">Distribution des Buts</h3>
                            </div>
                            <GoalsHeatmap distribution={result.exact_goals?.distribution || []} />
                        </div>
                    </div>

                    {/* Asian Markets Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <Info className="h-5 w-5 text-[var(--navy)]" />
                            <h3 className="font-bold text-xl text-[var(--navy)] lowercase first-letter:uppercase">Marchés Asiatiques</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {result.handicap_asian && <AsianMarketsSummary type="Handicap" lines={result.handicap_asian.lines || []} />}
                            {result.totals_asian && <AsianMarketsSummary type="Total" lines={result.totals_asian.lines || []} />}
                        </div>
                    </div>
                </div>
            )}

            {/* Empty State / Instructional */}
            {!result && !loading && (
                <div className="bg-muted/30 border border-dashed rounded-3xl p-12 text-center text-muted-foreground">
                    <Swords className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p className="max-w-xs mx-auto">Choisissez deux équipes ci-dessus pour comparer leurs forces et générer des prédictions.</p>
                </div>
            )}
        </div>
    )
}
