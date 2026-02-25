import { Radius, Spacing, Typography } from "@/constants/Themes";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function InventoryScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  return (
    <View
      style={[
        styles.screen,
        { paddingTop: insets.top, backgroundColor: theme.background },
      ]}
    >
      <View
        style={[
          styles.header,
          { borderBottomColor: theme.border, backgroundColor: theme.surface },
        ]}
      >
        <Text style={[styles.title, { color: theme.text }]}>Inventory</Text>
      </View>
      <View style={styles.empty}>
        <View
          style={[
            styles.emptyIcon,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          <Ionicons name="cube-outline" size={40} color={theme.textDim} />
        </View>
        <Text style={[styles.emptyTitle, { color: theme.text }]}>
          No items yet
        </Text>
        <Text style={[styles.emptySubtitle, { color: theme.textMuted }]}>
          Your inventory will appear here once you start adding items.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  title: { fontSize: Typography.size.xl, fontWeight: "700" },
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
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  emptyTitle: { fontSize: Typography.size.md, fontWeight: "700" },
  emptySubtitle: {
    fontSize: Typography.size.sm,
    textAlign: "center",
    lineHeight: 20,
  },
});
