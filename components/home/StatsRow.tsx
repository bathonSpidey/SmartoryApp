import {
  Colors,
  Radius,
  Shadow,
  Spacing,
  ThemeDark,
  Typography,
} from "@/constants/Themes";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Stat = {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBg: string;
  trend?: string;
  trendUp?: boolean;
};

const STATS: Stat[] = [
  {
    label: "Total Items",
    value: "—",
    icon: "cube-outline",
    iconColor: ThemeDark.primary,
    iconBg: ThemeDark.primaryGlow,
  },
  {
    label: "Low Stock",
    value: "—",
    icon: "warning-outline",
    iconColor: Colors.warning,
    iconBg: Colors.warningLight + "22",
  },
  {
    label: "Categories",
    value: "—",
    icon: "grid-outline",
    iconColor: Colors.info,
    iconBg: Colors.infoLight + "22",
  },
];

export default function StatsRow() {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.sectionLabel}>Overview</Text>
      <View style={styles.row}>
        {STATS.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </View>
    </View>
  );
}

function StatCard({ stat }: { stat: Stat }) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconWrap, { backgroundColor: stat.iconBg }]}>
        <Ionicons name={stat.icon} size={18} color={stat.iconColor} />
      </View>
      <Text style={styles.value}>{stat.value}</Text>
      <Text style={styles.label}>{stat.label}</Text>
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
  wrapper: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.lg,
  },
  sectionLabel: {
    fontSize: Typography.size.xs,
    fontWeight: "600",
    color: ThemeDark.textMuted,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: Spacing.sm,
  },
  row: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  card: {
    flex: 1,
    backgroundColor: ThemeDark.surface,
    borderRadius: Radius.lg,
    padding: Spacing.sm + 4,
    borderWidth: 1,
    borderColor: ThemeDark.border,
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
    color: ThemeDark.text,
    letterSpacing: -0.5,
  },
  label: {
    fontSize: 10,
    fontWeight: "500",
    color: ThemeDark.textMuted,
    letterSpacing: 0.2,
  },
  trendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginTop: 2,
  },
  trend: {
    fontSize: 10,
    fontWeight: "600",
  },
});
