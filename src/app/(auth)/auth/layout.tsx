import type { ReactNode } from "react";
import { AuthLayoutShell } from "@/modules/auth";

export const runtime = "nodejs";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <AuthLayoutShell>{children}</AuthLayoutShell>;
}
