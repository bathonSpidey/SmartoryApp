import {
  Colors,
  Radius,
  Shadow,
  Spacing,
  Typography,
} from "@/constants/Themes";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Stat = {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColorKey: "primary" | "warning" | "info";
  iconBgKey: "primaryGlow" | "warningBg" | "infoBg";
  trend?: string;
  trendUp?: boolean;
};

const STATS: Stat[] = [
  {
    label: "Total Items",
    value: "—",
    icon: "cube-outline",
    iconColorKey: "primary",
    iconBgKey: "primaryGlow",
  },
  {
    label: "Low Stock",
    value: "—",
    icon: "warning-outline",
    iconColorKey: "warning",
    iconBgKey: "warningBg",
  },
  {
    label: "Categories",
    value: "—",
    icon: "grid-outline",
    iconColorKey: "info",
    iconBgKey: "infoBg",
  },
];

export default function StatsRow() {
  const theme = useTheme();
  return (
    <View style={styles.wrapper}>
      <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>
        Overview
      </Text>
      <View style={styles.row}>
        {STATS.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </View>
    </View>
  );
}

function StatCard({ stat }: { stat: Stat }) {
  const theme = useTheme();
  const iconColor = theme[stat.iconColorKey];
  const iconBg = theme[stat.iconBgKey];
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.surface, borderColor: theme.border },
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
        <Ionicons name={stat.icon} size={18} color={iconColor} />
      </View>
      <Text style={[styles.value, { color: theme.text }]}>{stat.value}</Text>
      <Text style={[styles.label, { color: theme.textMuted }]}>
        {stat.label}
      </Text>
      {stat.trend && (
        <View style={styles.trendRow}>
          <Ionicons
            name={stat.trendUp ? "trending-up" : "trending-down"}
            size={12}
            color={stat.trendUp ? Colors.success : Colors.error}
          />
          <Text
            style={[
              styles.trend,
              { color: stat.trendUp ? Colors.success : Colors.error },
            ]}
          >
            {stat.trend}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { paddingHorizontal: Spacing.screenPadding, paddingTop: Spacing.lg },
  sectionLabel: {
    fontSize: Typography.size.xs,
    fontWeight: "600",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: Spacing.sm,
  },
  row: { flexDirection: "row", gap: Spacing.sm },
  card: {
    flex: 1,
    borderRadius: Radius.lg,
    padding: Spacing.sm + 4,
    borderWidth: 1,
    gap: 2,
    ...Shadow.xs,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  value: {
    fontSize: Typography.size.xl,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  label: { fontSize: 10, fontWeight: "500", letterSpacing: 0.2 },
  trendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginTop: 2,
  },
  trend: { fontSize: 10, fontWeight: "600" },
});
