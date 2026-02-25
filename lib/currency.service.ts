// ─────────────────────────────────────────────
//  currency.service.ts
//  Exchange rates via frankfurter.app — free,
//  no API key, backed by ECB reference rates.
//  https://www.frankfurter.app/docs/
// ─────────────────────────────────────────────

import { CURRENCY_SYMBOLS } from "@/constants/currencies";
export { CURRENCY_SYMBOLS };

const API = "https://api.frankfurter.app";

/** Rates relative to USD (USD = 1 always included). */
export type ExchangeRates = Record<string, number>;

// ── In-memory cache (per app session) ────────
let _cache: { rates: ExchangeRates; fetchedAt: number } | null = null;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

/**
 * Returns latest exchange rates with USD as the base.
 * Cached for 1 hour to avoid hammering the free API.
 *
 * Conversion formula:
 *   amount_in_target = (amount_in_source / rates[source]) * rates[target]
 */
export async function getExchangeRates(): Promise<ExchangeRates> {
  const now = Date.now();
  if (_cache && now - _cache.fetchedAt < CACHE_TTL_MS) return _cache.rates;

  const res = await fetch(`${API}/latest?from=USD`);
  if (!res.ok) throw new Error(`Frankfurter API error: ${res.status}`);

  const json = await res.json();
  // Ensure USD itself is always in the map
  const rates: ExchangeRates = { USD: 1, ...json.rates };
  _cache = { rates, fetchedAt: now };
  return rates;
}

/**
 * Converts an amount from one currency to another using pre-fetched rates.
 * Falls back to 1:1 if either currency is missing from the rates map
 * (e.g. currencies not covered by ECB like AED).
 */
export function convertAmount(
  amount: number,
  from: string,
  to: string,
  rates: ExchangeRates,
): number {
  if (from === to) return amount;
  const fromRate = rates[from] ?? null;
  const toRate = rates[to] ?? null;
  // If either side is unknown, return the raw amount unchanged
  if (fromRate === null || toRate === null) return amount;
  // amount → USD → target
  return (amount / fromRate) * toRate;
}
