# Prediction Cards

Collection de 8 cards de prédictions pour l'onglet Match Detail de BetLab.

## Vue d'ensemble

Chaque card affiche un type de prédiction spécifique avec :
- **Probabilités** - Pourcentages de chance pour chaque issue
- **Confidence badge** - Niveau de confiance (high/medium/low)
- **Visualisations** - Progress bars, grilles, charts
- **Recommandation** - Meilleur pari suggéré
- **Design mobile-first** - Touch targets ≥44px, responsive

## Les 8 types de prédictions

### 1. Match Result Card (`match-result-card.tsx`)

**Type:** `match_result`

Prédiction du résultat final (1X2).

**Données requises:**
```typescript
{
  type: "match_result"
  homeWin: { probability: number, odds?: number }
  draw: { probability: number, odds?: number }
  awayWin: { probability: number, odds?: number }
  confidence: "high" | "medium" | "low"
  reasoning?: string
}
```

**Features:**
- 3 options avec progress bars
- Affichage des cotes recommandées
- Raison de la prédiction
- Highlight du meilleur pari

---

### 2. BTTS Card (`btts-card.tsx`)

**Type:** `both_teams_score`

Prédiction Both Teams To Score (les 2 équipes marquent).

**Données requises:**
```typescript
{
  type: "both_teams_score"
  yes: { probability: number, odds?: number }
  no: { probability: number, odds?: number }
  confidence: "high" | "medium" | "low"
  homeTeamScoringRate: number
  awayTeamScoringRate: number
  recentBTTS: boolean[] // [true, false, true, ...] (5 derniers)
}
```

**Features:**
- 2 grandes cards (Yes/No)
- Taux de réussite au but par équipe
- Historique BTTS des 5 derniers matchs
- Badges visuels pour l'historique

---

### 3. Over/Under Card (`over-under-card.tsx`)

**Type:** `over_under`

Prédiction Plus/Moins de buts (1.5, 2.5, 3.5).

**Données requises:**
```typescript
{
  type: "over_under"
  lines: {
    "1.5": { over: number, under: number }
    "2.5": { over: number, under: number }
    "3.5": { over: number, under: number }
  }
  expectedGoals: number
  homeAvgGoals: number
  awayAvgGoals: number
  confidence: "high" | "medium" | "low"
}
```

**Features:**
- Tabs pour sélectionner 1.5/2.5/3.5
- Progress bar Over vs Under
- Expected goals (xG)
- Moyenne de buts par équipe
- Résumé de toutes les lignes

---

### 4. Correct Score Card (`correct-score-card.tsx`)

**Type:** `correct_score`

Prédiction du score exact.

**Données requises:**
```typescript
{
  type: "correct_score"
  topScores: Array<{
    home: number
    away: number
    probability: number
    odds?: number
  }>
  scoreMatrix: number[][] // [home][away] = probability
  confidence: "high" | "medium" | "low"
}
```

**Features:**
- Top 5 scores les plus probables
- Grille interactive (heatmap)
- Couleurs basées sur la probabilité
- Tap pour voir les détails

---

### 5. Half-Time Card (`half-time-card.tsx`)

**Type:** `half_time`

Prédiction du résultat à la mi-temps.

**Données requises:**
```typescript
{
  type: "half_time"
  homeLeading: { probability: number }
  draw: { probability: number }
  awayLeading: { probability: number }
  homeFirstHalfGoals: number
  awayFirstHalfGoals: number
  homeSecondHalfGoals: number
  awaySecondHalfGoals: number
  confidence: "high" | "medium" | "low"
}
```

**Features:**
- 3 options (Home mène / Égalité / Away mène)
- Comparaison 1ère vs 2ème mi-temps
- Buts moyens par période
- Stats par équipe et par période

---

### 6. Double Chance Card (`double-chance-card.tsx`)

**Type:** `double_chance`

Prédiction Double Chance (1X, 12, X2).

