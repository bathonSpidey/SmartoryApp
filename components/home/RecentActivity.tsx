import { Colors, Radius, Spacing, Typography } from "@/constants/Themes";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type ActivityItem = {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBg: string;
};

export default function RecentActivity() {
  const theme = useTheme();

  const PLACEHOLDER_ITEMS: ActivityItem[] = [
    {
      id: "1",
      title: "Inventory Updated",
      subtitle: "Connect your data source to see activity",
      time: "—",
      icon: "cube-outline",
      iconColor: theme.primary,
      iconBg: theme.primaryGlow,
    },
    {
      id: "2",
      title: "Low Stock Alert",
      subtitle: "Alerts will appear here once connected",
      time: "—",
      icon: "warning-outline",
      iconColor: Colors.warning,
      iconBg: Colors.warningLight + "22",
    },
    {
      id: "3",
      title: "New Category Added",
      subtitle: "Category changes will show here",
      time: "—",
      icon: "folder-outline",
      iconColor: Colors.info,
      iconBg: Colors.infoLight + "22",
    },
  ];

  return (
    <View style={styles.wrapper}>
      <View style={styles.headerRow}>
        <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>
          Recent Activity
        </Text>
        <Text style={[styles.seeAll, { color: theme.primary }]}>See all</Text>
      </View>
      <View
        style={[
          styles.list,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
      >
        {PLACEHOLDER_ITEMS.map((item, index) => (
          <ActivityRow
            key={item.id}
            item={item}
            isLast={index === PLACEHOLDER_ITEMS.length - 1}
          />
        ))}
      </View>
    </View>
  );
}

function ActivityRow({
  item,
  isLast,
}: {
  item: ActivityItem;
  isLast: boolean;
}) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.row,
        !isLast && { borderBottomWidth: 1, borderBottomColor: theme.border },
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: item.iconBg }]}>
        <Ionicons name={item.icon} size={18} color={item.iconColor} />
      </View>
      <View style={styles.textGroup}>
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text
          style={[styles.subtitle, { color: theme.textMuted }]}
          numberOfLines={1}
        >
          {item.subtitle}
        </Text>
      </View>
      <Text style={[styles.time, { color: theme.textDim }]}>{item.time}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  sectionLabel: {
    fontSize: Typography.size.xs,
    fontWeight: "600",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  seeAll: { fontSize: Typography.size.sm, fontWeight: "600" },
  list: { borderRadius: Radius.lg, borderWidth: 1, overflow: "hidden" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    gap: Spacing.sm,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  textGroup: { flex: 1, gap: 2 },
  title: { fontSize: Typography.size.sm, fontWeight: "600" },
  subtitle: { fontSize: Typography.size.xs },
  time: { fontSize: 11, fontWeight: "500" },
});
