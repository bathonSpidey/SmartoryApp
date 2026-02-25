import { getReceipts, SavedReceipt } from "@/lib/receipt.service";
import { supabase } from "@/lib/supabase";
import { useCallback, useEffect, useState } from "react";

export function useReceipts() {
  const [receipts, setReceipts] = useState<SavedReceipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReceipts = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) throw new Error("Not authenticated");
      setReceipts(await getReceipts(token));
    } catch (err: any) {
      setError(err.message ?? "Failed to load receipts");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchReceipts();
  }, [fetchReceipts]);

  return {
    receipts,
    loading,
    refreshing,
    error,
    refresh: () => fetchReceipts(true),
  };
}
