/**
 * Device detection utilities for PWA
 * Détecte les caractéristiques du device (notch, dynamic island, etc.)
 */

/**
 * Détecte si l'appareil a un notch (iPhone X et plus)
 */
export function hasNotch(): boolean {
  if (typeof window === 'undefined') return false

  // Detect iPhone X+ models par la présence de safe area insets
  const safeAreaTop = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-top') || '0'
  )

  // Si safe-area-inset-top > 20px, c'est probablement un iPhone avec notch
  return safeAreaTop > 20
}

/**
 * Détecte si l'appareil a une Dynamic Island (iPhone 14 Pro et plus)
 */
export function hasDynamicIsland(): boolean {
  if (typeof window === 'undefined') return false

  // iPhone 14 Pro et Pro Max ont une hauteur d'écran de 2556px et 2796px
  const isIPhone14Pro =
    /iPhone|iPad|iPod/.test(navigator.userAgent) &&
    (window.screen.height === 2556 || window.screen.height === 2796)

  return isIPhone14Pro
}

/**
 * Détecte si c'est un appareil iOS
 */
export function isIOS(): boolean {
  if (typeof window === 'undefined') return false

  return (
    /iPhone|iPad|iPod/.test(navigator.userAgent) ||
    // iPad sur iOS 13+ se présente comme Mac
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  )
}

/**
 * Détecte si c'est un appareil Android
 */
export function isAndroid(): boolean {
  if (typeof window === 'undefined') return false
  return /Android/.test(navigator.userAgent)
}

/**
 * Détecte si l'app est en mode standalone (installée comme PWA)
 */
export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false

  // iOS
  if ('standalone' in window.navigator) {
    return (window.navigator as any).standalone === true
  }

  // Android et autres
  return window.matchMedia('(display-mode: standalone)').matches
}

/**
 * Détecte si c'est un mobile
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false

  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
}

/**
 * Détecte si c'est une tablette
 */
export function isTablet(): boolean {
  if (typeof window === 'undefined') return false

  return (
    /(iPad|tablet|playbook|silk)|(android(?!.*mobi))/i.test(navigator.userAgent) ||
    // iPad sur iOS 13+
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  )
}

/**
 * Retourne les safe area insets
 */
export function getSafeAreaInsets(): {
  top: number
  bottom: number
  left: number
  right: number
} {
  if (typeof window === 'undefined') {
    return { top: 0, bottom: 0, left: 0, right: 0 }
  }

  const style = getComputedStyle(document.documentElement)

  return {
    top: parseInt(style.getPropertyValue('--safe-area-inset-top') || '0'),
    bottom: parseInt(style.getPropertyValue('--safe-area-inset-bottom') || '0'),
    left: parseInt(style.getPropertyValue('--safe-area-inset-left') || '0'),
    right: parseInt(style.getPropertyValue('--safe-area-inset-right') || '0'),
  }
}

/**
 * Retourne le type d'appareil
 */
export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop'

  if (isMobile() && !isTablet()) return 'mobile'
  if (isTablet()) return 'tablet'
  return 'desktop'
}

/**
 * Retourne l'OS du device
 */
export function getOS(): 'ios' | 'android' | 'other' {
  if (typeof window === 'undefined') return 'other'

  if (isIOS()) return 'ios'
  if (isAndroid()) return 'android'
  return 'other'
}

/**
 * Détecte si le PWA peut être installé
 */
export function canInstallPWA(): boolean {
  if (typeof window === 'undefined') return false

  // Déjà installé
  if (isStandalone()) return false

  // iOS Safari peut installer mais n'a pas beforeinstallprompt
  if (isIOS()) return true

  // Android/Desktop avec beforeinstallprompt event
  return 'BeforeInstallPromptEvent' in window
}
