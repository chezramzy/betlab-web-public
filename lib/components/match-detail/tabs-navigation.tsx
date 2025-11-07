"use client"

import { useSwipeable } from "react-swipeable"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export type TabId = "predictions" | "analysis" | "h2h"

interface Tab {
  id: TabId
  label: string
}

interface TabsNavigationProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

const tabs: Tab[] = [
  { id: "predictions", label: "Prédictions" },
  { id: "analysis", label: "Analyse" },
  { id: "h2h", label: "H2H" },
]

/**
 * Navigation à tabs swipeable pour la page Match Detail
 * Mobile-first avec gestures et animations Framer Motion
 */
export function TabsNavigation({
  activeTab,
  onTabChange,
}: TabsNavigationProps) {
  // Configuration des swipe handlers
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleSwipeLeft(),
    onSwipedRight: () => handleSwipeRight(),
    trackTouch: true,
    trackMouse: false, // Desktop non supporté pour les swipes
    delta: 100, // Distance minimum de swipe (100px)
    preventScrollOnSwipe: false, // Permet le scroll vertical
    touchEventOptions: { passive: true },
  })

  /**
   * Gère le swipe vers la gauche (tab suivant)
   */
  const handleSwipeLeft = () => {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab)
    if (currentIndex < tabs.length - 1) {
      onTabChange(tabs[currentIndex + 1].id)
    }
  }

  /**
   * Gère le swipe vers la droite (tab précédent)
   */
  const handleSwipeRight = () => {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab)
    if (currentIndex > 0) {
      onTabChange(tabs[currentIndex - 1].id)
    }
  }

  return (
    <div
      {...swipeHandlers}
      className="sticky top-[180px] z-40 bg-background border-b"
    >
      <div className="flex items-center">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                // Layout
                "relative flex-1 py-4",
                // Typography
                "text-sm font-medium transition-all duration-200",
                // Mobile touch target
                "min-h-[44px]",
                // Active/Inactive states
                isActive
                  ? "text-navy dark:text-lime scale-105"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-selected={isActive}
              role="tab"
            >
              {tab.label}

              {/* Animated indicator bar */}
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-lime"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                  }}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Swipe hint (optionnel, peut être supprimé si déjà affiché ailleurs) */}
      <SwipeHint />
    </div>
  )
}

/**
 * Indicateur visuel pour informer l'utilisateur qu'il peut swiper
 * S'affiche brièvement au premier chargement
 */
function SwipeHint() {
  return (
    <motion.div
      initial={{ opacity: 0.6, y: 0 }}
      animate={{ opacity: 0, y: -10 }}
      transition={{ delay: 2, duration: 1 }}
      className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full py-1 px-3 bg-foreground/80 text-background text-xs rounded-full pointer-events-none"
    >
      Swipez pour changer d&apos;onglet
    </motion.div>
  )
}
