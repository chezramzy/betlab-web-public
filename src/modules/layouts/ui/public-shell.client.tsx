"use client";

import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { MobileBottomNav } from "@/modules/layouts/ui/components/mobile-bottom-nav";
import { MobileHeader } from "@/modules/layouts/ui/components/mobile-header";
import { DesktopSidebar } from "@/modules/layouts/ui/components/desktop-sidebar";
import { useSportStore } from "@/shared/hooks/stores/sport-store";
import { SportType } from "@/core/config/enums/sport-type";
import type { CurrentUser } from "@/core/auth/types";

type NavTab = "home" | "matches" | "favorites" | "settings";

interface PublicShellProps {
  children: ReactNode;
  user: CurrentUser | null;
}

export function PublicShell({ children, user }: PublicShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { activeSport, setActiveSport } = useSportStore();

  const getActiveTab = (): NavTab => {
    if (pathname === "/") return "home";
    if (pathname.startsWith("/matches")) return "matches";
    if (pathname.startsWith("/favorites")) return "favorites";
    if (pathname.startsWith("/settings")) return "settings";
    return "home";
  };

  const handleTabChange = (tab: NavTab) => {
    switch (tab) {
      case "home":
        router.push("/");
        break;
      case "matches":
        router.push("/matches");
        break;
      case "favorites":
        router.push("/favorites");
        break;
      case "settings":
        router.push("/settings");
        break;
    }
  };

  const handleSportChange = (sport: "football" | "basketball") => {
    const sportType = sport === "football" ? SportType.FOOTBALL : SportType.BASKETBALL;
    setActiveSport(sportType);
  };

  return (
    <div className="min-h-screen bg-background">
      <DesktopSidebar
        className="hidden lg:flex"
        activeTab={getActiveTab()}
        onTabChange={handleTabChange}
        user={
          user
            ? {
                name: user.email || "User",
                email: user.email || "",
                avatar: undefined,
              }
            : undefined
        }
      />

      <MobileHeader
        className="lg:hidden"
        showSportSelector
        activeSport={activeSport === SportType.FOOTBALL ? "football" : "basketball"}
        onSportChange={handleSportChange}
        avatarFallback={user?.email?.[0].toUpperCase() || "U"}
      />

      <main className="lg:ml-72">
        <div className="pb-[calc(64px+env(safe-area-inset-bottom))] lg:pb-0">{children}</div>
      </main>

      <MobileBottomNav
        className="lg:hidden"
        activeTab={getActiveTab()}
        onTabChange={handleTabChange}
      />
    </div>
  );
}
