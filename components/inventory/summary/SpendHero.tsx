import { Radius, SemanticTheme, Spacing, Typography } from "@/constants/Themes";
import { CURRENCY_SYMBOLS, CurrencyCode } from "@/constants/currencies";
import { convertAmount, ExchangeRates } from "@/lib/currency.service";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Receipt } from "../types";

function titleCase(s: string) {
  return s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
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
  const totalItems = receipts.reduce((s, r) => s + r.items.length, 0);
  const uniqueStores = new Set(receipts.map((r) => r.store_name.toLowerCase()))
    .size;

  // Sum all receipts converted to the preferred currency
  const totalConverted = receipts.reduce((sum, r) => {
    const from = r.raw_response.currency ?? "USD";
    return sum + convertAmount(r.total_amount, from, preferredCurrency, rates);
  }, 0);

  const symbol = CURRENCY_SYMBOLS[preferredCurrency] ?? preferredCurrency + " ";

  const biggest = receipts.reduce(
    (mx, r) => (r.total_amount > mx.total_amount ? r : mx),
    receipts[0],
  );

  return (
    <View style={[s.card, { backgroundColor: theme.primary }]}>
      <Text style={s.label}>You've spent</Text>
      <Text style={s.amount}>
        {symbol}
        {totalConverted.toLocaleString("en-US", {
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
