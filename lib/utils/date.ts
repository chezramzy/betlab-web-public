/**
 * Date Utilities - Tree-shaking optimized
 *
 * Importe seulement les fonctions date-fns nécessaires
 * pour réduire la taille du bundle
 */

// Import seulement les fonctions utilisées
export {
  format,
  parseISO,
  isToday,
  isTomorrow,
  isYesterday,
  addDays,
  subDays,
  startOfDay,
  endOfDay,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  isAfter,
  isBefore,
  isSameDay,
} from 'date-fns';

// Locale française
export { fr } from 'date-fns/locale';
