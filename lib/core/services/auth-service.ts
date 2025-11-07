/**
 * Auth Service
 * Basé sur lib/core/services/auth_service.dart
 */

import { getSupabaseClient } from './supabase-service';
import { httpService } from './http-service';
import { User } from '@/lib/types/user';
import { AuthError, Session, AuthResponse } from '@supabase/supabase-js';

export class AuthService {
  private static instance: AuthService;

  private constructor() {
    // Initialize auth state listener
    this.initAuthListener();
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private initAuthListener() {
    try {
      const supabase = getSupabaseClient();
      supabase.auth.onAuthStateChange((event, session) => {
        if (session?.access_token) {
          httpService.setAccessToken(session.access_token);
        } else {
          httpService.setAccessToken(null);
        }
      });
    } catch (error) {
      // Supabase not initialized, skip auth listener
      console.warn('Supabase not initialized, skipping auth listener');
    }
  }

  async signUp(email: string, password: string): Promise<{ user: User | null; error: AuthError | null }> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return { user: null, error };
    }

    if (data.user) {
      const user: User = {
        id: data.user.id,
        email: data.user.email!,
        createdAt: data.user.created_at,
        metadata: data.user.user_metadata,
      };
      return { user, error: null };
    }

    return { user: null, error: null };
  }

  async signIn(email: string, password: string): Promise<{ user: User | null; error: AuthError | null }> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { user: null, error };
    }

    if (data.user) {
      const user: User = {
        id: data.user.id,
        email: data.user.email!,
        createdAt: data.user.created_at,
        metadata: data.user.user_metadata,
      };
      return { user, error: null };
    }

    return { user: null, error: null };
  }

  async signOut(): Promise<{ error: AuthError | null }> {
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signOut();
    return { error };
  }

  async resetPassword(email: string): Promise<{ error: AuthError | null }> {
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    return { error };
  }

  async updatePassword(newPassword: string): Promise<{ error: AuthError | null }> {
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    return { error };
  }

  async getCurrentUser(): Promise<User | null> {
    const supabase = getSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      return {
        id: user.id,
        email: user.email!,
        createdAt: user.created_at,
        metadata: user.user_metadata,
      };
    }

    return null;
  }

  async getSession(): Promise<Session | null> {
    try {
      const supabase = getSupabaseClient();
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    } catch (error) {
      return null;
    }
  }

  get isLoggedIn(): boolean {
    try {
      const supabase = getSupabaseClient();
      return !!supabase.auth.getSession();
    } catch (error) {
      return false;
    }
  }

  async getAccessToken(): Promise<string | null> {
    try {
      const supabase = getSupabaseClient();
      const { data: { session } } = await supabase.auth.getSession();
      return session?.access_token || null;
    } catch (error) {
      return null;
    }
  }
}

export const authService = AuthService.getInstance();
