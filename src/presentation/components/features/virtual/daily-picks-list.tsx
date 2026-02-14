"use client";

import { VirtualPick } from "@/core/entities/virtual/virtual-pick.entity";
import { cn } from "@/shared/utils";
import { Badge } from "@/presentation/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { Trophy, TrendingUp, AlertCircle, Calendar } from "lucide-react";

interface DailyPicksListProps {
    picks: VirtualPick[];
}

export function DailyPicksList({ picks }: DailyPicksListProps) {
    if (!picks || picks.length === 0) {
        return (
            <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                    <AlertCircle className="h-8 w-8 mb-2 opacity-20" />
                    <p>Aucune prédiction disponible pour aujourd'hui.</p>
                </CardContent>
            </Card>
        );
    }

    // Sort by confidence
    const sortedPicks = [...picks].sort((a, b) => b.confidence - a.confidence);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <h2 className="text-2xl font-bold tracking-tight">Sélection du Jour</h2>
                <Badge variant="secondary" className="ml-auto">
                    {picks.length} matchs analysés
                </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedPicks.map((pick, index) => (
                    <VirtualPickCard key={`${pick.home_team}-${pick.away_team}-${index}`} pick={pick} />
                ))}
            </div>
        </div>
    );
}

function VirtualPickCard({ pick }: { pick: VirtualPick }) {
    const isHighConfidence = pick.confidence >= 0.75;
    const confidencePercent = (pick.confidence * 100).toFixed(0);

    return (
        <Card className={cn(
            "transition-all hover:shadow-md border-l-4",
            isHighConfidence ? "border-l-emerald-500" : "border-l-blue-500"
        )}>
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start text-xs text-muted-foreground mb-1">
                    <span className="uppercase tracking-wider truncate max-w-[45%]">{pick.home_league}</span>
                    {isHighConfidence && (
                        <span className="flex items-center gap-1 text-emerald-600 font-bold">
                            <TrendingUp className="h-3 w-3" />
                            TOP CONFIANCE
                        </span>
                    )}
                </div>
                <CardTitle className="text-base flex justify-between items-center gap-2">
                    <span className="truncate">{pick.home_team}</span>
                    <span className="text-muted-foreground text-xs">vs</span>
                    <span className="truncate text-right">{pick.away_team}</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-muted-foreground">Prédiction</span>
                        <div className="font-black text-[var(--navy)] text-lg">
                            {formatOutcome(pick.outcome, pick.market, pick.market_display)}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                            <span>Confiance IA</span>
                            <span className={cn(
                                "font-bold",
                                isHighConfidence ? "text-emerald-600" : "text-blue-600"
                            )}>{confidencePercent}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                            <div
                                className={cn(
                                    "h-full rounded-full",
                                    isHighConfidence ? "bg-emerald-500" : "bg-blue-500"
                                )}
                                style={{ width: `${confidencePercent}%` }}
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-2 text-xs text-center text-muted-foreground">
                    Marché: {pick.market_display}
                </div>
            </CardContent>
        </Card>
    )
}

function formatOutcome(outcome: string, market: string, marketDisplay: string): string {
    // Improve display logic as needed
    if (outcome === "1") return "Victoire Domicile";
    if (outcome === "2") return "Victoire Extérieur";
    if (outcome === "X") return "Match Nul";
    if (outcome === "over") return "Plus de buts";
    if (outcome === "under") return "Moins de buts";
    return outcome;
}
