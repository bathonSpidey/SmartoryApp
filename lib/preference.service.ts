// ─────────────────────────────────────────────
//  Smartory — Preference Service
//  Stores a user's question/answer preference via
//  the POST /preferences endpoint. The backend also
//  removes the answered question from future analysis
//  responses automatically.
// ─────────────────────────────────────────────

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL!;

// ─── Types ────────────────────────────────────

export type Preference = {
  id: string;
  user_id: string;
  question: string;
  answer: string;
  created_at: string;
};

export type PreferenceCreatePayload = {
  question: string;
  answer: string;
};

export type PreferenceCreateResponse = {
  status: "success" | "error";
  data: unknown;
};

export type PreferenceListResponse = {
  status: "success" | "error";
  data: Preference[];
};

export type PreferenceUpdateResponse = {
  status: "success" | "error";
  data: Preference;
};

export type PreferenceDeleteResponse = {
  status: "success" | "error";
  deleted: Preference;
};

// ─── API calls ────────────────────────────────

/**
 * POST /preferences
 * Records the user's answer to a preference question.
 * The backend removes the question from all monthly_analysis
 * JSONB records so it won't surface in future prompts.
 */
export async function createPreference(
  token: string,
  question: string,
  answer: string,
): Promise<PreferenceCreateResponse> {
  const payload: PreferenceCreatePayload = { question, answer };

  const res = await fetch(`${BASE_URL}/preferences`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`Failed to save preference (${res.status}): ${text}`);
  }

  return res.json();
}

/**
 * GET /preferences
 * Returns all stored preferences for the authenticated user.
 */
export async function fetchPreferences(
  token: string,
): Promise<PreferenceListResponse> {
  const res = await fetch(`${BASE_URL}/preferences`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`Failed to load preferences (${res.status}): ${text}`);
  }

  return res.json();
}

/**
 * PUT /preferences/{preference_id}
 * Updates the answer for a specific preference owned by the authenticated user.
 */
export async function updatePreference(
  token: string,
  preferenceId: string,
  answer: string,
): Promise<PreferenceUpdateResponse> {
  const res = await fetch(`${BASE_URL}/preferences/${preferenceId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ answer }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`Failed to update preference (${res.status}): ${text}`);
  }

  return res.json();
}

/**
 * DELETE /preferences/{preference_id}
 * Deletes a specific preference owned by the authenticated user.
 */
export async function deletePreference(
  token: string,
  preferenceId: string,
): Promise<PreferenceDeleteResponse> {
  const res = await fetch(`${BASE_URL}/preferences/${preferenceId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`Failed to delete preference (${res.status}): ${text}`);
  }

  return res.json();
}
