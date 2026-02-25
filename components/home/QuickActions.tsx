import {
  Colors,
  Radius,
  Spacing,
  ThemeDark,
  Typography,
} from "@/constants/Themes";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Action = {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBg: string;
  onPress?: () => void;
};

const ACTIONS: Action[] = [
  {
    id: "add",
    label: "Add Item",
    icon: "add-circle-outline",
    iconColor: ThemeDark.primary,
    iconBg: ThemeDark.primaryGlow,
  },
  {
    id: "scan",
    label: "Scan",
    icon: "scan-outline",
    iconColor: Colors.info,
    iconBg: Colors.infoLight + "22",
  },
  {
    id: "report",
    label: "Reports",
    icon: "bar-chart-outline",
    iconColor: Colors.warning,
    iconBg: Colors.warningLight + "22",
  },
  {
    id: "export",
    label: "Export",
    icon: "share-outline",
    iconColor: Colors.success,
    iconBg: Colors.successLight + "22",
  },
];

export default function QuickActions() {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.sectionLabel}>Quick Actions</Text>
      <View style={styles.grid}>
        {ACTIONS.map((action) => (
          <ActionButton key={action.id} action={action} />
        ))}
      </View>
    </View>
  );
}

function ActionButton({ action }: { action: Action }) {
  return (
    <Pressable
      onPress={action.onPress}
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
    >
      <View style={[styles.iconWrap, { backgroundColor: action.iconBg }]}>
        <Ionicons name={action.icon} size={22} color={action.iconColor} />
      </View>
      <Text style={styles.label}>{action.label}</Text>
    </Pressable>
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
  grid: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  button: {
    flex: 1,
    alignItems: "center",
    gap: Spacing.xs,
    paddingVertical: Spacing.sm + 4,
    backgroundColor: ThemeDark.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: ThemeDark.border,
  },
  buttonPressed: {
    opacity: 0.7,
    backgroundColor: ThemeDark.surfaceHover,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: Typography.size.xs,
    fontWeight: "600",
    color: ThemeDark.textMuted,
    letterSpacing: 0.2,
  },
});
