/**
 * Predictions Feature Module
 *
 * Centralizes exports for the predictions feature.
 */

// Types
export type {
  PredictionData,
  PredictionType,
  MatchResultPrediction,
  OverUnderPrediction,
  BTTSPrediction,
  CorrectScorePrediction,
  DrawNoBetPrediction,
  AsianHandicapPrediction,
  PredictionWithUI,
} from "./domain/types";

// Server queries - DO NOT export from barrel file
// Import directly from './server/queries' in Server Components only
// export { getPredictions, getPrediction } from "./server/queries";

// Components will be added here as we migrate them
// export { PredictionCard } from "./components/prediction-card.client";
// export { PredictionsPanel } from "./components/predictions-panel.client";
