"use client"

import * as React from "react"
import { Button } from "@/lib/components/ui/button"
import {
  SwipeableTabs,
  SwipeableTabsList,
  SwipeableTabsTrigger,
  SwipeableTabsContent,
} from "@/lib/components/ui/swipeable-tabs"

/**
 * SwipeableTabsExample - Exemple d'utilisation du composant SwipeableTabs
 *
 * Ce composant démontre:
 * - Les tabs avec swipe left/right pour naviguer
 * - Le scroll horizontal des tabs
 * - Les animations fluides
 * - Les zones tactiles optimisées (44px minimum)
 */

export function SwipeableTabsExample() {
  const [activeTab, setActiveTab] = React.useState("overview")

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Swipeable Tabs Example</h2>

      {/* Basic Swipeable Tabs */}
      <div className="space-y-4 mb-8">
        <h3 className="text-lg font-semibold">Basic Usage</h3>
        <SwipeableTabs defaultValue="tab1">
          <SwipeableTabsList>
            <SwipeableTabsTrigger value="tab1">Tab 1</SwipeableTabsTrigger>
            <SwipeableTabsTrigger value="tab2">Tab 2</SwipeableTabsTrigger>
            <SwipeableTabsTrigger value="tab3">Tab 3</SwipeableTabsTrigger>
          </SwipeableTabsList>
          <SwipeableTabsContent value="tab1">
            <div className="p-6 bg-gray-ultra-light rounded-lg">
              <h4 className="font-semibold mb-2">Tab 1 Content</h4>
              <p className="text-text-secondary">
                Swipe left or tap Tab 2 to navigate. The swipe gesture makes
                navigation feel natural on mobile devices.
              </p>
            </div>
          </SwipeableTabsContent>
          <SwipeableTabsContent value="tab2">
            <div className="p-6 bg-gray-ultra-light rounded-lg">
              <h4 className="font-semibold mb-2">Tab 2 Content</h4>
              <p className="text-text-secondary">
                You can swipe left to Tab 3 or right to go back to Tab 1.
              </p>
            </div>
          </SwipeableTabsContent>
          <SwipeableTabsContent value="tab3">
            <div className="p-6 bg-gray-ultra-light rounded-lg">
              <h4 className="font-semibold mb-2">Tab 3 Content</h4>
              <p className="text-text-secondary">
                This is the last tab. Swipe right to go back.
              </p>
            </div>
          </SwipeableTabsContent>
        </SwipeableTabs>
      </div>

      {/* BetLab Dashboard Example */}
      <div className="space-y-4 mb-8">
        <h3 className="text-lg font-semibold">BetLab Dashboard Style</h3>
        <SwipeableTabs
          defaultValue={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <SwipeableTabsList scrollable>
            <SwipeableTabsTrigger value="overview">
              Overview
            </SwipeableTabsTrigger>
            <SwipeableTabsTrigger value="live">Live</SwipeableTabsTrigger>
            <SwipeableTabsTrigger value="upcoming">
              Upcoming
            </SwipeableTabsTrigger>
            <SwipeableTabsTrigger value="history">
              History
            </SwipeableTabsTrigger>
            <SwipeableTabsTrigger value="stats">Stats</SwipeableTabsTrigger>
          </SwipeableTabsList>

          <SwipeableTabsContent value="overview" swipeable>
            <div className="py-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-navy text-white rounded-lg">
                  <p className="text-sm opacity-80">Total Bets</p>
                  <p className="text-2xl font-bold">127</p>
                </div>
                <div className="p-4 bg-lime rounded-lg">
                  <p className="text-sm text-navy">Win Rate</p>
                  <p className="text-2xl font-bold text-navy">68%</p>
                </div>
              </div>
              <p className="text-text-secondary text-sm">
                Swipe left to view live bets
              </p>
            </div>
          </SwipeableTabsContent>

          <SwipeableTabsContent value="live" swipeable>
            <div className="py-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-4 border border-gray-light rounded-lg flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold">Match {i}</p>
                    <p className="text-sm text-text-secondary">In Progress</p>
                  </div>
                  <span className="px-3 py-1 bg-live text-white text-xs font-semibold rounded-full">
                    LIVE
                  </span>
                </div>
              ))}
            </div>
          </SwipeableTabsContent>

          <SwipeableTabsContent value="upcoming" swipeable>
            <div className="py-6 space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="p-4 border border-gray-light rounded-lg"
                >
                  <p className="font-semibold">Upcoming Match {i}</p>
                  <p className="text-sm text-text-secondary">
                    Starts in {i * 2} hours
                  </p>
                </div>
              ))}
            </div>
          </SwipeableTabsContent>

          <SwipeableTabsContent value="history" swipeable>
            <div className="py-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-4 border border-gray-light rounded-lg flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold">Past Match {i}</p>
                    <p className="text-sm text-text-secondary">
                      Completed yesterday
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      i % 2 === 0
                        ? "bg-success/10 text-success"
                        : "bg-error/10 text-error"
                    }`}
                  >
                    {i % 2 === 0 ? "WON" : "LOST"}
                  </span>
                </div>
              ))}
            </div>
          </SwipeableTabsContent>

          <SwipeableTabsContent value="stats" swipeable>
            <div className="py-6 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Win Rate</span>
                  <span className="font-semibold">68%</span>
                </div>
                <div className="w-full bg-gray-light rounded-full h-2">
                  <div
                    className="bg-success h-2 rounded-full"
                    style={{ width: "68%" }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">ROI</span>
                  <span className="font-semibold">+23%</span>
                </div>
                <div className="w-full bg-gray-light rounded-full h-2">
                  <div
                    className="bg-navy h-2 rounded-full"
                    style={{ width: "23%" }}
                  />
                </div>
              </div>
            </div>
          </SwipeableTabsContent>
        </SwipeableTabs>
      </div>

      {/* Many Tabs (Scrollable) */}
      <div className="space-y-4 mb-8">
        <h3 className="text-lg font-semibold">Scrollable Tabs</h3>
        <SwipeableTabs defaultValue="sport1">
          <SwipeableTabsList scrollable>
            <SwipeableTabsTrigger value="sport1">Football</SwipeableTabsTrigger>
            <SwipeableTabsTrigger value="sport2">Basketball</SwipeableTabsTrigger>
            <SwipeableTabsTrigger value="sport3">Tennis</SwipeableTabsTrigger>
            <SwipeableTabsTrigger value="sport4">Rugby</SwipeableTabsTrigger>
            <SwipeableTabsTrigger value="sport5">Hockey</SwipeableTabsTrigger>
            <SwipeableTabsTrigger value="sport6">Baseball</SwipeableTabsTrigger>
            <SwipeableTabsTrigger value="sport7">Golf</SwipeableTabsTrigger>
          </SwipeableTabsList>
          <SwipeableTabsContent value="sport1">
            <div className="p-6 bg-gray-ultra-light rounded-lg">
              <h4 className="font-semibold mb-2">Football</h4>
              <p className="text-text-secondary">
                Scroll the tabs horizontally to see more sports.
              </p>
            </div>
          </SwipeableTabsContent>
          <SwipeableTabsContent value="sport2">
            <div className="p-6 bg-gray-ultra-light rounded-lg">
              <h4 className="font-semibold mb-2">Basketball</h4>
              <p className="text-text-secondary">NBA, Euroleague, and more.</p>
            </div>
          </SwipeableTabsContent>
          <SwipeableTabsContent value="sport3">
            <div className="p-6 bg-gray-ultra-light rounded-lg">
              <h4 className="font-semibold mb-2">Tennis</h4>
              <p className="text-text-secondary">
                Grand Slams and ATP tournaments.
              </p>
            </div>
          </SwipeableTabsContent>
          <SwipeableTabsContent value="sport4">
            <div className="p-6 bg-gray-ultra-light rounded-lg">
              <h4 className="font-semibold mb-2">Rugby</h4>
              <p className="text-text-secondary">
                International and club competitions.
              </p>
            </div>
          </SwipeableTabsContent>
          <SwipeableTabsContent value="sport5">
            <div className="p-6 bg-gray-ultra-light rounded-lg">
              <h4 className="font-semibold mb-2">Hockey</h4>
              <p className="text-text-secondary">NHL and international games.</p>
            </div>
          </SwipeableTabsContent>
          <SwipeableTabsContent value="sport6">
            <div className="p-6 bg-gray-ultra-light rounded-lg">
              <h4 className="font-semibold mb-2">Baseball</h4>
              <p className="text-text-secondary">MLB and World Series.</p>
            </div>
          </SwipeableTabsContent>
          <SwipeableTabsContent value="sport7">
            <div className="p-6 bg-gray-ultra-light rounded-lg">
              <h4 className="font-semibold mb-2">Golf</h4>
              <p className="text-text-secondary">Major championships and PGA.</p>
            </div>
          </SwipeableTabsContent>
        </SwipeableTabs>
      </div>

      {/* Non-Swipeable Example */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Non-Swipeable (Click Only)</h3>
        <SwipeableTabs defaultValue="option1">
          <SwipeableTabsList>
            <SwipeableTabsTrigger value="option1">
              Option 1
            </SwipeableTabsTrigger>
            <SwipeableTabsTrigger value="option2">
              Option 2
            </SwipeableTabsTrigger>
            <SwipeableTabsTrigger value="option3">
              Option 3
            </SwipeableTabsTrigger>
          </SwipeableTabsList>
          <SwipeableTabsContent value="option1" swipeable={false}>
            <div className="p-6 bg-gray-ultra-light rounded-lg">
              <p className="text-text-secondary">
                This tab content cannot be swiped. You must click the tabs to
                navigate.
              </p>
            </div>
          </SwipeableTabsContent>
          <SwipeableTabsContent value="option2" swipeable={false}>
            <div className="p-6 bg-gray-ultra-light rounded-lg">
              <p className="text-text-secondary">
                Use this when you want to prevent accidental swipes.
              </p>
            </div>
          </SwipeableTabsContent>
          <SwipeableTabsContent value="option3" swipeable={false}>
            <div className="p-6 bg-gray-ultra-light rounded-lg">
              <p className="text-text-secondary">
                Good for forms or important content.
              </p>
            </div>
          </SwipeableTabsContent>
        </SwipeableTabs>
      </div>
    </div>
  )
}
