/**
 * Export central pour tous les hooks custom
 */

export {
  useFormValidation,
  getFormErrors,
  hasFieldError,
  getFieldError,
} from "./use-form-validation"

export {
  useNavigation,
  type NavRoute,
} from "./use-navigation"

// Auth hooks
export { useAuth } from "./use-auth"
export { useUser } from "./use-user"
export { useSession } from "./use-session"
export { useRequireAuth } from "./use-require-auth"

// Home hooks (BATCH 6)
export { useFixtures, type Match } from "./use-fixtures"
export { usePredictions, type Prediction } from "./use-predictions"
export { useHomeFilters } from "./use-home-filters"

// Match Detail hooks (BATCH 7)
export { useMatchDetail, type MatchDetail } from "./use-match-detail"
export { useTeamStats, type TeamStats } from "./use-team-stats"
export { useH2H, type H2HData, type H2HMatch } from "./use-h2h"

// UX Mobile hooks
export { usePullToRefresh } from "./use-pull-to-refresh"
export { useHapticFeedback } from "./use-haptic-feedback"
export { useSuccessToast } from "./use-success-toast"
