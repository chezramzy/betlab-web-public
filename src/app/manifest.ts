import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'BetLab - Pronostics Sportifs IA',
    short_name: 'BetLab',
    description: 'Pronostics sportifs précis générés par IA. Football, Basketball et plus.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0A0F29',
    theme_color: '#C8DC3F',
    orientation: 'portrait',
    scope: '/',
    lang: 'fr',
    dir: 'ltr',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-apple-touch.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    categories: ['sports', 'utilities'],
    screenshots: [
      {
        src: '/screenshots/home-mobile.png',
        sizes: '390x844',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Home - Liste des matchs',
      },
      {
        src: '/screenshots/match-detail-mobile.png',
        sizes: '390x844',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Détails du match',
      },
      {
        src: '/screenshots/home-desktop.png',
        sizes: '1920x1080',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Home - Desktop',
      },
    ],
    shortcuts: [
      {
        name: "Voir les matchs d'aujourd'hui",
        short_name: 'Matchs',
        description: 'Accéder rapidement aux matchs du jour',
        url: '/',
        icons: [{ src: '/icon-192.png', sizes: '192x192' }],
      },
      {
        name: 'Mes favoris',
        short_name: 'Favoris',
        description: 'Voir mes matchs favoris',
        url: '/favorites',
        icons: [{ src: '/icon-192.png', sizes: '192x192' }],
      },
    ],
    related_applications: [],
    prefer_related_applications: false,
  }
}
