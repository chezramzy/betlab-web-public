"use client"

import { cn } from "@/shared/utils"

export type TabId = "overview" | "predictions" | "stats" | "lineups" | "analysis" | "value" | "h2h"

interface Tab {
  id: TabId
  label: string
}

interface TabsNavigationProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

const tabs: Tab[] = [
  { id: "overview", label: "Aperçu" },
  { id: "analysis", label: "Analyse" },
  { id: "predictions", label: "Marchés" },
  { id: "stats", label: "Stats" },
  { id: "lineups", label: "Compos" },
  { id: "h2h", label: "H2H" },
  { id: "value", label: "Value" },
]

/**
 * Navigation à tabs pour la page Match Detail
 */
export function TabsNavigation({
  activeTab,
  onTabChange,
}: TabsNavigationProps) {
  return (
    <div className="w-full bg-white border-b border-slate-100 overflow-x-auto no-scrollbar">
      <div className="flex items-center min-w-max px-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "relative py-4 px-6 transition-all duration-300",
                "text-xs font-black uppercase tracking-widest",
                "active:scale-95",
                isActive
                  ? "text-[#003366]"
                  : "text-slate-300 hover:text-[#003366]/60"
              )}
              aria-selected={isActive}
              role="tab"
            >
              {tab.label}

              {/* Minimalist marker */}
              <div
                className={cn(
                  "absolute bottom-0 left-1/2 -translate-x-1/2 h-1 bg-[#B8CC3A] rounded-t-full transition-all duration-300",
                  isActive ? "w-8 opacity-100" : "w-0 opacity-0"
                )}
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}
