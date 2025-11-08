import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-3 px-4 text-center">
      <span className="text-6xl">🤔</span>
      <p className="text-sm uppercase tracking-wide text-muted-foreground">404</p>
      <h1 className="text-2xl font-semibold">Page introuvable</h1>
      <p className="max-w-sm text-muted-foreground">
        Ce lien semble invalide. Vérifiez l&apos;URL ou retournez à l&apos;accueil pour reprendre votre
        navigation.
      </p>
      <Link
        href="/"
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
      >
        Revenir à l&apos;accueil
      </Link>
    </div>
  );
}
