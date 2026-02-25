// ─────────────────────────────────────────────
//  useUserCurrency — global preferred currency
//  Fetches from backend on mount, exposes a
//  setter that saves to backend + updates state.
// ─────────────────────────────────────────────

import { CurrencyCode } from "@/constants/currencies";
import { supabase } from "@/lib/supabase";
import { getUserCurrency, updateUserCurrency } from "@/lib/user.service";
import { useEffect, useState } from "react";

export function useUserCurrency() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const token = data.session?.access_token;
      if (!token) {
        setLoading(false);
        return;
      }
      getUserCurrency(token)
        .then(setCurrency)
        .catch(() => {})
        .finally(() => setLoading(false));
    });
  }, []);

  /** Saves the new currency to the backend and updates local state. */
  const update = async (code: CurrencyCode): Promise<void> => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) throw new Error("Not authenticated");
    await updateUserCurrency(token, code);
    setCurrency(code);
  };

  return { currency, loading, update };
}
