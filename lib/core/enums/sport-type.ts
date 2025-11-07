/**
 * Sport Type Enum
 * Basé sur lib/core/enums/sport_type.dart
 */

export enum SportType {
  FOOTBALL = 'football',
  BASKETBALL = 'basketball',
}

export const SportTypeConfig = {
  [SportType.FOOTBALL]: {
    name: 'Football',
    icon: '⚽',
    slug: 'football',
  },
  [SportType.BASKETBALL]: {
    name: 'Basketball',
    icon: '🏀',
    slug: 'basketball',
  },
} as const;

export type SportTypeKey = keyof typeof SportType;
