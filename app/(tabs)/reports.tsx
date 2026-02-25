import { Radius, Spacing, ThemeDark, Typography } from "@/constants/Themes";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ReportsScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Reports</Text>
      </View>
      <View style={styles.empty}>
        <View style={styles.emptyIcon}>
          <Ionicons
            name="bar-chart-outline"
            size={40}
            color={ThemeDark.textDim}
          />
        </View>
        <Text style={styles.emptyTitle}>No reports yet</Text>
        <Text style={styles.emptySubtitle}>
          Analytics and reports will appear here once you have inventory data.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: ThemeDark.background,
  },
  header: {
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: ThemeDark.border,
    backgroundColor: ThemeDark.surface,
  },
  title: {
    fontSize: Typography.size.xl,
    fontWeight: "700",
    color: ThemeDark.text,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing["4xl"],
    gap: Spacing.sm,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: Radius.xl,
    backgroundColor: ThemeDark.surface,
    borderWidth: 1,
    borderColor: ThemeDark.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  emptyTitle: {
    fontSize: Typography.size.md,
    fontWeight: "700",
    color: ThemeDark.text,
  },
  emptySubtitle: {
    fontSize: Typography.size.sm,
    color: ThemeDark.textMuted,
    textAlign: "center",
    lineHeight: 20,
  },
});
