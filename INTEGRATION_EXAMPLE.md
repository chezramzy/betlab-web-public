# Onboarding Integration Guide

Guide d'intégration du flow d'onboarding dans BetLab.

## 1. Intégration dans le Layout (Recommandé)

### Option A: Dans `app/layout.tsx`

```tsx
import { OnboardingRedirect } from '@/lib/components/onboarding';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <OnboardingRedirect>
          {children}
        </OnboardingRedirect>
      </body>
    </html>
  );
}
```

### Option B: Dans un Middleware Next.js

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if user is authenticated
  const user = request.cookies.get('sb-access-token');

  if (user) {
    // Check if onboarding is completed
    const onboardingCompleted = request.cookies.get('onboarding-completed');

    const isOnboardingPage = request.nextUrl.pathname.startsWith('/onboarding');
    const isPublicPage = ['/auth/login', '/auth/signup'].some(path =>
      request.nextUrl.pathname.startsWith(path)
    );

    // Redirect to onboarding if not completed
    if (!onboardingCompleted && !isOnboardingPage && !isPublicPage) {
      return NextResponse.redirect(new URL('/onboarding', request.url));
    }

    // Redirect to home if onboarding is completed but trying to access onboarding
    if (onboardingCompleted && isOnboardingPage) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

## 2. Redirection après Signup

Dans votre composant de signup:

```tsx
// app/auth/signup/page.tsx
"use client";

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth-store';

export default function SignupPage() {
  const router = useRouter();
  const { signUp } = useAuthStore();

  const handleSignup = async (email: string, password: string) => {
    try {
      await signUp(email, password);

      // Redirect to onboarding after successful signup
      router.push('/onboarding');
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      handleSignup(
        formData.get('email') as string,
        formData.get('password') as string
      );
    }}>
      {/* Form fields */}
    </form>
  );
}
```

## 3. Utilisation du Hook Personnalisé

Dans n'importe quel composant:

```tsx
"use client";

import { useOnboarding } from '@/lib/hooks/use-onboarding';

export function UserProfile() {
  const {
    firstName,
    lastName,
    selectedLeagues,
    isCompleted,
  } = useOnboarding();

  if (!isCompleted) {
    return <div>Veuillez compléter l'onboarding</div>;
  }

  return (
    <div>
      <h1>Bienvenue {firstName} {lastName} !</h1>
      <p>Vous suivez {selectedLeagues.length} ligues</p>
    </div>
  );
}
```

## 4. Accès Direct au Store

Pour des usages avancés:

```tsx
"use client";

import { useOnboardingStore } from '@/lib/stores/onboarding-store';

export function AdminPanel() {
  const { reset, complete, currentStep } = useOnboardingStore();

  const handleReset = () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser l\'onboarding ?')) {
      reset();
    }
  };

  return (
    <div>
      <p>Current step: {currentStep + 1}/4</p>
      <button onClick={handleReset}>Reset Onboarding</button>
    </div>
  );
}
```

## 5. Provider pour Analytics (Optionnel)

Si vous voulez tracker les étapes:

```tsx
// app/layout.tsx
import { OnboardingProvider } from '@/lib/components/onboarding';

export default function RootLayout({ children }) {
  const handleStepChange = (step: number) => {
    // Analytics tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'onboarding_step', {
        step: step + 1,
      });
    }
  };

  return (
    <OnboardingProvider onStepChange={handleStepChange}>
      {children}
    </OnboardingProvider>
  );
}
```

## 6. Supabase Configuration

Assurez-vous que votre table `profiles` existe:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  avatar_url TEXT,
  favorite_leagues JSONB DEFAULT '[]'::jsonb,
  prediction_types JSONB DEFAULT '[]'::jsonb,
  risk_profile TEXT CHECK (risk_profile IN ('conservative', 'balanced', 'aggressive')),
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## 7. Environment Variables

Assurez-vous d'avoir:

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 8. Testing

### Test 1: Navigation

1. Visitez `/onboarding`
2. Cliquez "Suivant" sans remplir → Toast error
3. Remplissez le formulaire → Cliquez "Suivant"
4. Vérifiez que la progress bar s'anime

### Test 2: Persistance

1. Remplissez Step 0 et passez à Step 1
2. Rafraîchissez la page (F5)
3. Vérifiez que vous êtes toujours sur Step 1
4. Ouvrez DevTools → Application → Local Storage
5. Cherchez `onboarding-storage`

### Test 3: Swipe Gestures (Mobile)

1. Ouvrez en mode mobile (DevTools)
2. Swipe left → Next step
3. Swipe right → Previous step

### Test 4: Completion

1. Complétez toutes les étapes
2. Cliquez "Découvrir l'app"
3. Vérifiez redirection vers `/`
4. Vérifiez données dans Supabase (table profiles)

### Test 5: Dark Mode

1. Activez dark mode (si disponible)
2. Vérifiez que tous les composants s'adaptent
3. Les couleurs Lime/Navy doivent rester visibles

## 9. Troubleshooting

### Erreur: "Supabase client not initialized"

Solution:
```bash
# Vérifiez vos variables d'environnement
cat .env.local

# Redémarrez le serveur dev
pnpm dev
```

### Erreur: "Cannot find module '@/lib/stores/onboarding-store'"

Solution:
```bash
# Vérifiez que le fichier existe
ls lib/stores/onboarding-store.ts

# Vérifiez tsconfig.json paths
cat tsconfig.json | grep paths
```

### Le confetti ne s'affiche pas

Solution:
```tsx
// Vérifiez que react-confetti est installé
pnpm list react-confetti

// Si absent:
pnpm add react-confetti react-use
```

### Swipe gestures ne fonctionnent pas

Solution:
```tsx
// Vérifiez react-swipeable
pnpm list react-swipeable

// Vérifiez que vous êtes en mode mobile (DevTools)
```

## 10. Code Snippets Utiles

### Récupérer les données d'onboarding

```tsx
import { useOnboardingStore } from '@/lib/stores/onboarding-store';

function Component() {
  const data = useOnboardingStore((state) => ({
    firstName: state.firstName,
    lastName: state.lastName,
    leagues: state.selectedLeagues,
    predictions: state.selectedPredictionTypes,
    risk: state.riskProfile,
  }));

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
```

### Forcer le reset de l'onboarding

```tsx
import { useOnboardingStore } from '@/lib/stores/onboarding-store';

function ResetButton() {
  const reset = useOnboardingStore((state) => state.reset);

  return (
    <button onClick={reset}>
      Reset Onboarding
    </button>
  );
}
```

### Vérifier si l'onboarding est complété

```tsx
import { useOnboardingStore } from '@/lib/stores/onboarding-store';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

function ProtectedPage() {
  const router = useRouter();
  const isCompleted = useOnboardingStore((state) => state.isCompleted);

  useEffect(() => {
    if (!isCompleted) {
      router.push('/onboarding');
    }
  }, [isCompleted, router]);

  return <div>Protected content</div>;
}
```

---

## Résumé

1. Ajoutez `OnboardingRedirect` dans votre layout
2. Configurez la table Supabase `profiles`
3. Redirigez vers `/onboarding` après signup
4. Testez le flow complet
5. Déployez !

Pour plus de détails, consultez:
- `lib/components/onboarding/README.md`
- `ONBOARDING_CHANGELOG.md`
- `ONBOARDING_SUMMARY.md`
