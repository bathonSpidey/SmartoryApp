// ─────────────────────────────────────────────
//  Smartory — User Service
//  Manages user-level preferences via the API.
// ─────────────────────────────────────────────

const BASE_URL = "http://127.0.0.1:8000";

export type CurrencyCode =
  | "USD"
  | "EUR"
  | "GBP"
  | "JPY"
  | "CAD"
  | "AUD"
  | "INR"
  | "CHF"
  | "CNY"
  | "SGD"
  | "AED"
  | "BRL"
  | "MXN"
  | "KRW"
  | "SEK";

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
