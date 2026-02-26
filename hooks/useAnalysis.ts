import {
  AnalysisEntry,
  fetchTodaysAnalysis,
  FlatQuestion,
  flattenQuestions,
  getUrgentItems,
  ItemDetail,
} from "@/lib/analysis.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { useSession } from "./useSession";

const DISMISSED_QUESTION_KEY = "smartory:dismissed_questions";
const CACHE_KEY = "smartory:analysis_cache";
const CACHE_DATE_KEY = "smartory:analysis_cache_date";

// ─── Hook return type ─────────────────────────

export type UseAnalysisResult = {
  analysis: AnalysisEntry | null;
  loading: boolean;
  error: string | null;
  urgentItems: ItemDetail[];
  allAlerts: string[];
  currentQuestion: FlatQuestion | null;
  dismissCurrentQuestion: () => void;
  answerCurrentQuestion: (option: string) => void;
  refetch: () => void;
};

// ─────────────────────────────────────────────

export function useAnalysis(): UseAnalysisResult {
  const { session } = useSession();
  const [analysis, setAnalysis] = useState<AnalysisEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [questionPool, setQuestionPool] = useState<FlatQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<FlatQuestion | null>(
    null,
  );

  // ── Persist dismissed question IDs ────────────

  const loadDismissed = useCallback(async (): Promise<Set<string>> => {
    try {
      const raw = await AsyncStorage.getItem(DISMISSED_QUESTION_KEY);
      return new Set(raw ? JSON.parse(raw) : []);
    } catch {
      return new Set();
    }
  }, []);

  const saveDismissed = useCallback(async (ids: Set<string>) => {
    try {
      await AsyncStorage.setItem(
        DISMISSED_QUESTION_KEY,
        JSON.stringify([...ids]),
      );
    } catch {}
  }, []);

  // ── Pick one random unanswered question ───────

  const pickQuestion = useCallback(
    async (pool: FlatQuestion[]) => {
      const dismissed = await loadDismissed();
      const available = pool.filter((q) => !dismissed.has(q.id));
      if (!available.length) {
        setCurrentQuestion(null);
        return;
      }
      // Pick randomly
      const idx = Math.floor(Math.random() * available.length);
      setCurrentQuestion(available[idx]);
    },
    [loadDismissed],
  );

  // ── Fetch (with daily cache) ──────────────────

  const fetchData = useCallback(async () => {
    if (!session?.access_token) return;
    setLoading(true);
    setError(null);

    try {
      // Check cache — reuse same-day data to avoid hammering the API
      const today = new Date().toISOString().slice(0, 10);
      const cachedDate = await AsyncStorage.getItem(CACHE_DATE_KEY);

      let entry: AnalysisEntry | null = null;

      if (cachedDate === today) {
        const raw = await AsyncStorage.getItem(CACHE_KEY);
        if (raw) entry = JSON.parse(raw);
      }

      if (!entry) {
        entry = await fetchTodaysAnalysis(session.access_token);
        if (entry) {
          await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(entry));
          await AsyncStorage.setItem(CACHE_DATE_KEY, today);
        }
      }

      setAnalysis(entry);

      if (entry) {
        const pool = flattenQuestions(entry);
        setQuestionPool(pool);
        await pickQuestion(pool);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load analysis");
    } finally {
      setLoading(false);
    }
  }, [session?.access_token, pickQuestion]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Dismiss ───────────────────────────────────

  const dismissCurrentQuestion = useCallback(async () => {
    if (!currentQuestion) return;
    const dismissed = await loadDismissed();
    dismissed.add(currentQuestion.id);
    await saveDismissed(dismissed);
    await pickQuestion(questionPool.filter((q) => q.id !== currentQuestion.id));
  }, [
    currentQuestion,
    questionPool,
    loadDismissed,
    saveDismissed,
    pickQuestion,
  ]);

  // ── Answer (same effect as dismiss — records choice) ──

  const answerCurrentQuestion = useCallback(
    async (_option: string) => {
      // TODO: POST answer to backend once endpoint exists
      await dismissCurrentQuestion();
    },
    [dismissCurrentQuestion],
  );

  // ── Derived values ────────────────────────────

  const urgentItems = analysis ? getUrgentItems(analysis.item_details) : [];
  const allAlerts = analysis?.overall_summary.alerts ?? [];

  return {
    analysis,
    loading,
    error,
    urgentItems,
    allAlerts,
    currentQuestion,
    dismissCurrentQuestion,
    answerCurrentQuestion,
    refetch: fetchData,
  };
}
