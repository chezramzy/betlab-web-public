/**
 * Auth Layout
 *
 * Layout for authentication pages (login, register, forgot-password, etc.)
 * Includes ToastProvider for form feedback.
 */

"use client";

import { Toaster as SonnerToaster } from "@/shared/ui/sonner";
import { Toaster } from "@/shared/ui/toast";
import { ToastProvider } from "@/shared/hooks/use-toast";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      {children}
      <SonnerToaster />
      <Toaster />
    </ToastProvider>
  );
}
