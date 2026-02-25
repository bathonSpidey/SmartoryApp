import {
  Colors,
  Radius,
  Spacing,
  ThemeDark,
  Typography,
} from "@/constants/Themes";
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

const PLACEHOLDER_ITEMS: ActivityItem[] = [
  {
    id: "1",
    title: "Inventory Updated",
    subtitle: "Connect your data source to see activity",
    time: "—",
    icon: "cube-outline",
    iconColor: ThemeDark.primary,
    iconBg: ThemeDark.primaryGlow,
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

export default function RecentActivity() {
  return (
    <View style={styles.wrapper}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionLabel}>Recent Activity</Text>
        <Text style={styles.seeAll}>See all</Text>
      </View>
      <View style={styles.list}>
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
  return (
    <View style={[styles.row, !isLast && styles.rowBorder]}>
      <View style={[styles.iconWrap, { backgroundColor: item.iconBg }]}>
        <Ionicons name={item.icon} size={18} color={item.iconColor} />
      </View>
      <View style={styles.textGroup}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {item.subtitle}
        </Text>
      </View>
      <Text style={styles.time}>{item.time}</Text>
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
    color: ThemeDark.textMuted,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  seeAll: {
    fontSize: Typography.size.sm,
    fontWeight: "600",
    color: ThemeDark.primary,
  },
  list: {
    backgroundColor: ThemeDark.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: ThemeDark.border,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    gap: Spacing.sm,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: ThemeDark.border,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  textGroup: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: Typography.size.sm,
    fontWeight: "600",
    color: ThemeDark.text,
  },
  subtitle: {
    fontSize: Typography.size.xs,
    color: ThemeDark.textMuted,
  },
  time: {
    fontSize: 11,
    color: ThemeDark.textDim,
    fontWeight: "500",
  },
});
