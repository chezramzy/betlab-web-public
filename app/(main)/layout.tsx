'use client'

import { usePathname, useRouter } from 'next/navigation'
import { MobileBottomNav } from '@/lib/components/layouts/mobile-bottom-nav'
import { MobileHeader } from '@/lib/components/layouts/mobile-header'
import { DesktopSidebar } from '@/lib/components/layouts/desktop-sidebar'
import { useSportStore } from '@/lib/stores/sport-store'
import { useUser } from '@/lib/hooks/use-user'
import { SportType } from '@/lib/core/enums/sport-type'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { activeSport, setActiveSport } = useSportStore()
  const { user } = useUser()

  // Determine active tab based on pathname
  const getActiveTab = (): 'home' | 'matches' | 'favorites' | 'settings' => {
    if (pathname === '/') return 'home'
    if (pathname.startsWith('/matches')) return 'matches'
    if (pathname.startsWith('/favorites')) return 'favorites'
    if (pathname.startsWith('/settings')) return 'settings'
    return 'home'
  }

  // Handle tab change
  const handleTabChange = (tab: 'home' | 'matches' | 'favorites' | 'settings') => {
    switch (tab) {
      case 'home':
        router.push('/')
        break
      case 'matches':
        router.push('/matches')
        break
      case 'favorites':
        router.push('/favorites')
        break
      case 'settings':
        router.push('/settings')
        break
    }
  }

  // Handle sport change
  const handleSportChange = (sport: 'football' | 'basketball') => {
    const sportType = sport === 'football' ? SportType.FOOTBALL : SportType.BASKETBALL
    setActiveSport(sportType)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop: Sidebar gauche */}
      <DesktopSidebar
        className="hidden lg:flex"
        activeTab={getActiveTab()}
        onTabChange={handleTabChange}
        user={user ? {
          name: user.email || 'User',
          email: user.email || '',
          avatar: undefined,
        } : undefined}
      />

      {/* Mobile: Header en haut */}
      <MobileHeader
        className="lg:hidden"
        showSportSelector={true}
        activeSport={activeSport === SportType.FOOTBALL ? 'football' : 'basketball'}
        onSportChange={handleSportChange}
        avatarFallback={user?.email?.[0].toUpperCase() || 'U'}
      />

      {/* Main content avec padding pour nav */}
      <main className="lg:ml-72">
        <div className="pb-[calc(64px+env(safe-area-inset-bottom))] lg:pb-0">
          {children}
        </div>
      </main>

      {/* Mobile: Bottom nav en bas */}
      <MobileBottomNav
        className="lg:hidden"
        activeTab={getActiveTab()}
        onTabChange={handleTabChange}
      />
    </div>
  )
}
