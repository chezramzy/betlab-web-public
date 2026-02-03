"use client"

import * as React from "react"
import { cn } from "@/shared/utils"

interface AsianLinesProps {
    type: "Handicap" | "Total"
    lines: Array<{
        line: number
        home?: number
        away?: number
        over?: number
        under?: number
        push: number
    }>
}

export function AsianMarketsSummary({ type, lines }: AsianLinesProps) {
    if (!lines || lines.length === 0) return null

    const isHandicap = type === "Handicap"

    return (
        <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 bg-[var(--navy)] border-b">
                <h3 className="font-bold text-white uppercase tracking-tight text-sm">
                    Filtre {isHandicap ? "Handicap Asiatique" : "Totaux Asiatiques"}
                </h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-black">
                            <th className="p-3 text-left">Ligne</th>
                            <th className="p-3 text-right">{isHandicap ? "Home" : "Over"}</th>
                            <th className="p-3 text-right">{isHandicap ? "Away" : "Under"}</th>
                            <th className="p-3 text-right">Push</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y cursor-default">
                        {lines.map((l, idx) => (
                            <tr key={idx} className="hover:bg-[var(--navy-ultra-light)] transition-colors">
                                <td className="p-3 font-black text-[var(--navy)]">
                                    {l.line > 0 ? `+${l.line}` : l.line}
                                </td>
                                <td className="p-3 text-right text-muted-foreground font-semibold">
                                    {(((isHandicap ? l.home : l.over) || 0) * 100).toFixed(1)}%
                                </td>
                                <td className="p-3 text-right text-muted-foreground font-semibold">
                                    {(((isHandicap ? l.away : l.under) || 0) * 100).toFixed(1)}%
                                </td>
                                <td className="p-3 text-right text-muted-foreground font-semibold italic">
                                    {(l.push * 100).toFixed(1)}%
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
