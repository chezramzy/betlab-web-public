"use client"

import * as React from "react"
import { Button } from "@/lib/components/ui/button"
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalTitle,
  ModalDescription,
  ModalClose,
  ModalBody,
} from "@/lib/components/ui/modal"

/**
 * ModalExample - Exemple d'utilisation du composant Modal
 *
 * Ce composant démontre:
 * - Modal centré sur desktop
 * - Full screen sur mobile (<768px)
 * - Animation slide-up sur mobile
 * - Scrollable content
 * - Dark mode support
 */

export function ModalExample() {
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Modal Example</h2>

      {/* Basic Modal */}
      <div className="space-y-4 mb-8">
        <h3 className="text-lg font-semibold">Basic Modal</h3>
        <Modal>
          <ModalTrigger asChild>
            <Button variant="outline">Open Modal</Button>
          </ModalTrigger>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Welcome to Modal</ModalTitle>
              <ModalDescription>
                This modal is centered on desktop and full screen on mobile
              </ModalDescription>
            </ModalHeader>
            <ModalBody>
              <p>
                This is a responsive modal component. On desktop, it appears as
                a centered dialog. On mobile devices (smaller than 768px), it
                takes up the full screen with a slide-up animation.
              </p>
            </ModalBody>
            <ModalFooter>
              <ModalClose asChild>
                <Button variant="outline">Cancel</Button>
              </ModalClose>
              <Button>Confirm</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>

      {/* Mobile Fullscreen Variant */}
      <div className="space-y-4 mb-8">
        <h3 className="text-lg font-semibold">Mobile Fullscreen Variant</h3>
        <Modal>
          <ModalTrigger asChild>
            <Button variant="outline">Open Fullscreen Modal</Button>
          </ModalTrigger>
          <ModalContent variant="mobile-fullscreen">
            <ModalHeader>
              <ModalTitle>Mobile Fullscreen</ModalTitle>
              <ModalDescription>
                This modal is fullscreen on mobile
              </ModalDescription>
            </ModalHeader>
            <ModalBody>
              <p className="mb-4">
                On mobile devices, this modal takes up the entire screen,
                providing a focused experience without distractions.
              </p>
              <p className="text-text-secondary text-sm">
                On desktop, it remains a standard centered modal.
              </p>
            </ModalBody>
            <ModalFooter>
              <ModalClose asChild>
                <Button variant="outline">Close</Button>
              </ModalClose>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>

      {/* Scrollable Content */}
      <div className="space-y-4 mb-8">
        <h3 className="text-lg font-semibold">With Scrollable Content</h3>
        <Modal>
          <ModalTrigger asChild>
            <Button variant="outline">Open with Long Content</Button>
          </ModalTrigger>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Terms and Conditions</ModalTitle>
              <ModalDescription>
                Please read our terms carefully
              </ModalDescription>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                {Array.from({ length: 15 }, (_, i) => (
                  <div key={i}>
                    <h4 className="font-semibold text-text-primary mb-2">
                      Section {i + 1}
                    </h4>
                    <p className="text-sm text-text-secondary">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris.
                    </p>
                  </div>
                ))}
              </div>
            </ModalBody>
            <ModalFooter>
              <ModalClose asChild>
                <Button variant="outline">Decline</Button>
              </ModalClose>
              <Button>Accept</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>

      {/* Form in Modal */}
      <div className="space-y-4 mb-8">
        <h3 className="text-lg font-semibold">Form in Modal</h3>
        <Modal>
          <ModalTrigger asChild>
            <Button>Create New Bet</Button>
          </ModalTrigger>
          <ModalContent variant="mobile-fullscreen">
            <ModalHeader>
              <ModalTitle>Create New Bet</ModalTitle>
              <ModalDescription>
                Enter the details for your new bet
              </ModalDescription>
            </ModalHeader>
            <ModalBody>
              <form className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="match-name"
                    className="text-sm font-medium text-text-primary"
                  >
                    Match Name
                  </label>
                  <input
                    id="match-name"
                    type="text"
                    placeholder="e.g., PSG vs OM"
                    className="w-full px-4 py-2 border border-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-navy"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="bet-amount"
                      className="text-sm font-medium text-text-primary"
                    >
                      Amount
                    </label>
                    <input
                      id="bet-amount"
                      type="number"
                      placeholder="100"
                      className="w-full px-4 py-2 border border-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-navy"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="bet-odds"
                      className="text-sm font-medium text-text-primary"
                    >
                      Odds
                    </label>
                    <input
                      id="bet-odds"
                      type="text"
                      placeholder="2.50"
                      className="w-full px-4 py-2 border border-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-navy"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="bet-type"
                    className="text-sm font-medium text-text-primary"
                  >
                    Bet Type
                  </label>
                  <select
                    id="bet-type"
                    className="w-full px-4 py-2 border border-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-navy"
                  >
                    <option value="single">Single</option>
                    <option value="multiple">Multiple</option>
                    <option value="system">System</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="bet-notes"
                    className="text-sm font-medium text-text-primary"
                  >
                    Notes (Optional)
                  </label>
                  <textarea
                    id="bet-notes"
                    rows={3}
                    placeholder="Add any notes about this bet..."
                    className="w-full px-4 py-2 border border-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-navy resize-none"
                  />
                </div>
              </form>
            </ModalBody>
            <ModalFooter>
              <ModalClose asChild>
                <Button variant="outline">Cancel</Button>
              </ModalClose>
              <Button type="submit">Create Bet</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>

      {/* Confirmation Modal */}
      <div className="space-y-4 mb-8">
        <h3 className="text-lg font-semibold">Confirmation Dialog</h3>
        <Modal>
          <ModalTrigger asChild>
            <Button variant="outline" className="bg-error/10 text-error border-error">
              Delete Account
            </Button>
          </ModalTrigger>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Are you absolutely sure?</ModalTitle>
              <ModalDescription>
                This action cannot be undone
              </ModalDescription>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-3">
                <p className="text-text-secondary">
                  This will permanently delete your account and remove all of
                  your data from our servers.
                </p>
                <div className="p-4 bg-error/10 border border-error rounded-lg">
                  <p className="text-sm text-error font-medium">
                    Warning: This action is irreversible
                  </p>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <ModalClose asChild>
                <Button variant="outline">Cancel</Button>
              </ModalClose>
              <Button className="bg-error hover:bg-error/90">
                Yes, Delete Account
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>

      {/* Success Modal */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Success Message</h3>
        <Modal>
          <ModalTrigger asChild>
            <Button variant="outline">Show Success</Button>
          </ModalTrigger>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Bet Created Successfully!</ModalTitle>
              <ModalDescription>
                Your bet has been added to your account
              </ModalDescription>
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-success"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-text-secondary">
                  You can view your bet in the dashboard or continue adding more
                  bets.
                </p>
              </div>
            </ModalBody>
            <ModalFooter>
              <ModalClose asChild>
                <Button variant="outline">Go to Dashboard</Button>
              </ModalClose>
              <ModalClose asChild>
                <Button>Add Another Bet</Button>
              </ModalClose>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  )
}
