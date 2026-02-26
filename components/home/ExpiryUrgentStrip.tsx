// ─────────────────────────────────────────────
//  ExpiryUrgentStrip
//  Horizontal scrollable row of color-coded chips
//  for items expiring within 2 days.
//  Red = expired/today, Orange = tomorrow, Yellow = 2 days
// ─────────────────────────────────────────────

import { Radius, Spacing, Typography } from "@/constants/Themes";
import { useTheme } from "@/hooks/useTheme";
import { daysUntil, ItemDetail } from "@/lib/analysis.service";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  urgentItems: ItemDetail[];
};

type ChipColor = {
  bg: string;
  text: string;
  border: string;
};

function getChipColors(days: number): ChipColor {
  if (days <= 0) {
    return { bg: "#fef2f2", text: "#991b1b", border: "#fca5a5" }; // red — expired
  }
  if (days === 1) {
    return { bg: "#fff7ed", text: "#9a3412", border: "#fdba74" }; // orange — tomorrow
  }
  return { bg: "#fefce8", text: "#854d0e", border: "#fde047" }; // yellow — 2 days
}

function urgencyLabel(days: number): string {
  if (days <= 0) return "Expired";
  if (days === 1) return "Tomorrow";
  return "2 days";
}

export default function ExpiryUrgentStrip({ urgentItems }: Props) {
  const theme = useTheme();

  if (!urgentItems.length) return null;

  return (
    <View style={styles.wrapper}>
      <View style={styles.headerRow}>
        <Text style={[styles.label, { color: theme.error }]}>
          ⚠ Expiring Soon
        </Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {urgentItems.map((item) => {
          const days = daysUntil(item.item_context.estimated_expiration);
          const colors = getChipColors(days);

          return (
            <TouchableOpacity
              key={item.item_context.item_name}
              activeOpacity={0.75}
              style={[
                styles.chip,
                {
                  backgroundColor: colors.bg,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text style={[styles.chipName, { color: colors.text }]}>
                {item.item_context.item_name}
              </Text>
              <View
                style={[
                  styles.urgencyBadge,
                  { backgroundColor: colors.border },
                ]}
              >
                <Text style={[styles.urgencyText, { color: colors.text }]}>
                  {urgencyLabel(days)}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: Spacing.md,
  },
  headerRow: {
    paddingHorizontal: Spacing.screenPadding,
    marginBottom: Spacing.sm,
  },
  label: {
    fontSize: Typography.size.xs,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  scrollContent: {
    paddingHorizontal: Spacing.screenPadding,
    gap: Spacing.sm,
    paddingBottom: 2,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  chipName: {
    fontSize: Typography.size.sm,
    fontWeight: "600",
  },
  urgencyBadge: {
    borderRadius: Radius.full,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  urgencyText: {
    fontSize: 10,
    fontWeight: "700",
  },
});
