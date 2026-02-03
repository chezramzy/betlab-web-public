"use client"

import * as React from "react"
import { Zap, Target, TrendingUp, AlertCircle } from "lucide-react"
import { Badge } from "@/presentation/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/presentation/components/ui/card"
import { cn } from "@/shared/utils"

interface Opportunity {
    type: string
    label: string
    prob: number
}

interface OpportunitiesListProps {
    opportunities: Opportunity[]
}

export function OpportunitiesList({ opportunities }: OpportunitiesListProps) {
    if (!opportunities || opportunities.length === 0) return null

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 px-1">
                <Zap className="w-5 h-5 text-[var(--navy)]" />
                <h3 className="text-lg font-bold text-[var(--navy)] uppercase tracking-tight">Golden Picks & Insights</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {opportunities.map((opp, idx) => (
                    <Card key={idx} className="border-l-4 border-l-[var(--lime)] hover:shadow-md transition-shadow py-4 overflow-hidden">
                        <CardContent className="px-4 py-0 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[var(--navy-ultra-light)] rounded-lg">
                                    {getIcon(opp.type)}
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-muted-foreground uppercase">{opp.type}</p>
                                    <p className="font-bold text-[var(--navy)] leading-tight">{opp.label}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-xl font-black text-[var(--navy)]">{(opp.prob * 100).toFixed(0)}%</span>
                                <p className="text-[10px] text-muted-foreground uppercase font-bold">Confiance</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

function getIcon(type: string) {
    switch (type.toUpperCase()) {
        case "OUTCOME": return <Target className="w-4 h-4 text-[var(--navy)]" />
        case "GOALS": return <TrendingUp className="w-4 h-4 text-[var(--navy)]" />
        case "TOTALS": return <TrendingUp className="w-4 h-4 text-[var(--navy)]" />
        default: return <AlertCircle className="w-4 h-4 text-[var(--navy)]" />
    }
}
