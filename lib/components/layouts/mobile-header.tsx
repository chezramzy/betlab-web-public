'use client'

import * as React from 'react'
import { ArrowLeft, Sun, Moon, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/lib/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/lib/components/ui/avatar'
import { useTheme } from 'next-themes'

export interface MobileHeaderProps {
  title?: string
  showBack?: boolean
  onBackClick?: () => void
  showSportSelector?: boolean
  activeSport?: 'football' | 'basketball'
  onSportChange?: (sport: 'football' | 'basketball') => void
  showAvatar?: boolean
  avatarSrc?: string
  avatarFallback?: string
  onAvatarClick?: () => void
  showThemeToggle?: boolean
  showMenu?: boolean
  onMenuClick?: () => void
  collapsible?: boolean
  collapsed?: boolean
  className?: string
}

const sportIcons = {
  football: '⚽',
  basketball: '🏀',
}

export function MobileHeader({
  title,
  showBack = false,
  onBackClick,
  showSportSelector = false,
  activeSport = 'football',
  onSportChange,
  showAvatar = true,
  avatarSrc,
  avatarFallback = 'U',
  onAvatarClick,
  showThemeToggle = true,
  showMenu = false,
  onMenuClick,
  collapsible = false,
  collapsed = false,
  className,
}: MobileHeaderProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const handleSportChange = (sport: 'football' | 'basketball') => {
    if (onSportChange) {
      onSportChange(sport)
    }
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-40',
        'bg-background/95 backdrop-blur-md',
        'border-b border-border',
        'transition-all duration-300 ease-in-out',
        collapsible && collapsed ? 'h-12 shadow-md' : 'h-16 shadow-sm',
        // Safe area support for iOS notch
        'pt-[env(safe-area-inset-top,0px)]',
        'lg:hidden',
        className
      )}
      role="banner"
    >
      <div
        className={cn(
          'flex items-center justify-between px-4',
          'transition-all duration-300',
          collapsible && collapsed ? 'h-12' : 'h-16'
        )}
      >
        {/* Left section */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {showBack ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBackClick}
              className="shrink-0"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          ) : (
            <div className="flex items-center gap-2 shrink-0">
              {/* Logo */}
              <div className="flex items-center gap-1.5">
                <div className="h-8 w-8 rounded-lg bg-[hsl(var(--navy))] flex items-center justify-center">
                  <span className="text-white font-bold text-sm">BL</span>
                </div>
                {!collapsed && (
                  <span className="text-lg font-bold text-foreground">
                    BetLab
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Center section */}
        <div className="flex items-center justify-center flex-1 min-w-0">
          {showSportSelector && !collapsed ? (
            <div
              className="inline-flex items-center gap-1 p-1 bg-muted rounded-full"
              role="group"
              aria-label="Sport selector"
            >
              <button
                onClick={() => handleSportChange('football')}
                className={cn(
                  'flex items-center justify-center',
                  'w-10 h-10 rounded-full',
                  'text-lg transition-all duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  activeSport === 'football'
                    ? 'bg-background shadow-sm scale-110'
                    : 'hover:bg-background/50 opacity-60'
                )}
                aria-label="Select football"
                aria-pressed={activeSport === 'football'}
              >
                {sportIcons.football}
              </button>
              <button
                onClick={() => handleSportChange('basketball')}
                className={cn(
                  'flex items-center justify-center',
                  'w-10 h-10 rounded-full',
                  'text-lg transition-all duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  activeSport === 'basketball'
                    ? 'bg-background shadow-sm scale-110'
                    : 'hover:bg-background/50 opacity-60'
                )}
                aria-label="Select basketball"
                aria-pressed={activeSport === 'basketball'}
              >
                {sportIcons.basketball}
              </button>
            </div>
          ) : title && !collapsed ? (
            <h1 className="text-base font-semibold text-foreground truncate px-2">
              {title}
            </h1>
          ) : null}
        </div>

        {/* Right section */}
        <div className="flex items-center gap-1 justify-end flex-1">
          {showThemeToggle && mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="shrink-0"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          )}

          {showAvatar && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onAvatarClick}
              className="shrink-0 rounded-full p-0 h-8 w-8"
              aria-label="User menu"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={avatarSrc} alt="User avatar" />
                <AvatarFallback className="text-xs">
                  {avatarFallback}
                </AvatarFallback>
              </Avatar>
            </Button>
          )}

          {showMenu && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuClick}
              className="shrink-0"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
