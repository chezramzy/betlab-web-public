/**
 * useSession Hook
 * Gère la session Supabase avec auto-refresh
 */

'use client';

import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { getSupabaseClient } from '@/lib/core/services/supabase-service';

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseClient();

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, []);

  return {
    session,
    isLoading,
  };
}
