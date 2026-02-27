// ─────────────────────────────────────────────
//  Smartory — Analysis Service
//  Fetches today's AI-powered inventory analysis
//  from the /analysis/today endpoint.
// ─────────────────────────────────────────────

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL!;

// ─── Types ────────────────────────────────────

export type PreferenceQuestion = {
  question: string;
  selected_option: string[];
};

export type OverallSummary = {
  alerts: string[];
  summary: string;
  insights: string[];
  recommendations: string[];
  questions_for_user: PreferenceQuestion[];
};

export type ItemContext = {
  category: string;
  item_name: string;
  last_purchased_on: string;
  days_since_purchase: number;
  estimated_expiration: string;
};

export type ItemDetail = {
  item_context: ItemContext;
  message_for_user: string;
  preference_message_to_ask: string;
  options_for_preference_question: PreferenceQuestion[];
};

export type AnalysisEntry = {
  id: string;
  user_id: string;
  run_date: string;
  created_at: string;
  overall_summary: OverallSummary;
  item_details: ItemDetail[];
};

export type AnalysisResponse = {
  status: "success" | "error";
  data: AnalysisEntry[];
};

// ─── Derived helpers ──────────────────────────

/**
 * Days until a date string (YYYY-MM-DD) from today.
 * Negative means already expired.
 */
export function daysUntil(dateStr: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - now.getTime()) / 86_400_000);
}

/**
 * Returns "urgent" items (≤ 2 days) from item_details.
 */
export function getUrgentItems(details: ItemDetail[]) {
  return details
    .filter((d) => daysUntil(d.item_context.estimated_expiration) <= 2)
    .sort(
      (a, b) =>
        daysUntil(a.item_context.estimated_expiration) -
        daysUntil(b.item_context.estimated_expiration),
    );
}

/**
 * Collects ALL preference questions from the analysis into a flat list,
 * tagged with enough context to display them.
 */
export type FlatQuestion = {
  id: string;
  question: string;
  options: string[];
  context?: string; // e.g. item name
};

export function flattenQuestions(entry: AnalysisEntry): FlatQuestion[] {
  const result: FlatQuestion[] = [];

  // From overall summary
  entry.overall_summary.questions_for_user.forEach((q, i) => {
    result.push({
      id: `overall-${i}`,
      question: q.question,
      options: q.selected_option,
    });
  });

  // From each item
  entry.item_details.forEach((item) => {
    item.options_for_preference_question.forEach((q, i) => {
      result.push({
        id: `item-${item.item_context.item_name}-${i}`,
        question: q.question,
        options: q.selected_option,
        context: item.item_context.item_name,
      });
    });
  });

  return result;
}

// ─── API call ─────────────────────────────────

export async function fetchTodaysAnalysis(
  accessToken: string,
): Promise<AnalysisEntry | null> {
  const url = `${BASE_URL}/analysis/today`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    const errorBody = await res.text();
    console.error("[fetchTodaysAnalysis] Error body:", errorBody);
    throw new Error(`Analysis fetch failed: ${res.status}`);
  }
  const json: AnalysisResponse = await res.json();
  if (json.status !== "success" || !json.data?.length) return null;
  return json.data[0];
}
