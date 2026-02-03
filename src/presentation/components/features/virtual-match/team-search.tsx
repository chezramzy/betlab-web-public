"use client"

import * as React from "react"
import { Search, Loader2, X } from "lucide-react"
import { cn } from "@/shared/utils"
import { useDebounce } from "react-use"

interface Team {
    team: {
        id: number
        name: string
        logo: string
    }
}

interface TeamSearchProps {
    onSelect: (teamId: number, name: string, logo: string) => void
    placeholder?: string
    className?: string
}

export function TeamSearch({ onSelect, placeholder = "Rechercher une équipe...", className }: TeamSearchProps) {
    const [query, setQuery] = React.useState("")
    const [results, setResults] = React.useState<Team[]>([])
    const [loading, setLoading] = React.useState(false)
    const [open, setOpen] = React.useState(false)

    useDebounce(
        async () => {
            if (query.length < 3) {
                setResults([])
                return
            }

            setLoading(true)
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/football/teams?search=${encodeURIComponent(query)}`)
                const data = await res.json()
                if (data.response) {
                    setResults(data.response)
                }
            } catch (err) {
                console.error("Search failed:", err)
            } finally {
                setLoading(false)
            }
        },
        500,
        [query]
    )

    return (
        <div className={cn("relative w-full", className)}>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value)
                        setOpen(true)
                    }}
                    onFocus={() => setOpen(true)}
                    placeholder={placeholder}
                    className="w-full h-11 pl-10 pr-10 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[var(--navy)]/20 focus:border-[var(--navy)] transition-all"
                />
                {query && (
                    <button
                        onClick={() => {
                            setQuery("")
                            setResults([])
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full"
                    >
                        <X className="h-3 w-3 text-muted-foreground" />
                    </button>
                )}
            </div>

            {open && (query.length >= 3 || loading) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto overflow-x-hidden animate-in fade-in slide-in-from-top-1">
                    {loading ? (
                        <div className="p-4 flex justify-center">
                            <Loader2 className="h-5 w-5 animate-spin text-[var(--navy)]" />
                        </div>
                    ) : results.length > 0 ? (
                        <div className="py-2">
                            {results.map((item) => (
                                <button
                                    key={item.team.id}
                                    onClick={() => {
                                        onSelect(item.team.id, item.team.name, item.team.logo)
                                        setQuery("")
                                        setOpen(false)
                                    }}
                                    className="w-full px-4 py-2 text-left hover:bg-muted flex items-center gap-3 transition-colors"
                                >
                                    <img src={item.team.logo} alt="" className="h-6 w-6 object-contain" />
                                    <span className="text-sm font-medium">{item.team.name}</span>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="p-4 text-sm text-center text-muted-foreground">
                            Aucune équipe trouvée
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
