// ─────────────────────────────────────────────
//  Smartory — User Service
//  Manages user-level preferences via the API.
// ─────────────────────────────────────────────

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL!;

import { CurrencyCode } from "@/constants/currencies";
export type { CurrencyCode };

/**
 * Fetches the stored preferred currency for the authenticated user.
 * GET /user/currency → { currency: "EUR" }
 * Falls back to "USD" if the endpoint is unavailable or returns nothing.
 */
export async function getUserCurrency(token: string): Promise<CurrencyCode> {
  try {
    const res = await fetch(`${BASE_URL}/user/currency`, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) return "USD";
    const data = await res.json();
    return (data?.currency as CurrencyCode) ?? "USD";
  } catch {
    return "USD";
  }
}

/**
 * Updates the preferred currency for the authenticated user.
 * PUT /user/currency?currency={code}
 */
export async function updateUserCurrency(
  token: string,
  currency: CurrencyCode,
): Promise<void> {
  const res = await fetch(
    `${BASE_URL}/user/currency?currency=${encodeURIComponent(currency)}`,
    {
      method: "PUT",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Failed to update currency: HTTP ${res.status}${text ? ` — ${text}` : ""}`,
    );
  }
}
