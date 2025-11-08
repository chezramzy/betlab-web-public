"use client";

import type { ReactNode } from "react";
import { Toaster as SonnerToaster } from "@/shared/ui/sonner";
import { Toaster } from "@/shared/ui/toast";
import { ToastProvider } from "@/shared/hooks/use-toast";

export function AuthLayoutShell({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      {children}
      <SonnerToaster />
      <Toaster />
    </ToastProvider>
  );
}
