// ─────────────────────────────────────────────
//  ItemBubble — Individual item card in a receipt
//  Left accent stripe colour = category colour.
//  Used inside the expanded ReceiptCard.
// ─────────────────────────────────────────────

import { SemanticTheme } from "@/constants/Themes";
import React from "react";
import { Text, View } from "react-native";
import { styles } from "./styles/ItemBubble.styles";
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

import { CURRENCY_SYMBOLS } from "@/constants/currencies";
