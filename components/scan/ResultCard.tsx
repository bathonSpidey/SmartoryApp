import { Radius, Spacing, Typography } from "@/constants/Themes";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { formatCurrency } from "./helpers";
import { FileEntry } from "./types";

type Props = {
  entry: FileEntry;
  theme: ReturnType<typeof useTheme>;
};

export function ResultCard({ entry, theme }: Props) {
  const [expanded, setExpanded] = useState(true);

  if (entry.status === "error") {
    return (
      <View
        style={[
          styles.resultCard,
          { backgroundColor: theme.errorBg, borderColor: theme.error },
        ]}
      >
        <View style={styles.resultCardHeader}>
          <Ionicons name="alert-circle" size={18} color={theme.error} />
          <Text style={[styles.resultCardTitle, { color: theme.error }]}>
            {entry.file.name}
          </Text>
        </View>
        <Text style={[styles.resultError, { color: theme.error }]}>
          {entry.error}
        </Text>
      </View>
    );
  }

  if (entry.status !== "done" || !entry.result) return null;

  const { result } = entry;

  return (
    <View
      style={[
        styles.resultCard,
        { backgroundColor: theme.surface, borderColor: theme.border },
      ]}
    >
      <Pressable
        style={styles.resultCardHeader}
        onPress={() => setExpanded((v) => !v)}
      >
        <View style={styles.resultCardMeta}>
          <Ionicons name="receipt-outline" size={18} color={theme.primary} />
          <Text
            style={[styles.resultCardTitle, { color: theme.text }]}
            numberOfLines={1}
          >
            {result.store_name}
          </Text>
          <Text style={[styles.resultCardDate, { color: theme.textMuted }]}>
            {result.date}
          </Text>
        </View>
        <View style={styles.resultCardRight}>
          <Text style={[styles.resultCardTotal, { color: theme.primary }]}>
            {formatCurrency(result.total_amount, result.currency)}
          </Text>
          <Ionicons
            name={expanded ? "chevron-up" : "chevron-down"}
            size={16}
            color={theme.textMuted}
          />
        </View>
      </Pressable>

      {expanded && (
        <View style={styles.itemsList}>
          <View
            style={[styles.itemsHeader, { borderBottomColor: theme.border }]}
          >
            <Text style={[styles.itemsColLabel, { color: theme.textMuted }]}>
              Item
            </Text>
            <Text style={[styles.itemsColLabel, { color: theme.textMuted }]}>
              Qty
            </Text>
            <Text
              style={[
                styles.itemsColLabel,
                styles.colRight,
                { color: theme.textMuted },
              ]}
            >
              Price
            </Text>
          </View>

          {result.items.map((item, i) => (
            <View
              key={i}
              style={[
                styles.itemRow,
                i < result.items.length - 1 && {
                  borderBottomColor: theme.border,
                  borderBottomWidth: StyleSheet.hairlineWidth,
                },
              ]}
            >
              <View style={styles.itemNameCol}>
                <Text
                  style={[styles.itemName, { color: theme.text }]}
                  numberOfLines={1}
                >
                  {item.name}
                </Text>
                <Text style={[styles.itemCategory, { color: theme.textMuted }]}>
                  {item.category}
                </Text>
              </View>
              <Text style={[styles.itemQty, { color: theme.textMuted }]}>
                {item.quantity} {item.unit}
              </Text>
              <Text style={[styles.itemPrice, { color: theme.text }]}>
                {item.price.toFixed(2)}
              </Text>
            </View>
          ))}

          <View style={[styles.totalRow, { borderTopColor: theme.border }]}>
            <Text style={[styles.totalLabel, { color: theme.textMuted }]}>
              Total
            </Text>
            <Text style={[styles.totalValue, { color: theme.primary }]}>
              {formatCurrency(result.total_amount, result.currency)}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  resultCard: { borderRadius: Radius.md, borderWidth: 1, overflow: "hidden" },
  resultCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  resultCardMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    flex: 1,
    overflow: "hidden",
  },
  resultCardTitle: { fontSize: Typography.size.base, fontWeight: "700" },
  resultCardDate: { fontSize: Typography.size.xs },
  resultCardRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    flexShrink: 0,
  },
  resultCardTotal: { fontSize: Typography.size.base, fontWeight: "700" },
  resultError: {
    fontSize: Typography.size.sm,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  itemsList: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.md },
  itemsHeader: {
    flexDirection: "row",
    paddingBottom: Spacing.xs,
    borderBottomWidth: 1,
    marginBottom: Spacing.xs,
  },
  itemsColLabel: {
    flex: 1,
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  colRight: { flex: 0, width: 60, textAlign: "right" },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    gap: Spacing.sm,
  },
  itemNameCol: { flex: 1 },
  itemName: { fontSize: Typography.size.sm },
  itemCategory: { fontSize: 10, marginTop: 1 },
  itemQty: { fontSize: Typography.size.sm, width: 56, textAlign: "center" },
  itemPrice: {
    fontSize: Typography.size.sm,
    fontWeight: "600",
    width: 60,
    textAlign: "right",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
  },
  totalLabel: { fontSize: Typography.size.sm, fontWeight: "600" },
  totalValue: { fontSize: Typography.size.base, fontWeight: "700" },
});
