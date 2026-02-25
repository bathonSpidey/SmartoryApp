import { Radius, SemanticTheme, Spacing, Typography } from "@/constants/Themes";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Receipt } from "../types";

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

function titleCase(s: string) {
  return s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

type Props = { receipts: Receipt[]; theme: SemanticTheme };

export function SpendHero({ receipts, theme }: Props) {
  const totalItems = receipts.reduce((s, r) => s + r.items.length, 0);
  const uniqueStores = new Set(receipts.map((r) => r.store_name.toLowerCase()))
    .size;

  const spendByCurrency: Record<string, number> = {};
  for (const r of receipts) {
    const cur = r.raw_response.currency ?? "USD";
    spendByCurrency[cur] = (spendByCurrency[cur] ?? 0) + r.total_amount;
  }
  const [[primaryCur, total]] = Object.entries(spendByCurrency).sort(
    (a, b) => b[1] - a[1],
  );
  const symbol = CURRENCY_SYMBOLS[primaryCur] ?? primaryCur + " ";

  const biggest = receipts.reduce(
    (mx, r) => (r.total_amount > mx.total_amount ? r : mx),
    receipts[0],
  );

  return (
    <View style={[s.card, { backgroundColor: theme.primary }]}>
      <Text style={s.label}>You've spent</Text>
      <Text style={s.amount}>
        {symbol}
        {total.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </Text>
      <View style={s.meta}>
        <MetaItem
          icon="storefront-outline"
          text={`${uniqueStores} ${uniqueStores === 1 ? "store" : "stores"}`}
        />
        <Dot />
        <MetaItem
          icon="cube-outline"
          text={`${totalItems} ${totalItems === 1 ? "item" : "items"}`}
        />
        {biggest && (
          <>
            <Dot />
            <MetaItem
              icon="trending-up-outline"
              text={`Most at ${titleCase(biggest.store_name)}`}
            />
          </>
        )}
      </View>
    </View>
  );
}

function MetaItem({
  icon,
  text,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  text: string;
}) {
  return (
    <View style={s.metaItem}>
      <Ionicons name={icon} size={13} color="rgba(255,255,255,0.75)" />
      <Text style={s.metaText} numberOfLines={1}>
        {text}
      </Text>
    </View>
  );
}

function Dot() {
  return <View style={s.dot} />;
}

const s = StyleSheet.create({
  card: { borderRadius: Radius.xl, padding: Spacing.lg, gap: 6 },
  label: {
    color: "rgba(255,255,255,0.8)",
    fontSize: Typography.size.sm,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  amount: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "800",
    letterSpacing: -1.5,
    lineHeight: 40,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
    flexWrap: "wrap",
  },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: {
    color: "rgba(255,255,255,0.75)",
    fontSize: Typography.size.xs,
    fontWeight: "500",
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "rgba(255,255,255,0.4)",
  },
});
