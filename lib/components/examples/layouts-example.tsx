'use client'

import * as React from 'react'
import { MobileBottomNav } from '@/lib/components/layouts/mobile-bottom-nav'
import { MobileHeader } from '@/lib/components/layouts/mobile-header'
import { DesktopSidebar } from '@/lib/components/layouts/desktop-sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/lib/components/ui/card'
import { Badge } from '@/lib/components/ui/badge'
import { Button } from '@/lib/components/ui/button'
import type { NavRoute } from '@/lib/hooks/use-navigation'

/**
 * LayoutsExample Component
 *
 * Demonstrates the complete layout system for BetLab:
 * - Mobile: MobileHeader + MobileBottomNav
 * - Desktop: DesktopSidebar
 * - Responsive: Switches automatically based on screen size
 * - Features: Theme toggle, sport selector, notifications, collapsible sidebar
 */
export function LayoutsExample() {
  const [activeTab, setActiveTab] = React.useState<NavRoute>('home')
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const [activeSport, setActiveSport] = React.useState<'football' | 'basketball'>('football')
  const [headerCollapsed, setHeaderCollapsed] = React.useState(false)
  const [notifications] = React.useState({
    matches: 3,
    favorites: 1,
  })

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed)

  // Mock user data
  const user = {
    name: 'John Doe',
    email: 'john.doe@betlab.com',
    avatar: 'https://github.com/shadcn.png',
  }

  // Handle scroll for collapsible header
  React.useEffect(() => {
    let lastScrollY = 0

    const onScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY && currentScrollY > 64) {
        setHeaderCollapsed(true)
      } else {
        setHeaderCollapsed(false)
      }

      lastScrollY = currentScrollY
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Content for each tab
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Welcome to BetLab</h2>
              <p className="text-muted-foreground">
                Your advanced betting analytics platform
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Live Matches
                    <Badge variant="live">LIVE</Badge>
                  </CardTitle>
                  <CardDescription>Currently ongoing matches</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">5</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Win Rate
                    <Badge variant="success">+12%</Badge>
                  </CardTitle>
                  <CardDescription>Last 30 days performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">68%</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Active Bets
                    <Badge variant="warning">Pending</Badge>
                  </CardTitle>
                  <CardDescription>Currently active predictions</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">12</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Layout Features</CardTitle>
                <CardDescription>
                  This example demonstrates all layout components
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Mobile Features:</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Bottom navigation bar with icons and labels</li>
                    <li>Notification badges on navigation items ({notifications.matches} matches, {notifications.favorites} favorites)</li>
                    <li>Sticky header with sport selector (Current: {activeSport})</li>
                    <li>Theme toggle (Sun/Moon icon)</li>
                    <li>Safe area insets for iOS notch support</li>
                    <li>Collapsible header on scroll</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Desktop Features:</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Sidebar navigation (Currently {sidebarCollapsed ? 'collapsed' : 'expanded'})</li>
                    <li>User profile card with avatar</li>
                    <li>Collapsible sidebar (280px → 80px)</li>
                    <li>Tooltips when collapsed</li>
                    <li>Theme toggle button</li>
                    <li>Logout functionality</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Responsive Behavior:</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Mobile navigation (&lt; 1024px): Bottom nav + Header</li>
                    <li>Desktop navigation (≥ 1024px): Sidebar only</li>
                    <li>Smooth transitions between breakpoints</li>
                    <li>Persistent state (localStorage)</li>
                  </ul>
                </div>

                <div className="pt-4 border-t">
                  <Button onClick={toggleSidebar} variant="outline" className="w-full sm:w-auto">
                    Toggle Sidebar (Desktop Only)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 'matches':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Matches</h2>
              <p className="text-muted-foreground">
                Browse all {activeSport} matches
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Matches</CardTitle>
                <CardDescription>
                  {activeSport === 'football' ? '⚽ Football' : '🏀 Basketball'} matches
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-lg border border-border"
                    >
                      <div>
                        <p className="font-medium">Team A vs Team B</p>
                        <p className="text-sm text-muted-foreground">Today, 20:00</p>
                      </div>
                      <Badge variant="outline">View</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 'favorites':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Favorites</h2>
              <p className="text-muted-foreground">
                Your starred matches and predictions
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Favorite Matches
                  <Badge>{notifications.favorites}</Badge>
                </CardTitle>
                <CardDescription>Matches you're tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  No favorite matches yet. Star matches to see them here.
                </p>
              </CardContent>
            </Card>
          </div>
        )

      case 'settings':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Settings</h2>
              <p className="text-muted-foreground">
                Manage your account and preferences
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>User Profile</CardTitle>
                <CardDescription>Your account information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Name</p>
                  <p className="text-sm text-muted-foreground">{user.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>Customize your experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Default Sport</p>
                  <p className="text-sm text-muted-foreground capitalize">{activeSport}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Layout</p>
                  <p className="text-sm text-muted-foreground">
                    Sidebar {sidebarCollapsed ? 'collapsed' : 'expanded'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <DesktopSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        collapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebar}
        user={user}
        onLogout={() => console.log('Logout clicked')}
      />

      {/* Mobile Header */}
      <MobileHeader
        showSportSelector
        activeSport={activeSport}
        onSportChange={setActiveSport}
        showAvatar
        avatarSrc={user.avatar}
        avatarFallback="JD"
        onAvatarClick={() => console.log('Avatar clicked')}
        showThemeToggle
        collapsible
        collapsed={headerCollapsed}
      />

      {/* Main Content */}
      <main
        className={cn(
          'min-h-screen',
          'pb-20 lg:pb-8', // Extra padding for mobile bottom nav
          'pt-4',
          'px-4 sm:px-6 lg:px-8',
          'lg:ml-72', // Offset for desktop sidebar
          'transition-all duration-300',
          sidebarCollapsed && 'lg:ml-20'
        )}
      >
        <div className="max-w-7xl mx-auto">
          {renderContent()}

          {/* Scroll content to demonstrate collapsible header */}
          <div className="mt-12 space-y-4">
            <h3 className="text-lg font-semibold">Scroll to see collapsible header</h3>
            {[...Array(20)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <p className="text-muted-foreground">
                    Scroll content item {i + 1}. The header will collapse when scrolling down
                    and expand when scrolling up.
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        notifications={notifications}
      />
    </div>
  )
}

// Helper function (already imported from utils, but included here for reference)
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
