// ─────────────────────────────────────────────
//  ItemBubble — Individual item card in a receipt
//  Left accent stripe colour = category colour.
//  Used inside the expanded ReceiptCard.
// ─────────────────────────────────────────────

import { Radius, SemanticTheme, Spacing, Typography } from "@/constants/Themes";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { getCategoryColor } from "./categoryColors";
import { ReceiptItem } from "./types";

type Props = {
  item: ReceiptItem;
  currency: string;
  theme: SemanticTheme;
};

export function ItemBubble({ item, currency, theme }: Props) {
  const accent = getCategoryColor(item.category);
  const symbol = CURRENCY_SYMBOLS[currency] ?? currency;

  return (
    <View
      style={[
        styles.bubble,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
        },
      ]}
    >
      {/* Left accent stripe */}
      <View style={[styles.stripe, { backgroundColor: accent }]} />

      <View style={styles.body}>
        {/* Item name */}
        <Text style={[styles.name, { color: theme.text }]} numberOfLines={2}>
          {titleCase(item.name)}
        </Text>

        {/* Category */}
        <Text style={[styles.category, { color: accent }]} numberOfLines={1}>
          {item.category}
        </Text>
      </View>

      {/* Right: price + qty */}
      <View style={styles.right}>
        <Text style={[styles.price, { color: theme.text }]}>
          {symbol}
          {item.price.toFixed(2)}
        </Text>
        {item.quantity > 1 && (
          <Text style={[styles.qty, { color: theme.textMuted }]}>
            ×{item.quantity}
          </Text>
        )}
        <Text style={[styles.unit, { color: theme.textDim }]}>
          /{item.unit}
        </Text>
      </View>
    </View>
  );
}

// ── helpers ──────────────────────────────────

function titleCase(str: string) {
  return str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  CAD: "C$",
  AUD: "A$",
  CHF: "Fr",
  INR: "₹",
  CNY: "¥",
};

const styles = StyleSheet.create({
  bubble: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: Radius.md,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: Spacing.xs,
  },
  stripe: {
    width: 4,
    alignSelf: "stretch",
  },
  body: {
    flex: 1,
    paddingVertical: 8,
    paddingLeft: 10,
    paddingRight: 4,
    gap: 2,
  },
  name: {
    fontSize: Typography.size.sm,
    fontWeight: "600",
    lineHeight: 16,
  },
  category: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  right: {
    paddingRight: 12,
    paddingVertical: 8,
    alignItems: "flex-end",
    gap: 1,
  },
  price: {
    fontSize: Typography.size.sm,
    fontWeight: "700",
  },
  qty: {
    fontSize: 11,
    fontWeight: "500",
  },
  unit: {
    fontSize: 10,
  },
});
