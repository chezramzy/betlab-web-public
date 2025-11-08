# Pages d'authentification BetLab

## Pages créées

### 1. Login Page (`/auth/login`)
**Chemin**: `app/auth/login/page.tsx`

#### Features
- Formulaire de connexion avec email et mot de passe
- Champ password avec toggle show/hide (utilise PasswordInput)
- Checkbox "Se souvenir de moi"
- Validation côté client avec Zod (LoginSchema)
- Integration avec React Hook Form
- Loading state pendant l'authentification
- Messages d'erreur avec Toast notifications
- Liens vers:
  - Mot de passe oublié: `/auth/forgot-password`
  - Création de compte: `/auth/register`
- Redirect vers `/` après connexion réussie

#### Specs techniques
- Mobile-first responsive design
- Inputs: 48px height (touch-friendly)
- Spacing: 16px vertical entre les champs
- Padding container: 24px
- Button variant: `primary` (navy)
- Dark mode support
- Safe area insets iOS

### 2. Register Page (`/auth/register`)
**Chemin**: `app/auth/register/page.tsx`

#### Features
- Formulaire d'inscription avec:
  - Email
  - Password avec indicateur de sécurité
  - Confirm Password
  - Checkbox CGU/Privacy Policy
- Validation stricte du mot de passe (min 8 caractères, majuscule, minuscule, chiffre)
- Vérification que les mots de passe correspondent
- Validation Zod (RegisterSchema)
- Loading state pendant création du compte
- Toast notifications pour feedback
- Lien vers `/auth/login` pour utilisateurs existants
- Redirect vers `/onboarding` après inscription réussie

#### Specs techniques
- Mobile-first responsive design
- Inputs: 48px height
- Button variant: `lime` (CTA)
- Spacing: 16px vertical
- Hint text pour password requirements
- Dark mode support
- Safe area insets iOS

## Composants créés

### Toast System
**Fichiers**:
- `lib/hooks/use-toast.tsx` - Hook React pour gérer les toasts
- `lib/components/ui/toast.tsx` - Composant UI Toaster

#### Features
- Toast Provider avec Context API
- Support variants: `default`, `destructive`
- Auto-dismiss configurable (default: 5000ms)
- Position: bottom-right sur desktop, bottom sur mobile
- Animation d'entrée/sortie
- Dismiss manuel avec bouton X
- Responsive: max-width 420px

## Integration avec le Store

Les deux pages utilisent `useAuthStore()` de Zustand:
- **Login**: `signIn(email, password)` → redirect vers `/`
- **Register**: `signUp(email, password)` → redirect vers `/onboarding`

## Validation Schemas

Utilise les schemas Zod de `lib/validations/auth-schema.ts`:
- `LoginSchema`: email + password (min 8 chars) + rememberMe optionnel
- `RegisterSchema`: email + password (strict) + confirmPassword + acceptTerms

## Tests manuels à effectuer

### Login Page
- [ ] Accès à http://localhost:3000/auth/login
- [ ] Validation email invalide
- [ ] Validation password vide
- [ ] Toggle show/hide password fonctionne
- [ ] Checkbox "Se souvenir de moi" fonctionne
- [ ] Lien "Mot de passe oublié" pointe vers `/auth/forgot-password`
- [ ] Lien "Créer un compte" pointe vers `/auth/register`
- [ ] Login avec credentials invalides affiche toast destructive
- [ ] Login avec credentials valides redirect vers `/`
- [ ] Loading state pendant requête
- [ ] Responsive mobile (width < 640px)
- [ ] Dark mode

### Register Page
- [ ] Accès à http://localhost:3000/auth/register
- [ ] Validation email invalide
- [ ] Validation password faible (< 8 chars, sans majuscule, etc.)
- [ ] Validation passwords ne correspondent pas
- [ ] Validation CGU non acceptées
- [ ] Toggle show/hide sur les 2 champs password
- [ ] Liens CGU et Privacy pointent vers `/terms` et `/privacy`
- [ ] Lien "Se connecter" pointe vers `/auth/login`
- [ ] Register avec email existant affiche erreur
- [ ] Register réussie redirect vers `/onboarding`
- [ ] Loading state pendant création
- [ ] Responsive mobile
- [ ] Dark mode

## Design mobile

### Inputs
- Height: 48px (h-12)
- Width: 100% (w-full)
- Font-size: 16px (text-base) - évite le zoom iOS
- Padding: 12px (px-3 py-3)
- Border radius: 6px (rounded-md)

### Buttons
- Height: 48px (h-12)
- Width: 100% (w-full)
- Min-height: 44px (touch target)
- Font-weight: semibold (lime variant)

### Spacing
- Container padding: 24px (p-6)
- Vertical spacing: 16px (space-y-4)
- Form spacing: 8px (space-y-2)

### Safe Areas iOS
- Bottom: `<div className="h-[env(safe-area-inset-bottom)]" />`

## Dépendances

- next 16.0.1
- react-hook-form
- @hookform/resolvers/zod
- zod
- zustand
- lucide-react (icons)
- @radix-ui/react-checkbox
- @radix-ui/react-label

## Notes

- Les toasts utilisent un système custom (pas sonner) pour contrôle total
- Les schemas Zod sont réutilisés du BATCH 1
- Les composants UI (Button, Input, PasswordInput, Checkbox, Label) sont du BATCH 1
- authStore est configuré dans BATCH 1
- Le ToastProvider est ajouté au Providers principal
