/**
 * Performance Monitoring Utilities
 *
 * Monitoring des Web Vitals et métriques de performance
 * Aide à identifier les problèmes de performance en production
 */

'use client';

import { onCLS, onFCP, onFID, onINP, onLCP, onTTFB, type Metric } from 'web-vitals';

/**
 * Type pour les métriques collectées
 */
export type PerformanceMetric = {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
};

/**
 * Callback type pour traiter les métriques
 */
export type MetricHandler = (metric: PerformanceMetric) => void;

/**
 * Thresholds pour les Web Vitals (valeurs recommandées par Google)
 * Note: FID a été remplacé par INP dans web-vitals v3+
 */
const THRESHOLDS = {
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  INP: { good: 200, poor: 500 },
  LCP: { good: 2500, poor: 4000 },
  TTFB: { good: 800, poor: 1800 },
};

/**
 * Détermine le rating d'une métrique
 */
function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS];
  if (!threshold) return 'good';

  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Envoie une métrique vers analytics
 * Adapter selon votre solution analytics (GA4, Mixpanel, etc.)
 */
function sendToAnalytics(metric: PerformanceMetric) {
  // Console log en développement
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Performance] ${metric.name}:`, {
      value: metric.value,
      rating: metric.rating,
      id: metric.id,
    });
  }

  // Envoyer à Google Analytics 4
  if (typeof window !== 'undefined' && 'gtag' in window) {
    // @ts-ignore
    window.gtag('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      metric_id: metric.id,
      metric_value: metric.value,
      metric_delta: metric.delta,
      metric_rating: metric.rating,
    });
  }

  // Envoyer à Vercel Analytics si disponible
  if (typeof window !== 'undefined' && 'va' in window) {
    // @ts-ignore
    window.va('track', metric.name, {
      value: metric.value,
      rating: metric.rating,
    });
  }
}

/**
 * Convertit une métrique web-vitals vers notre format
 */
function formatMetric(metric: Metric): PerformanceMetric {
  return {
    name: metric.name,
    value: metric.value,
    rating: getRating(metric.name, metric.value),
    delta: metric.delta,
    id: metric.id,
  };
}

/**
 * Active le monitoring des Web Vitals
 * À appeler dans le layout root ou _app
 *
 * @param onMetric - Callback optionnel pour traiter les métriques
 *
 * @example
 * ```tsx
 * // Dans app/layout.tsx
 * useEffect(() => {
 *   reportWebVitals()
 * }, [])
 * ```
 */
export function reportWebVitals(onMetric?: MetricHandler) {
  const handler = (metric: Metric) => {
    const formattedMetric = formatMetric(metric);

    // Envoyer à analytics
    sendToAnalytics(formattedMetric);

    // Callback custom si fourni
    onMetric?.(formattedMetric);
  };

  // Collecter toutes les métriques
  // Note: onFID supprimé car déprécié, INP est le remplaçant
  onCLS(handler);
  onFCP(handler);
  onINP(handler);
  onLCP(handler);
  onTTFB(handler);
}

/**
 * Hook React pour monitoring des Web Vitals
 *
 * @example
 * ```tsx
 * function MyApp() {
 *   useWebVitals((metric) => {
 *     console.log(metric)
 *   })
 *   return <div>...</div>
 * }
 * ```
 */
export function useWebVitals(onMetric?: MetricHandler) {
  if (typeof window === 'undefined') return;

  reportWebVitals(onMetric);
}

/**
 * Marque le début d'une mesure custom
 */
export function measureStart(name: string) {
  if (typeof window !== 'undefined' && 'performance' in window) {
    performance.mark(`${name}-start`);
  }
}

/**
 * Marque la fin d'une mesure custom et retourne la durée
 */
export function measureEnd(name: string): number | null {
  if (typeof window === 'undefined' || !('performance' in window)) {
    return null;
  }

  try {
    performance.mark(`${name}-end`);
    const measure = performance.measure(name, `${name}-start`, `${name}-end`);
    return measure.duration;
  } catch (error) {
    console.error('Performance measurement failed:', error);
    return null;
  }
}

/**
 * Mesure le temps d'exécution d'une fonction
 */
export async function measureFunction<T>(
  name: string,
  fn: () => T | Promise<T>
): Promise<{ result: T; duration: number }> {
  measureStart(name);
  const result = await fn();
  const duration = measureEnd(name) || 0;

  return { result, duration };
}
