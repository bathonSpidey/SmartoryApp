// ─────────────────────────────────────────────
//  InventoryStates — Skeleton / Error / Empty
//  Modular state views used by InventoryScreen.
// ─────────────────────────────────────────────

import { SemanticTheme } from "@/constants/Themes";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { s } from "./styles/InventoryStates.styles";

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
