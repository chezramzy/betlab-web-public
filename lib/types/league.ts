/**
 * League Types
 * Basé sur lib/data/models/league_data_model.dart
 */

import { SportType } from '@/lib/core/enums/sport-type';

export interface League {
  id: number;
  name: string;
  country: string;
  countryFlag?: string;
  logo?: string;
  isPopular: boolean;
  category?: string;
  sport: SportType;
}

export interface LeagueWithMatches extends League {
  matchCount: number;
}
