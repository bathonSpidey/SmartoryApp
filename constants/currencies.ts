// ─────────────────────────────────────────────
//  constants/currencies.ts
//  Single source of truth for all currency data
//  used across services, hooks, and UI components.
// ─────────────────────────────────────────────

/** All supported currency codes across the app. */
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

/** Maps currency code → display symbol. */
export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  CAD: "C$",
  AUD: "A$",
  INR: "₹",
  CHF: "Fr ",
  CNY: "¥",
  SGD: "S$",
  AED: "د.إ",
  BRL: "R$",
  MXN: "MX$",
  KRW: "₩",
  SEK: "kr",
};

/** Full currency list used in the Settings UI. */
export const CURRENCY_OPTIONS: {
  code: CurrencyCode;
  label: string;
  symbol: string;
}[] = [
  { code: "USD", label: "US Dollar", symbol: "$" },
  { code: "EUR", label: "Euro", symbol: "€" },
  { code: "GBP", label: "British Pound", symbol: "£" },
  { code: "INR", label: "Indian Rupee", symbol: "₹" },
  { code: "JPY", label: "Japanese Yen", symbol: "¥" },
  { code: "CAD", label: "Canadian Dollar", symbol: "C$" },
  { code: "AUD", label: "Australian Dollar", symbol: "A$" },
  { code: "CHF", label: "Swiss Franc", symbol: "Fr" },
  { code: "CNY", label: "Chinese Yuan", symbol: "¥" },
  { code: "SGD", label: "Singapore Dollar", symbol: "S$" },
  { code: "AED", label: "UAE Dirham", symbol: "د.إ" },
  { code: "BRL", label: "Brazilian Real", symbol: "R$" },
  { code: "MXN", label: "Mexican Peso", symbol: "MX$" },
  { code: "KRW", label: "South Korean Won", symbol: "₩" },
  { code: "SEK", label: "Swedish Krona", symbol: "kr" },
];
