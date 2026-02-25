// ─────────────────────────────────────────────
//  InventoryStates — Skeleton / Error / Empty
//  Modular state views used by InventoryScreen.
// ─────────────────────────────────────────────

import { Radius, SemanticTheme, Spacing, Typography } from "@/constants/Themes";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

// ── Skeleton ──────────────────────────────────

export function SkeletonCard({ theme }: { theme: SemanticTheme }) {
  return (
    <View
      style={[
        s.card,
        { backgroundColor: theme.surface, borderColor: theme.border },
      ]}
    >
      <View style={[s.accent, { backgroundColor: theme.border }]} />
      <View style={s.body}>
        <View style={[s.avatar, { backgroundColor: theme.surfaceElevated }]} />
        <View style={s.lines}>
          <View
            style={[
              s.line,
              { backgroundColor: theme.surfaceElevated, width: "55%" },
            ]}
          />
          <View
            style={[
              s.line,
              {
                backgroundColor: theme.surfaceElevated,
                width: "35%",
                height: 10,
                marginTop: 2,
              },
            ]}
          />
        </View>
        <View style={[s.amount, { backgroundColor: theme.surfaceElevated }]} />
      </View>
    </View>
  );
}

// ── Error ─────────────────────────────────────

type ErrorViewProps = {
  message: string;
  onRetry: () => void;
  theme: SemanticTheme;
};

export function ErrorView({ message, onRetry, theme }: ErrorViewProps) {
  return (
    <View style={s.centered}>
      <View
        style={[
          s.icon,
          { backgroundColor: theme.errorBg, borderColor: theme.error + "33" },
        ]}
      >
        <Ionicons name="cloud-offline-outline" size={36} color={theme.error} />
      </View>
      <Text style={[s.title, { color: theme.text }]}>
        Couldn't load receipts
      </Text>
      <Text style={[s.subtitle, { color: theme.textMuted }]}>{message}</Text>
      <Pressable
        style={[s.retry, { backgroundColor: theme.primary }]}
        onPress={onRetry}
      >
        <Ionicons name="refresh-outline" size={15} color={theme.textInverse} />
        <Text style={[s.retryText, { color: theme.textInverse }]}>
          Try again
        </Text>
      </Pressable>
    </View>
  );
}

// ── Empty ─────────────────────────────────────

export function EmptyView({ theme }: { theme: SemanticTheme }) {
  return (
    <View style={s.centered}>
      <View
        style={[
          s.icon,
          {
            backgroundColor: theme.primaryDeep,
            borderColor: theme.primary + "33",
          },
        ]}
      >
        <Ionicons name="receipt-outline" size={36} color={theme.primary} />
      </View>
      <Text style={[s.title, { color: theme.text }]}>No receipts yet</Text>
      <Text style={[s.subtitle, { color: theme.textMuted }]}>
        Scan your first receipt to see your inventory here.
      </Text>
    </View>
  );
}

// ── Namespace export — use as InventoryStates.Skeleton etc. ──

export const InventoryStates = {
  Skeleton: SkeletonCard,
  Error: ErrorView,
  Empty: EmptyView,
};

const s = StyleSheet.create({
  // skeleton
  card: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
    overflow: "hidden",
  },
  accent: { height: 4 },
  body: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  avatar: { width: 44, height: 44, borderRadius: Radius.full },
  lines: { flex: 1, gap: 6 },
  line: { height: 13, borderRadius: Radius.sm },
  amount: { width: 60, height: 22, borderRadius: Radius.sm },
  // shared states
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing["4xl"],
    gap: Spacing.sm,
  },
  icon: {
    width: 80,
    height: 80,
    borderRadius: Radius.xl,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: Typography.size.md,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    fontSize: Typography.size.sm,
    textAlign: "center",
    lineHeight: 20,
  },
  // error retry
  retry: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    marginTop: Spacing.sm,
  },
  retryText: { fontSize: Typography.size.sm, fontWeight: "700" },
});
