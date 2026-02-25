import { Radius, SemanticTheme, Spacing, Typography } from "@/constants/Themes";
import { CURRENCY_SYMBOLS, CurrencyCode } from "@/constants/currencies";
import { convertAmount, ExchangeRates } from "@/lib/currency.service";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Receipt } from "../types";
import { receiptDate } from "./dateUtils";

function titleCase(s: string) {
  return s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

function sumReceipts(
  receipts: Receipt[],
  preferredCurrency: CurrencyCode,
  rates: ExchangeRates,
) {
  return receipts.reduce((sum, r) => {
    const from = r.raw_response.currency ?? "USD";
    return sum + convertAmount(r.total_amount, from, preferredCurrency, rates);
  }, 0);
}

type Props = {
  receipts: Receipt[];
  theme: SemanticTheme;
  preferredCurrency: CurrencyCode;
  rates: ExchangeRates;
};

export function SpendHero({
  receipts,
  theme,
  preferredCurrency,
  rates,
}: Props) {
  const now = new Date();
  const monthName = now.toLocaleString("en-US", { month: "long" });

  // This month's receipts
  const thisMonth = receipts.filter((r) => {
    const d = receiptDate(r);
    return (
      d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    );
  });

  // Last month's receipts
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonth = receipts.filter((r) => {
    const d = receiptDate(r);
    return (
      d.getMonth() === lastMonthDate.getMonth() &&
      d.getFullYear() === lastMonthDate.getFullYear()
    );
  });

  const thisMonthSpend = sumReceipts(thisMonth, preferredCurrency, rates);
  const lastMonthSpend = sumReceipts(lastMonth, preferredCurrency, rates);

  // Month-over-month change
  const hasTrend = lastMonthSpend > 0;
  const trendPct = hasTrend
    ? ((thisMonthSpend - lastMonthSpend) / lastMonthSpend) * 100
    : null;
  const trendUp = trendPct !== null && trendPct > 0;

  // Avg per receipt this month
  const avgPerReceipt =
    thisMonth.length > 0 ? thisMonthSpend / thisMonth.length : 0;

  // Most visited store this month
  const storeCounts: Record<string, number> = {};
  for (const r of thisMonth) {
    const key = r.store_name.toLowerCase();
    storeCounts[key] = (storeCounts[key] ?? 0) + 1;
  }
  const topStore = Object.entries(storeCounts).sort((a, b) => b[1] - a[1])[0];

  const symbol = CURRENCY_SYMBOLS[preferredCurrency] ?? preferredCurrency + " ";
  const hasData = thisMonth.length > 0;

  return (
    <View style={[s.card, { backgroundColor: theme.primary }]}>
      {/* ── Label + trend badge ── */}
      <View style={s.labelRow}>
        <Text style={s.label}>{monthName} spending</Text>
        {trendPct !== null && (
          <View
            style={[
              s.trendBadge,
              {
                backgroundColor: trendUp
                  ? "rgba(255,80,80,0.22)"
                  : "rgba(50,220,120,0.22)",
              },
            ]}
          >
            <Ionicons
              name={trendUp ? "arrow-up" : "arrow-down"}
              size={11}
              color={trendUp ? "#ff6b6b" : "#4cd97b"}
            />
            <Text
              style={[s.trendText, { color: trendUp ? "#ff6b6b" : "#4cd97b" }]}
            >
              {Math.abs(trendPct).toFixed(0)}% vs last month
            </Text>
          </View>
        )}
      </View>

      {/* ── Big amount ── */}
      <Text style={s.amount}>
        {hasData
          ? `${symbol}${thisMonthSpend.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
          : "No receipts yet"}
      </Text>

      {/* ── Stat pills ── */}
      {hasData && (
        <View style={s.pills}>
          <StatPill
            icon="receipt-outline"
            text={`${thisMonth.length} ${thisMonth.length === 1 ? "receipt" : "receipts"}`}
          />
          <StatPill
            icon="calculator-outline"
            text={`avg ${symbol}${avgPerReceipt.toFixed(2)}`}
          />
          {topStore && (
            <StatPill
              icon="storefront-outline"
              text={`Often at ${titleCase(topStore[0])}`}
            />
          )}
        </View>
      )}

      {/* ── Context line: no data nudge ── */}
      {!hasData && lastMonthSpend > 0 && (
        <Text style={s.nudge}>
          Last month you spent {symbol}
          {lastMonthSpend.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Text>
      )}
    </View>
  );
}

function StatPill({
  icon,
  text,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  text: string;
}) {
  return (
    <View style={s.pill}>
      <Ionicons name={icon} size={12} color="rgba(255,255,255,0.7)" />
      <Text style={s.pillText} numberOfLines={1}>
        {text}
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  card: { borderRadius: Radius.xl, padding: Spacing.lg, gap: 10 },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  label: {
    color: "rgba(255,255,255,0.8)",
    fontSize: Typography.size.sm,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  trendText: { fontSize: 11, fontWeight: "700" },
  amount: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "800",
    letterSpacing: -1.5,
    lineHeight: 40,
  },
  pills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 2,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255,255,255,0.12)",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: Radius.full,
  },
  pillText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: Typography.size.xs,
    fontWeight: "500",
  },
  nudge: {
    color: "rgba(255,255,255,0.6)",
    fontSize: Typography.size.xs,
    fontWeight: "500",
  },
});
