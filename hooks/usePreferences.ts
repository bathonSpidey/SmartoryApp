// ─────────────────────────────────────────────
//  usePreferences
//  Fetches the authenticated user's stored
//  preference answers from the backend.
// ─────────────────────────────────────────────

import {
  Preference,
  deletePreference,
  fetchPreferences,
  updatePreference,
} from "@/lib/preference.service";
import { useCallback, useEffect, useState } from "react";
import { useSession } from "./useSession";

export type UsePreferencesResult = {
  preferences: Preference[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  updatePreference: (preferenceId: string, answer: string) => Promise<void>;
  deletePreference: (preferenceId: string) => Promise<void>;
};

export function usePreferences(): UsePreferencesResult {
  const { session } = useSession();
  const [preferences, setPreferences] = useState<Preference[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!session?.access_token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchPreferences(session.access_token);
      setPreferences(res.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load preferences");
    } finally {
      setLoading(false);
    }
  }, [session?.access_token]);

  useEffect(() => {
    load();
  }, [load]);

  const update = useCallback(
    async (preferenceId: string, answer: string) => {
      if (!session?.access_token) return;
      await updatePreference(session.access_token, preferenceId, answer);
      await load();
    },
    [session?.access_token, load],
  );

  const remove = useCallback(
    async (preferenceId: string) => {
      if (!session?.access_token) return;
      await deletePreference(session.access_token, preferenceId);
      await load();
    },
    [session?.access_token, load],
  );

  return {
    preferences,
    loading,
    error,
    refetch: load,
    updatePreference: update,
    deletePreference: remove,
  };
}
