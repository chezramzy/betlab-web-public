/**
 * User Types
 * Basé sur lib/data/models/user_model.dart et user_profile_model.dart
 */

export interface User {
  id: string;
  email: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface UserProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserFavoriteLeague {
  userId: string;
  leagueId: number;
  createdAt: string;
}
