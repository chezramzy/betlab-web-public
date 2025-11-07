/**
 * Fixture (Match) Types
 * Basé sur lib/data/models/fixture/
 */

import { SportType } from '@/lib/core/enums/sport-type';

export enum MatchStatus {
  SCHEDULED = 'scheduled',
  LIVE = 'live',
  FINISHED = 'finished',
  POSTPONED = 'postponed',
  CANCELLED = 'cancelled',
}

export interface Team {
  id: number;
  name: string;
  logo?: string;
  form?: string;
}

export interface Score {
  home: number | null;
  away: number | null;
}

export interface Venue {
  id?: number;
  name: string;
  city?: string;
}

export interface FixtureLeague {
  id: number;
  name: string;
  country: string;
  logo?: string;
  flag?: string;
}

export interface Fixture {
  id: number;
  date: string;
  timestamp: number;
  status: MatchStatus;
  homeTeam: Team;
  awayTeam: Team;
  score: Score;
  league: FixtureLeague;
  venue?: Venue;
  sport: SportType;
}

export interface LiveFixture extends Fixture {
  elapsed: number;
  events?: MatchEvent[];
}

export interface MatchEvent {
  time: {
    elapsed: number;
    extra?: number;
  };
  team: Team;
  player: {
    id: number;
    name: string;
  };
  type: 'Goal' | 'Card' | 'Substitution';
  detail: string;
}
