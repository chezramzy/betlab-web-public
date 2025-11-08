import type { Match } from "@/modules/fixtures/domain/types";
import type { PredictionData } from "@/modules/predictions/domain/types";

export interface MatchDetail extends Match {
  venue?: string;
  referee?: string;
  predictions?: PredictionData[];
}
