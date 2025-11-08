/**
 * Predictions Feature Types
 *
 * Type definitions for the predictions feature module.
 * Re-exports types from server service and adds feature-specific types.
 */

import type {
  PredictionData as ServerPredictionData,
  PredictionType as ServerPredictionType,
} from "@/modules/predictions/server/queries";
import type {
  MatchResultPrediction,
  OverUnderPrediction,
  BTTSPrediction,
  CorrectScorePrediction,
  DrawNoBetPrediction,
  AsianHandicapPrediction,
  DoubleChancePrediction,
} from "@/shared/hooks/use-predictions-transforms";

// Re-export types from server service
export type PredictionData = ServerPredictionData;
export type PredictionType = ServerPredictionType;

// Re-export transform types
export type {
  MatchResultPrediction,
  OverUnderPrediction,
  BTTSPrediction,
  CorrectScorePrediction,
  DrawNoBetPrediction,
  AsianHandicapPrediction,
  DoubleChancePrediction,
};

/**
 * Prediction with additional UI state
 */
export interface PredictionWithUI {
  prediction: PredictionData;
  isExpanded?: boolean;
  isBookmarked?: boolean;
}