**Données requises:**
```typescript
{
  type: "double_chance"
  homeOrDraw: { probability: number, odds?: number }
  homeOrAway: { probability: number, odds?: number }
  drawOrAway: { probability: number, odds?: number }
  confidence: "high" | "medium" | "low"
  reasoning?: string
}
```

**Features:**
- 3 options de paris sécurisés
- Explication de chaque option
- Highlight de la meilleure option
- Raison de la recommandation

---

### 7. Corners Card (`corners-card.tsx`)

**Type:** `corners`

Prédiction sur les corners.

**Données requises:**
```typescript
{
  type: "corners"
  overUnder: {
    "8.5": { over: number, under: number }
    "9.5": { over: number, under: number }
    "10.5": { over: number, under: number }
  }
  expectedCorners: number
  homeAvgCorners: number
  awayAvgCorners: number
  homeAvgCornersAgainst: number
  awayAvgCornersAgainst: number
  confidence: "high" | "medium" | "low"
}
```

**Features:**
- Over/Under 8.5, 9.5, 10.5
- Expected corners
- Moyenne corners pour/contre par équipe
- Progress bars comparatives

---

### 8. First Goal Card (`first-goal-card.tsx`)

**Type:** `first_goal`

Prédiction premier but / première équipe à marquer.

**Données requises:**
```typescript
{
  type: "first_goal"
  homeScoresFirst: { probability: number, odds?: number }
  awayScoresFirst: { probability: number, odds?: number }
  noGoal: { probability: number, odds?: number }
  avgTimeFirstGoal: number
  homeTopScorers: Array<{
    name: string
    probability: number
    odds?: number
  }>
  awayTopScorers: Array<{
    name: string
    probability: number
    odds?: number
  }>
  confidence: "high" | "medium" | "low"
}
```

**Features:**
- Première équipe à marquer
- Temps moyen du 1er but
- Top 3 buteurs probables par équipe
- Probabilités individuelles

---

## Structure commune

Toutes les cards partagent la même structure de base :

```tsx
<Card>
  <CardHeader>
    <Icon /> Titre
    <Badge>Confiance</Badge>
  </CardHeader>

  <CardContent>
    {/* Contenu principal */}
    {/* Visualisations */}
    {/* Stats supportant la prédiction */}

    {/* Recommandation */}
    <div className="border-t">
      Meilleur pari
    </div>
  </CardContent>
</Card>
```

## Styles et thème

- **Couleur principale:** `#C8DC3F` (lime)
- **Couleur secondaire:** `#003366` (navy)
- **Touch targets:** ≥44px minimum
- **Border radius:** `rounded-lg` (8px)
- **Spacing:** Mobile-first avec `space-y-*`

## Badges de confiance

```tsx
const confidenceVariants = {
  high: { variant: "success", label: "Confiance élevée" },
  medium: { variant: "warning", label: "Confiance moyenne" },
  low: { variant: "error", label: "Confiance faible" },
}
```

## Utilisation

```tsx
import {
  MatchResultCard,
  BTTSCard,
  OverUnderCard,
  // ... autres cards
} from "@/lib/components/match-detail/prediction-cards"

// Dans PredictionsTab
{selectedType === "match_result" && (
  <MatchResultCard prediction={prediction} match={match} />
)}
```

## Tests recommandés

1. **Mobile responsiveness** - Tester sur iPhone 12 (375px)
2. **Touch targets** - Vérifier que tous les boutons font ≥44px
3. **Dark mode** - Vérifier le contraste
4. **Loading states** - Skeleton loading
5. **Error states** - Pas de données
6. **Animations** - Smooth transitions

## Notes de développement

- Toutes les cards sont "use client" (composants React client)
- TypeScript strict mode activé
- Pas d'emojis (sauf si demandé explicitement)
- Mobile-first approach
- Recharts non utilisé dans les cards (seulement dans Analysis/H2H tabs)
