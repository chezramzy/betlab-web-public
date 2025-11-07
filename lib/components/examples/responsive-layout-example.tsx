'use client'

import { useBreakpoint } from '@/lib/hooks/use-breakpoint'

/**
 * Exemple d'utilisation du hook useBreakpoint
 * Affiche un layout différent selon le breakpoint
 */
export function ResponsiveLayoutExample() {
  const { breakpoint, isMobile, isTablet, isDesktop } = useBreakpoint()

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Responsive Layout Example</h2>

      {/* Affichage conditionnel basé sur le device type */}
      {isMobile && (
        <div className="bg-blue-100 p-4 rounded">
          <p className="font-semibold">Mobile View</p>
          <p className="text-sm">Optimisé pour écrans jusqu'à 767px</p>
        </div>
      )}

      {isTablet && (
        <div className="bg-green-100 p-4 rounded">
          <p className="font-semibold">Tablet View</p>
          <p className="text-sm">Optimisé pour écrans 768px-1023px</p>
        </div>
      )}

      {isDesktop && (
        <div className="bg-purple-100 p-4 rounded">
          <p className="font-semibold">Desktop View</p>
          <p className="text-sm">Optimisé pour écrans 1024px+</p>
        </div>
      )}

      {/* Breakpoint actuel */}
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <p className="text-sm">
          Breakpoint actuel: <span className="font-bold">{breakpoint}</span>
        </p>
      </div>

      {/* Grid responsive basé sur breakpoint */}
      <div
        className={`mt-4 grid gap-4 ${
          isMobile
            ? 'grid-cols-1'
            : isTablet
              ? 'grid-cols-2'
              : 'grid-cols-3'
        }`}
      >
        <div className="bg-card p-4 rounded border">Card 1</div>
        <div className="bg-card p-4 rounded border">Card 2</div>
        <div className="bg-card p-4 rounded border">Card 3</div>
      </div>
    </div>
  )
}
