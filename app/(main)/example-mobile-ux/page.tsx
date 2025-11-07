/**
 * Page de démo des améliorations UX mobile
 *
 * Cette page est un exemple complet d'intégration
 * Accès: /example-mobile-ux
 */

import { MobileUXExample } from '@/lib/components/examples/mobile-ux-example'

export const metadata = {
  title: 'Mobile UX Demo - BetLab',
  description: 'Démonstration des améliorations UX mobile',
}

export default function MobileUXDemoPage() {
  return <MobileUXExample />
}
