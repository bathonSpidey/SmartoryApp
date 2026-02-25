// ─────────────────────────────────────────────
//  CategoryChip — Pill badge for item categories
//  Tinted with the category's accent colour.
// ─────────────────────────────────────────────

import { Radius, Typography } from "@/constants/Themes";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { getCategoryColor } from "./categoryColors";

type Props = {
  category: string;
  /** Compact = tiny pill, default = normal pill */
  size?: "sm" | "md";
};

export function CategoryChip({ category, size = "md" }: Props) {
  const color = getCategoryColor(category);

  return (
    <View
      style={[
        styles.chip,
        size === "sm" && styles.chipSm,
        {
          backgroundColor: color + "1a",
          borderColor: color + "44",
        },
      ]}
    >
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text
        style={[styles.label, size === "sm" && styles.labelSm, { color }]}
        numberOfLines={1}
      >
        {category}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  chipSm: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    gap: 3,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontSize: Typography.size.sm,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  labelSm: {
    fontSize: 10,
  },
});
