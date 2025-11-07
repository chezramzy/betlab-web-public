"use client"

import * as React from "react"
import { Button } from "@/lib/components/ui/button"
import {
  BottomSheet,
  BottomSheetTrigger,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetFooter,
  BottomSheetTitle,
  BottomSheetDescription,
  BottomSheetClose,
} from "@/lib/components/ui/bottom-sheet"

/**
 * BottomSheetExample - Exemple d'utilisation du composant BottomSheet
 *
 * Ce composant démontre:
 * - L'ouverture d'un bottom sheet
 * - Le swipe down pour fermer (mobile)
 * - La drag handle (poignée)
 * - Le contenu scrollable
 * - Les actions dans le footer
 */

export function BottomSheetExample() {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Bottom Sheet Example</h2>

      {/* Basic Bottom Sheet */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Usage</h3>
        <BottomSheet>
          <BottomSheetTrigger asChild>
            <Button variant="outline">Open Bottom Sheet</Button>
          </BottomSheetTrigger>
          <BottomSheetContent>
            <BottomSheetHeader>
              <BottomSheetTitle>Welcome to BottomSheet</BottomSheetTitle>
              <BottomSheetDescription>
                Swipe down or tap outside to close
              </BottomSheetDescription>
            </BottomSheetHeader>
            <div className="px-6 py-4">
              <p className="text-text-secondary">
                This is a mobile-optimized bottom sheet that slides up from the
                bottom of the screen. It's perfect for mobile interfaces and
                provides a native app-like experience.
              </p>
            </div>
            <BottomSheetFooter>
              <BottomSheetClose asChild>
                <Button variant="outline">Close</Button>
              </BottomSheetClose>
              <Button>Confirm</Button>
            </BottomSheetFooter>
          </BottomSheetContent>
        </BottomSheet>
      </div>

      {/* Scrollable Content */}
      <div className="space-y-4 mt-8">
        <h3 className="text-lg font-semibold">With Scrollable Content</h3>
        <BottomSheet>
          <BottomSheetTrigger asChild>
            <Button variant="outline">Open with Long Content</Button>
          </BottomSheetTrigger>
          <BottomSheetContent maxHeight="70vh">
            <BottomSheetHeader>
              <BottomSheetTitle>Scrollable Content</BottomSheetTitle>
              <BottomSheetDescription>
                This sheet has a lot of content that scrolls
              </BottomSheetDescription>
            </BottomSheetHeader>
            <div className="px-6 py-4 space-y-4">
              {Array.from({ length: 20 }, (_, i) => (
                <div
                  key={i}
                  className="p-4 bg-gray-ultra-light rounded-lg border border-gray-light"
                >
                  <h4 className="font-semibold text-text-primary">
                    Item {i + 1}
                  </h4>
                  <p className="text-sm text-text-secondary">
                    This is item number {i + 1} in the scrollable list.
                  </p>
                </div>
              ))}
            </div>
            <BottomSheetFooter>
              <BottomSheetClose asChild>
                <Button className="w-full">Done</Button>
              </BottomSheetClose>
            </BottomSheetFooter>
          </BottomSheetContent>
        </BottomSheet>
      </div>

      {/* Without Handle */}
      <div className="space-y-4 mt-8">
        <h3 className="text-lg font-semibold">Without Drag Handle</h3>
        <BottomSheet>
          <BottomSheetTrigger asChild>
            <Button variant="outline">Open without Handle</Button>
          </BottomSheetTrigger>
          <BottomSheetContent showHandle={false}>
            <BottomSheetHeader>
              <BottomSheetTitle>No Drag Handle</BottomSheetTitle>
              <BottomSheetDescription>
                This sheet doesn't have a drag handle
              </BottomSheetDescription>
            </BottomSheetHeader>
            <div className="px-6 py-4">
              <p className="text-text-secondary">
                You can still close this by tapping outside or using the close
                button.
              </p>
            </div>
            <BottomSheetFooter>
              <BottomSheetClose asChild>
                <Button variant="outline" className="w-full">
                  Close
                </Button>
              </BottomSheetClose>
            </BottomSheetFooter>
          </BottomSheetContent>
        </BottomSheet>
      </div>

      {/* Non-Swipeable */}
      <div className="space-y-4 mt-8">
        <h3 className="text-lg font-semibold">Non-Swipeable</h3>
        <BottomSheet>
          <BottomSheetTrigger asChild>
            <Button variant="outline">Open Non-Swipeable</Button>
          </BottomSheetTrigger>
          <BottomSheetContent swipeable={false}>
            <BottomSheetHeader>
              <BottomSheetTitle>Important Action</BottomSheetTitle>
              <BottomSheetDescription>
                This sheet cannot be swiped away
              </BottomSheetDescription>
            </BottomSheetHeader>
            <div className="px-6 py-4">
              <p className="text-text-secondary">
                Use this for important actions that require explicit
                confirmation. The user must tap a button to close it.
              </p>
            </div>
            <BottomSheetFooter>
              <BottomSheetClose asChild>
                <Button variant="outline">Cancel</Button>
              </BottomSheetClose>
              <Button variant="default">Confirm Action</Button>
            </BottomSheetFooter>
          </BottomSheetContent>
        </BottomSheet>
      </div>

      {/* Form Example */}
      <div className="space-y-4 mt-8">
        <h3 className="text-lg font-semibold">Form in Bottom Sheet</h3>
        <BottomSheet>
          <BottomSheetTrigger asChild>
            <Button>Add New Bet</Button>
          </BottomSheetTrigger>
          <BottomSheetContent>
            <BottomSheetHeader>
              <BottomSheetTitle>Add New Bet</BottomSheetTitle>
              <BottomSheetDescription>
                Fill in the details for your new bet
              </BottomSheetDescription>
            </BottomSheetHeader>
            <form className="px-6 py-4 space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="match"
                  className="text-sm font-medium text-text-primary"
                >
                  Match
                </label>
                <input
                  id="match"
                  type="text"
                  placeholder="e.g., PSG vs OM"
                  className="w-full px-4 py-2 border border-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-navy"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="amount"
                  className="text-sm font-medium text-text-primary"
                >
                  Amount
                </label>
                <input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  className="w-full px-4 py-2 border border-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-navy"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="odds"
                  className="text-sm font-medium text-text-primary"
                >
                  Odds
                </label>
                <input
                  id="odds"
                  type="text"
                  placeholder="e.g., 2.50"
                  className="w-full px-4 py-2 border border-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-navy"
                />
              </div>
            </form>
            <BottomSheetFooter>
              <BottomSheetClose asChild>
                <Button variant="outline">Cancel</Button>
              </BottomSheetClose>
              <Button type="submit">Add Bet</Button>
            </BottomSheetFooter>
          </BottomSheetContent>
        </BottomSheet>
      </div>
    </div>
  )
}
