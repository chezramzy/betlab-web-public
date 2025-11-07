/**
 * Prediction Types
 * Basé sur lib/data/models/predictions_models.dart et autres
 */

import { ConfidenceLevel } from '@/lib/core/enums/confidence-level';

export enum PredictionType {
  BTTS = 'btts',
  HTFT = 'htft',
  CORNERS = 'corners',
  CLEAN_SHEET = 'cleanSheet',
  EXACT_SCORE = 'exactScore',
  OVER_UNDER = 'overUnder',
  ONE_X_TWO = '1x2',
  // Basketball
  MONEYLINE = 'moneyline',
  TOTAL = 'total',
  SPREAD = 'spread',
}

export interface Probability {
  outcome: string;
  probability: number;
  odds?: number;
  edge?: number;
}

export interface Probabilities1x2 {
  home: number;
  draw: number;
  away: number;
  confidence?: ConfidenceLevel;
}

export interface BTTSPrediction {
  fixtureId: number;
  yes: number;
  no: number;
  prediction: 'yes' | 'no';
  confidence: ConfidenceLevel;
}

export interface HTFTPrediction {
  fixtureId: number;
  predictions: Array<{
    outcome: string; // e.g., "Home/Home", "Draw/Away"
    probability: number;
  }>;
  topPrediction: string;
  confidence: ConfidenceLevel;
}

export interface OverUnderPrediction {
  fixtureId: number;
  line: number; // 0.5, 1.5, 2.5, 3.5
  over: number;
  under: number;
  prediction: 'over' | 'under';
  confidence: ConfidenceLevel;
}

export interface CleanSheetPrediction {
  fixtureId: number;
  home: number;
  away: number;
  prediction: 'home' | 'away' | 'both' | 'neither';
  confidence: ConfidenceLevel;
}

export interface CornersPrediction {
  fixtureId: number;
  totalCorners: number;
  homeCorners: number;
  awayCorners: number;
  confidence: ConfidenceLevel;
}

export interface ExactScorePrediction {
  fixtureId: number;
  predictions: Array<{
    score: string; // e.g., "2-1"
    probability: number;
  }>;
  topPrediction: string;
  confidence: ConfidenceLevel;
}

export interface InternalProbabilityModel {
  fixtureId: number;
  models: string[];
  probabilities: Probabilities1x2;
  confidence: ConfidenceLevel;
  xgStats?: {
    homeXg: number;
    awayXg: number;
  };
}

export interface PredictionPreferences {
  userId: string;
  predictionTypes: PredictionType[];
  confidenceThresholds: {
    minimum: ConfidenceLevel;
  };
  notifications: boolean;
}

export interface PredictionsResponse {
  fixtureId: number;
  predictions1x2?: Probabilities1x2;
  btts?: BTTSPrediction;
  htft?: HTFTPrediction;
  overUnder?: OverUnderPrediction[];
  cleanSheet?: CleanSheetPrediction;
  corners?: CornersPrediction;
  exactScore?: ExactScorePrediction;
  internal?: InternalProbabilityModel;
}
