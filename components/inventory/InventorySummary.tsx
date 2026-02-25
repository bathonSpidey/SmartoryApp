// ─────────────────────────────────────────────
//  InventorySummary — Stats strip above the list
//  Shows total receipts, items, and spend lines.
//  Modular: pass receipts array + theme, done.
// ─────────────────────────────────────────────

import { Radius, SemanticTheme, Spacing, Typography } from "@/constants/Themes";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { getCategoryColor } from "./categoryColors";
import { Receipt } from "./types";

type Props = {
  receipts: Receipt[];
  theme: SemanticTheme;
};

type StatCardProps = {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  iconColor: string;
  label: string;
  value: string;
  theme: SemanticTheme;
};

function StatCard({ icon, iconColor, label, value, theme }: StatCardProps) {
  return (
    <View
      style={[
        styles.statCard,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          ...theme.shadowCard,
        },
      ]}
    >
      <View style={[styles.statIconBox, { backgroundColor: iconColor + "1a" }]}>
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>
      <Text style={[styles.statValue, { color: theme.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: theme.textMuted }]}>
        {label}
      </Text>
    </View>
  );
}

export function InventorySummary({ receipts, theme }: Props) {
  const totalItems = receipts.reduce((s, r) => s + r.items.length, 0);

  // Group totals by currency
  const spendByCurrency: Record<string, number> = {};
  for (const r of receipts) {
    const cur = r.raw_response.currency ?? "USD";
    spendByCurrency[cur] = (spendByCurrency[cur] ?? 0) + r.total_amount;
  }
  const spendLines = Object.entries(spendByCurrency).map(
    ([cur, total]) => `${CURRENCY_SYMBOLS[cur] ?? cur}${total.toFixed(2)}`,
  );
  const spendDisplay = spendLines.join(" + ") || "—";

  // Top category by item count
  const catCounts: Record<string, number> = {};
  for (const r of receipts) {
    for (const item of r.items) {
      catCounts[item.category] =
        (catCounts[item.category] ?? 0) + item.quantity;
    }
  }
  const sortedCats = Object.entries(catCounts).sort((a, b) => b[1] - a[1]);
  const topCat = sortedCats[0]?.[0] ?? null;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <StatCard
          icon="receipt-outline"
          iconColor={theme.primary}
          label="Receipts"
          value={String(receipts.length)}
          theme={theme}
        />
        <StatCard
          icon="cube-outline"
          iconColor="#7c3aed"
          label="Items"
          value={String(totalItems)}
          theme={theme}
        />
        <StatCard
          icon="wallet-outline"
          iconColor="#d97706"
          label="Spent"
          value={spendDisplay}
          theme={theme}
        />
      </View>

      {/* Top category bar */}
      {sortedCats.length > 0 && (
        <View
          style={[
            styles.catBar,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          <Text style={[styles.catBarLabel, { color: theme.textMuted }]}>
            Top categories
          </Text>
          <View style={styles.catBarChips}>
            {sortedCats.slice(0, 5).map(([cat, count]) => {
              const color = getCategoryColor(cat);
              return (
                <View
                  key={cat}
                  style={[
                    styles.catChip,
                    {
                      backgroundColor: color + "18",
                      borderColor: color + "33",
                    },
                  ]}
                >
                  <View style={[styles.catDot, { backgroundColor: color }]} />
                  <Text style={[styles.catChipName, { color }]}>{cat}</Text>
                  <Text style={[styles.catChipCount, { color: theme.textDim }]}>
                    {count}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  CAD: "C$",
  AUD: "A$",
  INR: "₹",
};

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    alignItems: "flex-start",
    gap: 4,
  },
  statIconBox: {
    width: 34,
    height: 34,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  statValue: {
    fontSize: Typography.size.lg,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: Typography.size.xs,
    fontWeight: "500",
    letterSpacing: 0.2,
  },

  // ── Category bar ──
  catBar: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  catBarLabel: {
    fontSize: Typography.size.xs,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  catBarChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  catChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  catDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  catChipName: {
    fontSize: Typography.size.xs,
    fontWeight: "600",
  },
  catChipCount: {
    fontSize: 10,
    fontWeight: "700",
  },
});
