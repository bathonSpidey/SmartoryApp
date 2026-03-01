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
    let settled = false;

    // Safety net: on Android, AsyncStorage or Supabase locks can hang
    // indefinitely. Force-resolve loading after 5 s so the app never freezes.
    const timeout = setTimeout(() => {
      if (!settled) {
        settled = true;
        setLoading(false);
      }
    }, 5000);

    const settle = (s: Session | null) => {
      if (!settled) {
        settled = true;
        clearTimeout(timeout);
        setSession(s);
        setLoading(false);
      }
    };

    // Get the session that may already exist (e.g. from AsyncStorage on app restart)
    supabase.auth
      .getSession()
      .then(({ data }) => settle(data.session))
      .catch(() => settle(null));

    // Subscribe to future auth changes (login, logout, token refresh, OAuth redirect)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        // Always update session on auth changes, even after initial settle
        settled = true;
        clearTimeout(timeout);
        setSession(newSession);
        setLoading(false);
      },
    );

    return () => {
      clearTimeout(timeout);
      listener.subscription.unsubscribe();
    };
  }, []);

  return { session, loading };
}
