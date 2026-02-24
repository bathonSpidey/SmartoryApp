import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

/**
 * Returns the current Supabase session and a loading flag.
 * Re-renders automatically whenever auth state changes
 * (login, logout, token refresh, OAuth callback).
 */
export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get the session that may already exist (e.g. from AsyncStorage on app restart)
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    // Subscribe to future auth changes (login, logout, token refresh, OAuth redirect)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setLoading(false);
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  return { session, loading };
}
