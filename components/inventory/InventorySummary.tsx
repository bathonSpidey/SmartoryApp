// ─────────────────────────────────────────────
//  InventorySummary — Conversational spending
//  snapshot. Designed for clarity-first UX:
//  plain language, spend breakdown with bars,
//  and a human insight headline.
// ─────────────────────────────────────────────

import { Radius, SemanticTheme, Spacing, Typography } from "@/constants/Themes";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { getCategoryColor } from "./categoryColors";
import { Receipt } from "./types";

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  CAD: "C$",
  AUD: "A$",
  INR: "₹",
  CHF: "Fr ",
  CNY: "¥",
};

type Props = {
  receipts: Receipt[];
  theme: SemanticTheme;
};

export function InventorySummary({ receipts, theme }: Props) {
  const totalItems = receipts.reduce((s, r) => s + r.items.length, 0);
  const uniqueStores = new Set(receipts.map((r) => r.store_name.toLowerCase()))
    .size;

  // Primary currency (most used) + total spent in it
  const spendByCurrency: Record<string, number> = {};
  for (const r of receipts) {
    const cur = r.raw_response.currency ?? "USD";
    spendByCurrency[cur] = (spendByCurrency[cur] ?? 0) + r.total_amount;
  }
  const [[primaryCurrency, primaryTotal]] = Object.entries(
    spendByCurrency,
  ).sort((a, b) => b[1] - a[1]);
  const symbol = CURRENCY_SYMBOLS[primaryCurrency] ?? primaryCurrency + " ";
  const totalSpend = primaryTotal;

  // Spend by category (sum of item price × qty)
  const catSpend: Record<string, number> = {};
  for (const r of receipts) {
    for (const item of r.items) {
      catSpend[item.category] =
        (catSpend[item.category] ?? 0) + item.price * item.quantity;
    }
  }
  const sortedCats = Object.entries(catSpend)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const topCat = sortedCats[0]?.[0] ?? null;
  const maxCatSpend = sortedCats[0]?.[1] ?? 1;

  // Largest single receipt
  const biggestReceipt = receipts.reduce(
    (max, r) => (r.total_amount > max.total_amount ? r : max),
    receipts[0],
  );

  return (
    <View style={styles.container}>
      {/* ── Hero spend card ── */}
      <View
        style={[
          styles.heroCard,
          {
            backgroundColor: theme.primary,
          },
        ]}
      >
        <Text style={styles.heroLabel}>You've spent</Text>
        <Text style={styles.heroAmount}>
          {symbol}
          {totalSpend.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Text>
        <View style={styles.heroMeta}>
          <View style={styles.heroMetaItem}>
            <Ionicons
              name="storefront-outline"
              size={13}
              color="rgba(255,255,255,0.75)"
            />
            <Text style={styles.heroMetaText}>
              {uniqueStores} {uniqueStores === 1 ? "store" : "stores"}
            </Text>
          </View>
          <View style={styles.heroMetaDot} />
          <View style={styles.heroMetaItem}>
            <Ionicons
              name="cube-outline"
              size={13}
              color="rgba(255,255,255,0.75)"
            />
            <Text style={styles.heroMetaText}>
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </Text>
          </View>
          {biggestReceipt && (
            <>
              <View style={styles.heroMetaDot} />
              <View style={styles.heroMetaItem}>
                <Ionicons
                  name="trending-up-outline"
                  size={13}
                  color="rgba(255,255,255,0.75)"
                />
                <Text style={styles.heroMetaText} numberOfLines={1}>
                  Most at {titleCase(biggestReceipt.store_name)}
                </Text>
              </View>
            </>
          )}
        </View>
      </View>

      {/* ── Where it went ── */}
      {sortedCats.length > 0 && (
        <View
          style={[
            styles.breakdownCard,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          <View style={styles.breakdownHeader}>
            <Text style={[styles.breakdownTitle, { color: theme.text }]}>
              Where it went
            </Text>
            {topCat && (
              <View
                style={[
                  styles.insightPill,
                  {
                    backgroundColor: getCategoryColor(topCat) + "18",
                    borderColor: getCategoryColor(topCat) + "33",
                  },
                ]}
              >
                <Ionicons
                  name="sparkles"
                  size={11}
                  color={getCategoryColor(topCat)}
                />
                <Text
                  style={[
                    styles.insightText,
                    { color: getCategoryColor(topCat) },
                  ]}
                >
                  {topCat} leads
                </Text>
              </View>
            )}
          </View>

          <View style={styles.catRows}>
            {sortedCats.map(([cat, spend]) => {
              const color = getCategoryColor(cat);
              const pct = Math.round((spend / totalSpend) * 100);
              const barWidth = (spend / maxCatSpend) * 100;
              return (
                <View key={cat} style={styles.catRow}>
                  <View style={styles.catRowLeft}>
                    <View
                      style={[styles.catColorDot, { backgroundColor: color }]}
                    />
                    <Text
                      style={[styles.catName, { color: theme.text }]}
                      numberOfLines={1}
                    >
                      {cat}
                    </Text>
                  </View>
                  <View style={styles.catBarTrack}>
                    <View
                      style={[
                        styles.catBarFill,
                        {
                          backgroundColor: color,
                          width: `${barWidth}%` as any,
                        },
                      ]}
                    />
                  </View>
                  <View style={styles.catRowRight}>
                    <Text style={[styles.catSpend, { color: theme.text }]}>
                      {symbol}
                      {spend.toFixed(0)}
                    </Text>
                    <Text style={[styles.catPct, { color: theme.textMuted }]}>
                      {pct}%
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
}

function titleCase(str: string) {
  return str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },

  // ── Hero ──
  heroCard: {
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    gap: 6,
  },
  heroLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: Typography.size.sm,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  heroAmount: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "800",
    letterSpacing: -1.5,
    lineHeight: 40,
  },
  heroMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
    flexWrap: "wrap",
  },
  heroMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  heroMetaText: {
    color: "rgba(255,255,255,0.75)",
    fontSize: Typography.size.xs,
    fontWeight: "500",
  },
  heroMetaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "rgba(255,255,255,0.4)",
  },

  // ── Breakdown card ──
  breakdownCard: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  breakdownHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  breakdownTitle: {
    fontSize: Typography.size.sm,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  insightPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  insightText: {
    fontSize: 11,
    fontWeight: "700",
  },

  // ── Category rows ──
  catRows: {
    gap: 10,
  },
  catRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  catRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    width: 90,
  },
  catColorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    flexShrink: 0,
  },
  catName: {
    fontSize: Typography.size.xs,
    fontWeight: "600",
    flex: 1,
  },
  catBarTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(120,120,128,0.12)",
    overflow: "hidden",
  },
  catBarFill: {
    height: 6,
    borderRadius: 3,
    minWidth: 4,
  },
  catRowRight: {
    width: 60,
    alignItems: "flex-end",
    gap: 1,
  },
  catSpend: {
    fontSize: Typography.size.xs,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  catPct: {
    fontSize: 10,
    fontWeight: "500",
  },
});
