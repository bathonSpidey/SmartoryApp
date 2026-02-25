import { Colors, Radius, Spacing, Typography } from "@/constants/Themes";
import { useTheme } from "@/hooks/useTheme";
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

export default function QuickActions() {
  const theme = useTheme();

  const ACTIONS: Action[] = [
    {
      id: "add",
      label: "Add Item",
      icon: "add-circle-outline",
      iconColor: theme.primary,
      iconBg: theme.primaryGlow,
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

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>
        Quick Actions
      </Text>
      <View style={styles.grid}>
        {ACTIONS.map((action) => (
          <ActionButton key={action.id} action={action} />
        ))}
      </View>
    </View>
  );
}

function ActionButton({ action }: { action: Action }) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={action.onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: theme.surface, borderColor: theme.border },
        pressed && { opacity: 0.7, backgroundColor: theme.surfaceHover },
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: action.iconBg }]}>
        <Ionicons name={action.icon} size={22} color={action.iconColor} />
      </View>
      <Text style={[styles.label, { color: theme.textMuted }]}>
        {action.label}
      </Text>
    </Pressable>
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
  grid: { flexDirection: "row", gap: Spacing.sm },
  button: {
    flex: 1,
    alignItems: "center",
    gap: Spacing.xs,
    paddingVertical: Spacing.sm + 4,
    borderRadius: Radius.lg,
    borderWidth: 1,
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
    letterSpacing: 0.2,
  },
});
