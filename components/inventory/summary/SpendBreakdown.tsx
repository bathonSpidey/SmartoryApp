import { Radius, SemanticTheme, Spacing, Typography } from "@/constants/Themes";
import { CURRENCY_SYMBOLS, CurrencyCode } from "@/constants/currencies";
import { convertAmount, ExchangeRates } from "@/lib/currency.service";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { getCategoryColor } from "../categoryColors";
import { Receipt } from "../types";
import { receiptDate } from "./dateUtils";

type Tab = "month" | "year" | "all";
const TABS: { key: Tab; label: string }[] = [
  { key: "month", label: "This Month" },
  { key: "year", label: "This Year" },
  { key: "all", label: "All Time" },
];

function filterByTab(receipts: Receipt[], tab: Tab): Receipt[] {
  if (tab === "all") return receipts;
  const now = new Date();
  return receipts.filter((r) => {
    const d = receiptDate(r);
    if (tab === "month")
      return (
        d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      );
    return d.getFullYear() === now.getFullYear();
  });
}

type Props = {
  receipts: Receipt[];
  theme: SemanticTheme;
  preferredCurrency: CurrencyCode;
  rates: ExchangeRates;
};

export function SpendBreakdown({
  receipts,
  theme,
  preferredCurrency,
  rates,
}: Props) {
  // Default to "all" so the card is always visible regardless of when receipts were scanned
  const [tab, setTab] = useState<Tab>("all");
  const [activeCat, setActiveCat] = useState<string | null>(null);

  const filtered = filterByTab(receipts, tab);

  const symbol = CURRENCY_SYMBOLS[preferredCurrency] ?? preferredCurrency + " ";

  // Total spend converted to preferred currency
  const totalSpend = filtered.reduce((sum, r) => {
    const from = r.raw_response.currency ?? "USD";
    return sum + convertAmount(r.total_amount, from, preferredCurrency, rates);
  }, 0);

  // Category spend + item stats, amounts converted to preferred currency
  const catData: Record<
    string,
    { spend: number; items: number; trips: Set<string> }
  > = {};
  for (const r of filtered) {
    const fromCur = r.raw_response.currency ?? "USD";
    for (const item of r.items) {
      if (!catData[item.category])
        catData[item.category] = { spend: 0, items: 0, trips: new Set() };
      catData[item.category].spend += convertAmount(
        item.price * item.quantity,
        fromCur,
        preferredCurrency,
        rates,
      );
      catData[item.category].items += item.quantity;
      catData[item.category].trips.add(r.id);
    }
  }

  const sortedCats = Object.entries(catData)
    .sort((a, b) => b[1].spend - a[1].spend)
    .slice(0, 5);

  const maxSpend = sortedCats[0]?.[1].spend ?? 1;
  const topCat = sortedCats[0]?.[0] ?? null;

  return (
    <View
      style={[
        s.card,
        { backgroundColor: theme.surface, borderColor: theme.border },
      ]}
    >
      {/* ── Header ── */}
      <View style={s.header}>
        <Text style={[s.title, { color: theme.text }]}>Where it went</Text>
        {topCat && (
          <View
            style={[
              s.insightPill,
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
            <Text style={[s.insightText, { color: getCategoryColor(topCat) }]}>
              {topCat} leads
            </Text>
          </View>
        )}
      </View>

      {/* ── Tabs ── */}
      <View style={[s.tabRow, { backgroundColor: theme.surfaceElevated }]}>
        {TABS.map((t) => (
          <Pressable
            key={t.key}
            style={[
              s.tab,
              tab === t.key && {
                backgroundColor: theme.surface,
                ...theme.shadowCard,
              },
            ]}
            onPress={() => {
              setTab(t.key);
              setActiveCat(null);
            }}
          >
            <Text
              style={[
                s.tabText,
                { color: tab === t.key ? theme.text : theme.textMuted },
                tab === t.key && { fontWeight: "700" },
              ]}
            >
              {t.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* ── Category rows ── */}
      {sortedCats.length === 0 ? (
        <View style={s.emptyState}>
          <Ionicons name="receipt-outline" size={22} color={theme.textMuted} />
          <Text style={[s.emptyText, { color: theme.textMuted }]}>
            No spending data for this period
          </Text>
        </View>
      ) : (
        <View style={s.rows}>
          {sortedCats.map(([cat, data]) => {
            const color = getCategoryColor(cat);
            const pct =
              totalSpend > 0 ? Math.round((data.spend / totalSpend) * 100) : 0;
            const barPct = (data.spend / maxSpend) * 100;
            const isActive = activeCat === cat;
            const avgPerTrip =
              data.trips.size > 0 ? data.spend / data.trips.size : 0;

            return (
              <Pressable
                key={cat}
                onPress={() => setActiveCat(isActive ? null : cat)}
                style={({ pressed }) => [
                  s.row,
                  isActive && {
                    backgroundColor: color + "0f",
                    borderRadius: Radius.md,
                  },
                  pressed && { opacity: 0.75 },
                ]}
              >
                <View style={s.rowInner}>
                  <View style={s.rowLeft}>
                    <View style={[s.colorDot, { backgroundColor: color }]} />
                    <Text
                      style={[s.catName, { color: theme.text }]}
                      numberOfLines={1}
                    >
                      {cat}
                    </Text>
                  </View>
                  <View style={s.barTrack}>
                    <View
                      style={[
                        s.barFill,
                        { backgroundColor: color, width: `${barPct}%` as any },
                      ]}
                    />
                  </View>
                  <View style={s.rowRight}>
                    <Text style={[s.spendText, { color: theme.text }]}>
                      {symbol}
                      {data.spend.toFixed(0)}
                    </Text>
                    <Text style={[s.pctText, { color: theme.textMuted }]}>
                      {pct}%
                    </Text>
                  </View>
                </View>
                {isActive && (
                  <View style={[s.detail, { borderTopColor: color + "33" }]}>
                    <Text style={[s.detailText, { color: theme.textMuted }]}>
                      {data.items} items · avg {symbol}
                      {avgPerTrip.toFixed(2)} per trip
                    </Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
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
  insightText: { fontSize: 11, fontWeight: "700" },
  tabRow: { flexDirection: "row", borderRadius: Radius.md, padding: 3, gap: 2 },
  tab: {
    flex: 1,
    paddingVertical: 7,
    paddingHorizontal: 4,
    borderRadius: Radius.sm,
    alignItems: "center",
  },
  tabText: { fontSize: 11, fontWeight: "500", letterSpacing: 0.1 },
  rows: { gap: 4 },
  row: { paddingVertical: 6, paddingHorizontal: 6 },
  rowInner: { flexDirection: "row", alignItems: "center", gap: Spacing.sm },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 6, width: 88 },
  colorDot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  catName: { fontSize: Typography.size.xs, fontWeight: "600", flex: 1 },
  barTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(120,120,128,0.12)",
    overflow: "hidden",
  },
  barFill: { height: 6, borderRadius: 3, minWidth: 4 },
  rowRight: { width: 58, alignItems: "flex-end", gap: 1 },
  spendText: {
    fontSize: Typography.size.xs,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  pctText: { fontSize: 10, fontWeight: "500" },
  detail: {
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 2,
  },
  detailText: { fontSize: 11, fontWeight: "500" },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 24,
  },
  emptyText: { fontSize: 13, fontWeight: "500" },
});
