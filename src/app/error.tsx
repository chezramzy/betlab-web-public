'use client';

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App router error:", error);
  }, [error]);

  return (
    <html lang="fr">
      <body className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="space-y-4 text-center">
          <h1 className="text-2xl font-semibold">Une erreur est survenue</h1>
          <p className="text-muted-foreground">
            Impossible de charger la page. Réessayez dans un instant.
          </p>
          <button
            type="button"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            onClick={reset}
          >
            Réessayer
          </button>
        </div>
      </body>
    </html>
  );
}
