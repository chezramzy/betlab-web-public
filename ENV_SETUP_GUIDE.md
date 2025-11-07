# Guide de Configuration des Variables d'Environnement

## Configuration Rapide (5 minutes)

### 1. Variables Supabase (REQUIS)

Le fichier `.env.local` est déjà créé avec les placeholders. Vous devez le compléter avec vos vraies credentials Supabase.

#### Étapes:

1. **Aller sur Supabase Dashboard**
   - URL: https://supabase.com/dashboard
   - Se connecter ou créer un compte

2. **Créer ou Ouvrir un Projet**
   - Si nouveau: Cliquer "New Project"
   - Nom suggéré: `betlab-web`
   - Choisir une région proche de vos utilisateurs
   - Définir un mot de passe database (le noter!)

3. **Obtenir les Credentials**
   - Dans votre projet, aller dans: **Settings > API**
   - Copier les valeurs suivantes:

   **Project URL** (Section "Configuration")
   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```

   **anon public Key** (Section "Project API keys")
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS...
   ```

4. **Mettre à jour `.env.local`**

   Ouvrir `betlab-web/.env.local` et remplacer:

   ```bash
   # AVANT
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here

   # APRÈS (avec vos vraies valeurs)
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3Mu...
   ```

5. **Créer les Tables Supabase** (Important!)

   Dans Supabase Dashboard, aller dans **SQL Editor** et exécuter:

   ```sql
   -- Table profiles (utilisateurs)
   CREATE TABLE profiles (
     id UUID REFERENCES auth.users(id) PRIMARY KEY,
     email TEXT,
     first_name TEXT,
     last_name TEXT,
     onboarding_completed BOOLEAN DEFAULT false,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Table user_preferences
   CREATE TABLE user_preferences (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     selected_leagues TEXT[],
     selected_prediction_types TEXT[],
     risk_profile TEXT DEFAULT 'balanced',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     UNIQUE(user_id)
   );

   -- Table favorites
   CREATE TABLE favorites (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     fixture_id INTEGER NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     UNIQUE(user_id, fixture_id)
   );

   -- Enable Row Level Security
   ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
   ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
   ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

   -- Policies pour profiles
   CREATE POLICY "Users can view own profile"
     ON profiles FOR SELECT
     USING (auth.uid() = id);

   CREATE POLICY "Users can update own profile"
     ON profiles FOR UPDATE
     USING (auth.uid() = id);

   CREATE POLICY "Users can insert own profile"
     ON profiles FOR INSERT
     WITH CHECK (auth.uid() = id);

   -- Policies pour user_preferences
   CREATE POLICY "Users can view own preferences"
     ON user_preferences FOR SELECT
     USING (auth.uid() = user_id);

   CREATE POLICY "Users can update own preferences"
     ON user_preferences FOR UPDATE
     USING (auth.uid() = user_id);

   CREATE POLICY "Users can insert own preferences"
     ON user_preferences FOR INSERT
     WITH CHECK (auth.uid() = user_id);

   -- Policies pour favorites
   CREATE POLICY "Users can view own favorites"
     ON favorites FOR SELECT
     USING (auth.uid() = user_id);

   CREATE POLICY "Users can insert own favorites"
     ON favorites FOR INSERT
     WITH CHECK (auth.uid() = user_id);

   CREATE POLICY "Users can delete own favorites"
     ON favorites FOR DELETE
     USING (auth.uid() = user_id);
   ```

6. **Redémarrer le Serveur**
   ```bash
   # Arrêter le serveur (Ctrl+C)
   # Relancer
   cd betlab-web
   pnpm dev
   ```

7. **Vérifier la Connexion**
   - Ouvrir http://localhost:3000
   - Les erreurs Supabase devraient avoir disparu
   - Vous pouvez maintenant tester l'inscription/connexion

---

## Variables Optionnelles

### 2. Image CDN (Optionnel - Performances)

Pour optimiser le chargement des logos d'équipes/ligues via un CDN:

#### Option A: Cloudinary (Recommandé)

1. Créer un compte: https://cloudinary.com
2. Aller dans Dashboard
3. Copier votre "Cloud Name"
4. Ajouter dans `.env.local`:
   ```bash
   NEXT_PUBLIC_IMAGE_CDN=https://res.cloudinary.com/YOUR_CLOUD_NAME/image/fetch
   ```

#### Option B: ImageKit

1. Créer un compte: https://imagekit.io
2. Obtenir votre URL endpoint
3. Ajouter dans `.env.local`:
   ```bash
   NEXT_PUBLIC_IMAGE_CDN=https://ik.imagekit.io/YOUR_ID
   ```

**Si non configuré**: Les images seront servies directement (pas de CDN). C'est OK pour le développement.

---

### 3. URL du Site (Optionnel - PWA/SEO)

Pour le manifest PWA et les meta tags Open Graph:

```bash
# En développement
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# En production
NEXT_PUBLIC_SITE_URL=https://betlab.com
```

---

### 4. Google Analytics (Optionnel - Analytics)

1. Créer une propriété GA4: https://analytics.google.com
2. Copier le Measurement ID (format: `G-XXXXXXXXXX`)
3. Ajouter dans `.env.local`:
   ```bash
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

---

## Vérification Finale

### Checklist

- [ ] `.env.local` créé avec vraies valeurs Supabase
- [ ] Tables Supabase créées (profiles, user_preferences, favorites)
- [ ] Policies Row Level Security configurées
- [ ] Serveur redémarré (`pnpm dev`)
- [ ] Application accessible sur http://localhost:3000
- [ ] Pas d'erreurs Supabase dans la console

### Tester l'Authentification

1. Ouvrir http://localhost:3000/auth/register
2. Créer un compte test
3. Vérifier email de confirmation Supabase
4. Se connecter sur http://localhost:3000/auth/login
5. Compléter l'onboarding
6. Accéder à la home page

### Problèmes Courants

**Erreur: "Invalid supabaseUrl"**
- Vérifier que `NEXT_PUBLIC_SUPABASE_URL` commence par `https://`
- Pas d'espaces avant/après l'URL
- Pas de slash `/` à la fin

**Erreur: "Invalid JWT"**
- Vérifier que la clé anon est complète (très longue)
- Copier depuis Supabase Dashboard, section "anon public"

**Erreur: "Missing table profiles"**
- Exécuter les requêtes SQL dans Supabase SQL Editor
- Vérifier que les tables sont créées

**Authentication Error**
- Vérifier que Authentication est activé dans Supabase
- Settings > Authentication > Providers > Email activé

---

## Support

Si problème persistant:
1. Vérifier les logs serveur dans le terminal
2. Vérifier la console browser (F12)
3. Vérifier Supabase Dashboard > Logs

---

## Fichiers de Configuration

- `.env.local` - Variables locales (ignoré par git)
- `.env.example` - Template de référence (commité)
- `ENV_SETUP_GUIDE.md` - Ce guide

**Important**: Ne jamais commiter `.env.local` (contient vos secrets)
