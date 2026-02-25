// ─────────────────────────────────────────────
//  Category → accent colour mapping
//  Colors are intentionally warm + accessible.
//  Add new categories here — components pick up
//  automatically via the FALLBACK_COLOR.
// ─────────────────────────────────────────────

export const CATEGORY_COLORS: Record<string, string> = {
  Grocery: "#059669", // emerald
  Beverage: "#0284c7", // sky blue
  Apparel: "#7c3aed", // violet
  "Home Goods": "#d97706", // amber
  "Office Supplies": "#0d9488", // teal
  "General Merchandise": "#78716c", // warm stone
  Electronics: "#2563eb", // blue
  "Personal Care": "#db2777", // pink
  Food: "#16a34a", // green
  Household: "#b45309", // dark amber
  Cleaning: "#0891b2", // cyan
  Bakery: "#c2410c", // burnt orange
  Produce: "#15803d", // forest green
  Dairy: "#7c3aed", // indigo/violet
  Snacks: "#ea580c", // orange
  Frozen: "#1d4ed8", // deep blue
  Pharmacy: "#be123c", // crimson
  Baby: "#9333ea", // purple
  Pet: "#b45309", // brown amber
  Sports: "#0f766e", // dark teal
  Toys: "#c026d3", // fuchsia
  Books: "#44403c", // warm brown
};

export const FALLBACK_COLOR = "#0d9488"; // brand teal

export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] ?? FALLBACK_COLOR;
}

// ── Store name → avatar background colour ────
// Hash the store name into one of a warm palette.
const AVATAR_PALETTE = [
  "#0d9488",
  "#7c3aed",
  "#d97706",
  "#0284c7",
  "#db2777",
  "#059669",
  "#ea580c",
  "#2563eb",
];

export function getStoreColor(storeName: string): string {
  let hash = 0;
  for (let i = 0; i < storeName.length; i++) {
    hash = storeName.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}
