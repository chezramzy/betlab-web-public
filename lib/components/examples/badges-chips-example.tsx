"use client"

import * as React from "react"
import { ConfidenceBadge } from "@/lib/components/ui/confidence-badge"
import { EdgeChip } from "@/lib/components/ui/edge-chip"
import { LiveBadge } from "@/lib/components/ui/live-badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/components/ui/card"

/**
 * BadgesChipsExample - Démonstration interactive des badges et chips BetLab
 *
 * Cette page présente tous les composants de badges et chips spécialisés:
 * - ConfidenceBadge: Indicateur de niveau de confiance (high/medium/low)
 * - EdgeChip: Affichage du pourcentage d'avantage (edge)
 * - LiveBadge: Indicateur de match en direct
 *
 * Chaque composant est présenté avec ses différentes variations,
 * tailles et options pour faciliter le choix lors de l'intégration.
 */
export default function BadgesChipsExample() {
  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Badges & Chips BetLab</h1>
        <p className="text-text-secondary">
          Composants spécialisés pour afficher les indicateurs de pronostics
        </p>
      </div>

      {/* ConfidenceBadge Examples */}
      <Card>
        <CardHeader>
          <CardTitle>ConfidenceBadge</CardTitle>
          <CardDescription>
            Badge de niveau de confiance avec 3 niveaux (high, medium, low) et icônes optionnelles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avec labels */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-text-primary">Avec labels</h3>
            <div className="flex flex-wrap gap-3">
              <ConfidenceBadge level="high" showLabel />
              <ConfidenceBadge level="medium" showLabel />
              <ConfidenceBadge level="low" showLabel />
            </div>
          </div>

          {/* Sans labels (icône uniquement) */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-text-primary">Sans labels (icône uniquement)</h3>
            <div className="flex flex-wrap gap-3">
              <ConfidenceBadge level="high" />
              <ConfidenceBadge level="medium" />
              <ConfidenceBadge level="low" />
            </div>
          </div>

          {/* Différentes tailles */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-text-primary">Tailles (sm, md, lg)</h3>
            <div className="flex flex-wrap items-center gap-3">
              <ConfidenceBadge level="high" size="sm" showLabel />
              <ConfidenceBadge level="high" size="md" showLabel />
              <ConfidenceBadge level="high" size="lg" showLabel />
            </div>
          </div>

          {/* Sans icône, labels uniquement */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-text-primary">Labels sans icône</h3>
            <div className="flex flex-wrap gap-3">
              <ConfidenceBadge level="high" showLabel showIcon={false} />
              <ConfidenceBadge level="medium" showLabel showIcon={false} />
              <ConfidenceBadge level="low" showLabel showIcon={false} />
            </div>
          </div>

          {/* Usage réaliste */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-text-primary">Usage réaliste dans une card</h3>
            <Card className="max-w-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">PSG vs OM</p>
                    <p className="text-sm text-text-secondary">Ligue 1</p>
                  </div>
                  <ConfidenceBadge level="high" size="lg" showLabel />
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* EdgeChip Examples */}
      <Card>
        <CardHeader>
          <CardTitle>EdgeChip</CardTitle>
          <CardDescription>
            Chip d'affichage du pourcentage d'avantage (edge) avec seuils de couleur et animation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Différents seuils */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-text-primary">Seuils de couleur</h3>
            <div className="flex flex-wrap gap-3">
              <div className="space-y-1">
                <EdgeChip edge={12.5} />
                <p className="text-xs text-text-secondary">&gt; 10% (excellent)</p>
              </div>
              <div className="space-y-1">
                <EdgeChip edge={6.3} />
                <p className="text-xs text-text-secondary">&gt;= 5% (good)</p>
              </div>
              <div className="space-y-1">
                <EdgeChip edge={3.2} />
                <p className="text-xs text-text-secondary">&gt;= 2% (fair)</p>
              </div>
              <div className="space-y-1">
                <EdgeChip edge={1.1} />
                <p className="text-xs text-text-secondary">&lt; 2% (low)</p>
              </div>
            </div>
          </div>

          {/* Avec label */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-text-primary">Avec label "Edge:"</h3>
            <div className="flex flex-wrap gap-3">
              <EdgeChip edge={8.7} showLabel />
              <EdgeChip edge={4.2} showLabel />
            </div>
          </div>

          {/* Différentes tailles */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-text-primary">Tailles (sm, md)</h3>
            <div className="flex flex-wrap items-center gap-3">
              <EdgeChip edge={7.5} size="sm" />
              <EdgeChip edge={7.5} size="md" />
            </div>
          </div>

          {/* Sans icône */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-text-primary">Sans icône</h3>
            <div className="flex flex-wrap gap-3">
              <EdgeChip edge={9.2} showIcon={false} />
              <EdgeChip edge={5.8} showIcon={false} />
            </div>
          </div>

          {/* Avec tooltip */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-text-primary">Avec tooltip (survolez)</h3>
            <div className="flex flex-wrap gap-3">
              <EdgeChip edge={11.5} showTooltip />
              <EdgeChip edge={6.2} showTooltip />
              <EdgeChip edge={2.8} showTooltip />
              <EdgeChip edge={1.5} showTooltip />
            </div>
          </div>

          {/* Edge négatif */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-text-primary">Edge négatif (désavantage)</h3>
            <div className="flex flex-wrap gap-3">
              <EdgeChip edge={-2.3} />
              <EdgeChip edge={-5.1} />
            </div>
          </div>

          {/* Usage réaliste */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-text-primary">Usage réaliste dans une card</h3>
            <Card className="max-w-sm">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Manchester City victoire</p>
                      <p className="text-sm text-text-secondary">Premier League</p>
                    </div>
                    <EdgeChip edge={8.4} showTooltip />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-text-secondary">Cote:</span>
                    <span className="font-bold">2.10</span>
                    <ConfidenceBadge level="high" size="sm" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* LiveBadge Examples */}
      <Card>
        <CardHeader>
          <CardTitle>LiveBadge</CardTitle>
          <CardDescription>
            Badge animé pour indiquer les matchs en direct avec plusieurs variants
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Variants */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-text-primary">Variants (solid, outline, ghost)</h3>
            <div className="flex flex-wrap gap-3">
              <LiveBadge variant="solid" />
              <LiveBadge variant="outline" />
              <LiveBadge variant="ghost" />
            </div>
          </div>

          {/* Avec dot */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-text-primary">Avec dot indicateur</h3>
            <div className="flex flex-wrap gap-3">
              <LiveBadge showDot />
              <LiveBadge variant="outline" showDot />
              <LiveBadge variant="ghost" showDot />
            </div>
          </div>

          {/* Avec glow effect */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-text-primary">Avec effet glow</h3>
            <div className="flex flex-wrap gap-3">
              <LiveBadge showGlow />
              <LiveBadge showDot showGlow />
            </div>
          </div>

          {/* Mode compact */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-text-primary">Mode compact (dot uniquement)</h3>
            <div className="flex flex-wrap gap-3">
              <LiveBadge compact />
              <LiveBadge compact variant="outline" />
              <LiveBadge compact variant="ghost" />
            </div>
          </div>

          {/* Différentes tailles */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-text-primary">Tailles (sm, md)</h3>
            <div className="flex flex-wrap items-center gap-3">
              <LiveBadge size="sm" />
              <LiveBadge size="md" />
              <LiveBadge size="sm" showDot />
              <LiveBadge size="md" showDot />
            </div>
          </div>

          {/* Sans animation */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-text-primary">Sans animation</h3>
            <div className="flex flex-wrap gap-3">
              <LiveBadge animated={false} />
              <LiveBadge animated={false} showDot />
            </div>
          </div>

          {/* Usage réaliste */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-text-primary">Usage réaliste dans une card</h3>
            <Card className="max-w-sm">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Real Madrid vs Barcelona</p>
                      <p className="text-sm text-text-secondary">La Liga - 34' min</p>
                    </div>
                    <LiveBadge showDot showGlow />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">2 - 1</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Combined Example */}
      <Card>
        <CardHeader>
          <CardTitle>Exemple combiné</CardTitle>
          <CardDescription>
            Utilisation combinée de tous les badges dans un contexte réaliste
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {/* Match en direct */}
            <Card>
              <CardContent className="pt-6 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="font-semibold text-base">Bayern Munich vs Dortmund</p>
                    <p className="text-sm text-text-secondary">Bundesliga - 67' min</p>
                  </div>
                  <LiveBadge showDot />
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xl font-bold">1 - 1</span>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t">
                  <span className="text-sm text-text-secondary">Prono: Bayern gagne</span>
                  <ConfidenceBadge level="medium" size="sm" />
                  <EdgeChip edge={5.8} size="sm" />
                </div>
              </CardContent>
            </Card>

            {/* Match à venir */}
            <Card>
              <CardContent className="pt-6 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="font-semibold text-base">Liverpool vs Arsenal</p>
                    <p className="text-sm text-text-secondary">Premier League - Dans 2h</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm">Liverpool victoire</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">2.30</span>
                      <ConfidenceBadge level="high" size="sm" />
                      <EdgeChip edge={11.2} size="sm" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm">Match nul</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">3.40</span>
                      <ConfidenceBadge level="low" size="sm" />
                      <EdgeChip edge={1.8} size="sm" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm">Arsenal victoire</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">2.80</span>
                      <ConfidenceBadge level="medium" size="sm" />
                      <EdgeChip edge={6.5} size="sm" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
