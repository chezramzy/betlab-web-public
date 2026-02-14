'use client'

import * as React from 'react'
import { ArrowLeft, Search, Bell, Sparkles } from 'lucide-react'
import { cn } from '@/shared/utils'
import { Button } from '@/presentation/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/presentation/components/ui/avatar'

export interface MobileHeaderProps {
  title?: string
  showBack?: boolean
  onBackClick?: () => void
  showAvatar?: boolean
  avatarSrc?: string
  avatarFallback?: string
  onAvatarClick?: () => void
  showMenu?: boolean
  onMenuClick?: () => void
  showSearch?: boolean
  onSearchClick?: () => void
  showNotifications?: boolean
  notificationCount?: number
  onNotificationClick?: () => void
  collapsible?: boolean
  collapsed?: boolean
  className?: string
}

export function MobileHeader({
  title,
  showBack = false,
  onBackClick,
  showAvatar = true,
  avatarSrc,
  avatarFallback = 'U',
  onAvatarClick,
  showMenu = false,
  onMenuClick,
  showSearch = false,
  onSearchClick,
  showNotifications = false,
  notificationCount = 0,
  onNotificationClick,
  collapsible = false,
  collapsed = false,
  className,
}: MobileHeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-40',
        'bg-white/80 backdrop-blur-2xl backdrop-saturate-150',
        'border-b border-gray-200/30',
        'transition-all duration-300 ease-out',
        collapsible && collapsed ? 'h-12' : 'h-[60px]',
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
          collapsible && collapsed ? 'h-12' : 'h-[60px]'
        )}
      >
        {/* Left — Logo / Back */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {showBack ? (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onBackClick}
              className="shrink-0 -ml-1 h-9 w-9 rounded-xl hover:bg-navy/5 active:scale-95 transition-all"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5 text-navy" />
            </Button>
          ) : (
            <div className="flex items-center gap-2.5 shrink-0">
              {/* Premium Logo Mark */}
              <div className="relative h-9 w-9 rounded-xl gradient-navy flex items-center justify-center shadow-[0_2px_8px_rgba(0,51,102,0.25)] ring-1 ring-white/10">
                <span className="text-lime font-black text-[11px] tracking-tighter leading-none">BL</span>
                {/* Subtle glow */}
                <div className="absolute inset-0 rounded-xl bg-lime/10 blur-sm -z-10" />
              </div>
              {!collapsed && (
                <div className="flex flex-col">
                  <span className="text-[15px] font-black text-navy tracking-tight leading-none">
                    Bet<span className="text-lime-600">Lab</span>
                  </span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Sparkles className="h-2.5 w-2.5 text-lime-500" />
                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-[0.15em] leading-none">
                      Intelligence
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Center — Title (if provided) */}
        {title && !collapsed && (
          <div className="flex items-center justify-center flex-1 min-w-0">
            <h1 className="text-[13px] font-bold text-navy truncate px-2 tracking-tight">
              {title}
            </h1>
          </div>
        )}

        {/* Right — Actions */}
        <div className="flex items-center gap-1 justify-end flex-1">
          {showSearch && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onSearchClick}
              className="shrink-0 h-9 w-9 rounded-xl hover:bg-navy/5 active:scale-95 transition-all"
              aria-label="Search"
            >
              <Search className="h-[17px] w-[17px] text-navy/50" />
            </Button>
          )}

          {showNotifications && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onNotificationClick}
              className="shrink-0 h-9 w-9 rounded-xl relative hover:bg-navy/5 active:scale-95 transition-all"
              aria-label={`Notifications${notificationCount > 0 ? ` (${notificationCount})` : ''}`}
            >
              <Bell className="h-[17px] w-[17px] text-navy/50" />
              {notificationCount > 0 && (
                <span
                  className={cn(
                    'absolute top-0.5 right-0.5',
                    'flex items-center justify-center',
                    'min-w-[16px] h-[16px] px-1',
                    'text-[8px] font-black text-white',
                    'bg-gradient-to-br from-red-500 to-red-600 rounded-full',
                    'shadow-[0_2px_6px_rgba(239,68,68,0.4)]',
                    'ring-2 ring-white'
                  )}
                >
                  {notificationCount > 99 ? '99+' : notificationCount}
                </span>
              )}
            </Button>
          )}

          {showAvatar && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onAvatarClick}
              className="shrink-0 rounded-xl p-0 h-9 w-9 hover:ring-2 hover:ring-lime/30 active:scale-95 transition-all"
              aria-label="User menu"
            >
              <Avatar className="h-8 w-8 rounded-xl ring-1 ring-gray-200/60 shadow-sm">
                <AvatarImage src={avatarSrc} alt="User avatar" className="rounded-xl" />
                <AvatarFallback className="rounded-xl text-[10px] font-bold bg-navy text-lime">
                  {avatarFallback}
                </AvatarFallback>
              </Avatar>
            </Button>
          )}

          {showMenu && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onMenuClick}
              className="shrink-0 h-9 w-9 rounded-xl hover:bg-navy/5 active:scale-95 transition-all"
              aria-label="Open menu"
            >
              {/* Custom hamburger icon */}
              <div className="flex flex-col gap-[5px] items-center justify-center">
                <div className="w-[16px] h-[1.5px] bg-navy/60 rounded-full" />
                <div className="w-[12px] h-[1.5px] bg-navy/40 rounded-full" />
              </div>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
