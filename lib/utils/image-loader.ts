/**
 * Image Loader Utilities
 *
 * Optimisation des images pour performances maximales:
 * - Loader custom pour images externes
 * - Génération de blur placeholders
 * - Support CDN/Proxy
 */

import type { ImageLoaderProps } from 'next/image';

/**
 * Custom image loader pour optimiser les images externes
 * Si configuré avec un CDN/proxy, utilise celui-ci pour optimisation
 * Sinon, retourne l'URL originale
 */
export function imageLoader({ src, width, quality }: ImageLoaderProps): string {
  // Si image externe (API sports, etc.)
  if (src.startsWith('http')) {
    // Si CDN configuré, l'utiliser pour optimisation
    if (process.env.NEXT_PUBLIC_IMAGE_CDN) {
      return `${process.env.NEXT_PUBLIC_IMAGE_CDN}?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}`;
    }
    // Sinon retourner l'URL originale
    return src;
  }

  // Images locales - Next.js s'en charge
  return src;
}

/**
 * Génère un blur placeholder SVG pour éviter CLS
 * @param width - Largeur du placeholder
 * @param height - Hauteur du placeholder
 * @param color - Couleur de fond (theme-aware)
 * @returns Data URL du SVG base64
 */
export function generateBlurDataURL(
  width: number = 64,
  height: number = 64,
  color: string = '#003366'
): string {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${color}" opacity="0.1"/>
    </svg>
  `;

  // Encode en base64
  const base64 = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Blur placeholder par défaut pour logos d'équipes
 */
export const TEAM_LOGO_BLUR = generateBlurDataURL(64, 64, '#003366');

/**
 * Blur placeholder par défaut pour logos de ligues
 */
export const LEAGUE_LOGO_BLUR = generateBlurDataURL(32, 32, '#1a1a1a');
