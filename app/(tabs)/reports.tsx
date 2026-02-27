import PlanCard from "@/components/plan/PlanCard";
import { LocalOrder } from "@/components/plan/types";
import { Radius, Spacing, Typography } from "@/constants/Themes";
import { useSession } from "@/hooks/useSession";
import { useTheme } from "@/hooks/useTheme";
import { fetchIncompleteOrders } from "@/lib/order.service";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PlanScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { session } = useSession();

  const [orders, setOrders] = useState<LocalOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (silent = false) => {
      if (!session?.access_token) return;
      if (!silent) setLoading(true);
      setError(null);
      try {
        const res = await fetchIncompleteOrders(session.access_token);
        if (res.status === "success") {
          setOrders(
            res.data.map((o) => ({
              ...o,
              localItems: o.order.map((i) => ({ ...i })),
            })),
          );
        }
      } catch (e: any) {
        setError(e.message ?? "Failed to load plans");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [session?.access_token],
  );

  useEffect(() => {
    load();
  }, [load]);

  const handleRefresh = () => {
    setRefreshing(true);
    load(true);
  };

  return (
    <View
      style={[
        styles.screen,
        { paddingTop: insets.top, backgroundColor: theme.background },
      ]}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          { borderBottomColor: theme.border, backgroundColor: theme.surface },
        ]}
      >
        <View>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Plan</Text>
          <Text style={[styles.headerSub, { color: theme.textMuted }]}>
            Your smart shopping missions
          </Text>
        </View>
        <Pressable
          onPress={() => load()}
          style={[
            styles.refreshBtn,
            {
              backgroundColor: theme.surfaceElevated ?? theme.surface,
              borderColor: theme.border,
            },
          ]}
        >
          <Ionicons name="refresh-outline" size={18} color={theme.textDim} />
        </Pressable>
      </View>

      {/* Body */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.textMuted }]}>
            Loading your market missions…
          </Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <View
            style={[
              styles.emptyIcon,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
          >
            <Ionicons
              name="cloud-offline-outline"
              size={36}
              color={theme.error}
            />
          </View>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>
            Couldn't load plans
          </Text>
          <Text style={[styles.emptySubtitle, { color: theme.textMuted }]}>
            {error}
          </Text>
          <Pressable
            onPress={() => load()}
            style={[styles.retryBtn, { backgroundColor: theme.primary }]}
          >
            <Text style={[styles.retryText, { color: theme.background }]}>
              Try again
            </Text>
          </Pressable>
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyBigEmoji}>🛒</Text>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>
            No missions yet
          </Text>
          <Text style={[styles.emptySubtitle, { color: theme.textMuted }]}>
            Your AI planner will generate a smart shopping list once it has
            enough inventory data.
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={theme.primary}
            />
          }
        >
          {/* Stats strip */}
          <View
            style={[
              styles.statsStrip,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
          >
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.primary }]}>
                {orders.length}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textMuted }]}>
                Open Runs
              </Text>
            </View>
            <View
              style={[styles.statDivider, { backgroundColor: theme.border }]}
            />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.text }]}>
                {orders.reduce((s, o) => s + o.localItems.length, 0)}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textMuted }]}>
                Total Items
              </Text>
            </View>
            <View
              style={[styles.statDivider, { backgroundColor: theme.border }]}
            />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: "#34D399" }]}>
                {orders.reduce(
                  (s, o) =>
                    s + o.localItems.filter((i) => i.have_ordered).length,
                  0,
                )}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textMuted }]}>
                Grabbed
              </Text>
            </View>
          </View>

          {/* Order cards */}
          {orders.map((order, idx) => (
            <PlanCard
              key={order.id}
              order={order}
              index={idx}
              onComplete={(id) =>
                setOrders((prev) => prev.filter((o) => o.id !== id))
              }
            />
          ))}

          <Text style={[styles.footer, { color: theme.textDim }]}>
            ✦ Generated by your AI Planner · Hold any item for its reasoning
          </Text>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },

  header: {
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: Typography.size.xl,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  headerSub: { fontSize: Typography.size.xs, marginTop: 1 },
  refreshBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing["4xl"],
    gap: Spacing.sm,
  },
  loadingText: { fontSize: Typography.size.sm, marginTop: Spacing.sm },
  emptyBigEmoji: { fontSize: 56 },
  emptyIcon: {
    width: 72,
    height: 72,
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
  retryBtn: {
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
  },
  retryText: { fontSize: Typography.size.sm, fontWeight: "600" },

  listContent: {
    padding: Spacing.screenPadding,
    gap: Spacing.lg,
    paddingBottom: 120,
  },

  statsStrip: {
    flexDirection: "row",
    borderRadius: Radius.lg,
    borderWidth: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: "center",
  },
  statItem: { flex: 1, alignItems: "center" },
  statNumber: { fontSize: Typography.size.xl, fontWeight: "800" },
  statLabel: { fontSize: Typography.size.xs, marginTop: 1 },
  statDivider: { width: 1, height: 28, marginHorizontal: Spacing.sm },

  footer: {
    fontSize: 11,
    textAlign: "center",
    marginTop: Spacing.sm,
  },
});
