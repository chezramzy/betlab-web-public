"use client"

import * as React from "react"
import { Progress } from "@/presentation/components/ui/progress"
import { cn } from "@/shared/utils"

interface GoalsHeatmapProps {
    distribution: Array<{ goals: string; probability: number }>
}

export function GoalsHeatmap({ distribution }: GoalsHeatmapProps) {
    if (!distribution || distribution.length === 0) return null

    return (
        <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 bg-[var(--navy-ultra-light)] border-b">
                <h3 className="font-bold text-[var(--navy)] uppercase tracking-tight text-sm flex items-center gap-2">
                    Température des Buts (xG Distribution)
                </h3>
            </div>
            <div className="p-4 space-y-4">
                {distribution.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold uppercase">
                            <span className="text-[var(--navy)]">
                                {item.goals === "5+" ? "5 buts ou plus" : `Exactement ${item.goals} but${parseInt(item.goals) > 1 ? "s" : ""}`}
                            </span>
                            <span className={cn(
                                item.probability > 0.2 ? "text-[var(--success)]" : "text-muted-foreground"
                            )}>
                                {(item.probability * 100).toFixed(1)}%
                            </span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <div
                                className={cn(
                                    "h-full transition-all duration-700",
                                    item.probability > 0.25 ? "bg-[var(--success)]" :
                                        item.probability > 0.15 ? "bg-[var(--lime)]" : "bg-[var(--navy-light)]/30"
                                )}
                                style={{ width: `${item.probability * 100}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
