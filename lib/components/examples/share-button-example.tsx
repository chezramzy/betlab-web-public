'use client'

import { Share2 } from 'lucide-react'
import { Button } from '@/lib/components/ui/button'
import { useShare } from '@/lib/hooks/use-share'

interface ShareButtonExampleProps {
  matchId: string
  homeTeam: string
  awayTeam: string
  league?: string
}

/**
 * Exemple d'utilisation du hook useShare
 * À intégrer dans MatchHeader ou MatchCard
 */
export function ShareButtonExample({
  matchId,
  homeTeam,
  awayTeam,
  league,
}: ShareButtonExampleProps) {
  const { share, isSharing } = useShare()

  const handleShare = async () => {
    const matchUrl = `${window.location.origin}/match/${matchId}`

    await share({
      title: `${homeTeam} vs ${awayTeam}`,
      text: league
        ? `Voir les pronostics pour ${homeTeam} vs ${awayTeam} (${league}) sur BetLab`
        : `Voir les pronostics pour ${homeTeam} vs ${awayTeam} sur BetLab`,
      url: matchUrl,
    })
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleShare}
      disabled={isSharing}
      aria-label="Partager ce match"
    >
      <Share2 className="w-4 h-4" />
    </Button>
  )
}
