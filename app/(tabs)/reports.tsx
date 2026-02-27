import { Radius, Spacing, Typography } from "@/constants/Themes";
import { useSession } from "@/hooks/useSession";
import { useTheme } from "@/hooks/useTheme";
import { fetchIncompleteOrders, Order, OrderItem } from "@/lib/order.service";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ─── Emoji mapping ────────────────────────────

const ITEM_EMOJIS: [string[], string][] = [
  [["milk", "milch", "weidemilch", "dairy", "cream", "yogurt"], "🥛"],
  [["chicken", "hähnchen", "brustfilet", "poultry"], "🍗"],
  [["tomato", "tomaten", "cherrytomaten"], "🍅"],
  [["coconut", "kokos", "kokosmilch"], "🥥"],
  [["wrap", "wraps", "tortilla", "bread", "brot"], "🌯"],
  [["cucumber", "gurken", "gherkin"], "🥒"],
  [["herb", "coriander", "koriander", "basil", "parsley"], "🌿"],
  [["salad", "blattsalat", "lettuce", "leafy"], "🥗"],
  [["shrimp", "prawn", "prawns", "seafood", "fish"], "🦐"],
  [["gyoza", "dumpling", "dumplings", "dim sum"], "🥟"],
  [["beef", "steak", "rind", "mince"], "🥩"],
  [["egg", "eier", "ei"], "🥚"],
  [["pasta", "noodle", "nudel", "spaghetti"], "🍝"],
  [["rice", "reis"], "🍚"],
  [["juice", "saft", "drink"], "🧃"],
  [["cheese", "käse", "mozzarella"], "🧀"],
  [["butter", "margarine"], "🧈"],
  [["apple", "apfel", "fruit"], "🍎"],
  [["banana", "banane"], "🍌"],
  [["berry", "beere", "strawberry", "erdbeer"], "🍓"],
  [["oil", "öl", "olive"], "🫒"],
  [["onion", "zwiebel", "garlic", "knoblauch"], "🧅"],
  [["pepper", "paprika", "chilli"], "🫑"],
  [["sauce", "ketchup", "mustard", "mayo"], "🥫"],
  [["snack", "chips", "crisp", "cracker"], "🍿"],
  [["chocolate", "schokolade", "sweet", "candy"], "🍫"],
  [["tofu", "soy", "tempeh"], "🫘"],
  [["asia", "asian", "k-asia", "sushi", "thai"], "🍱"],
  [["protein", "fitness", "gym", "sport"], "💪"],
  [["king", "premium", "special"], "👑"],
];

function getItemEmoji(itemName: string): string {
  const lower = itemName.toLowerCase();
  for (const [keywords, emoji] of ITEM_EMOJIS) {
    if (keywords.some((kw) => lower.includes(kw))) return emoji;
  }
  return "🛒";
}

// ─── Plan accent palette ──────────────────────

const PLAN_ACCENTS = [
  { accent: "#FF6B6B", tint: "#FF6B6B18" },
  { accent: "#4ECDC4", tint: "#4ECDC418" },
  { accent: "#A78BFA", tint: "#A78BFA18" },
  { accent: "#F59E0B", tint: "#F59E0B18" },
  { accent: "#34D399", tint: "#34D39918" },
];

// ─── Individual item row ──────────────────────

function ItemRow({
  item,
  accent,
  onToggle,
}: {
  item: OrderItem;
  accent: string;
  onToggle: () => void;
}) {
  const theme = useTheme();
  const scale = useRef(new Animated.Value(1)).current;
  const [expanded, setExpanded] = useState(false);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.92,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 200,
        friction: 10,
      }),
    ]).start();
    onToggle();
  };

  const emoji = getItemEmoji(item.item);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={handlePress}
        onLongPress={() => setExpanded((v) => !v)}
        style={[
          styles.itemRow,
          {
            backgroundColor: item.have_ordered ? accent + "12" : theme.surface,
            borderColor: item.have_ordered ? accent + "50" : theme.border,
          },
        ]}
      >
        {/* Checkbox */}
        <View
          style={[
            styles.checkbox,
            {
              borderColor: item.have_ordered ? accent : theme.border,
              backgroundColor: item.have_ordered ? accent : "transparent",
            },
          ]}
        >
          {item.have_ordered && (
            <Ionicons name="checkmark" size={12} color="#fff" />
          )}
        </View>

        {/* Emoji */}
        <Text style={styles.itemEmoji}>{emoji}</Text>

        {/* Text block */}
        <View style={styles.itemTextBlock}>
          <Text
            style={[
              styles.itemName,
              {
                color: item.have_ordered ? theme.textMuted : theme.text,
                textDecorationLine: item.have_ordered ? "line-through" : "none",
              },
            ]}
            numberOfLines={expanded ? undefined : 1}
          >
            {item.item}
          </Text>
          {expanded ? (
            <View style={styles.reasonRow}>
              <Ionicons name="sparkles" size={11} color={accent} />
              <Text style={[styles.reasonText, { color: theme.textMuted }]}>
                {item.reason}
              </Text>
            </View>
          ) : (
            <Text style={[styles.tapHint, { color: theme.textDim }]}>
              Hold for AI reason · tap to check
            </Text>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}

// ─── Donut progress indicator ─────────────────

function DonutProgress({
  progress,
  accent,
}: {
  progress: number;
  accent: string;
}) {
  const size = 48;
  const pct = Math.round(progress * 100);
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 4,
        borderColor: accent + "30",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: accent + "15",
      }}
    >
      <View
        style={{
          position: "absolute",
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 4,
          borderColor: "transparent",
          borderTopColor: pct > 0 ? accent : "transparent",
          borderRightColor: pct > 25 ? accent : "transparent",
          borderBottomColor: pct > 50 ? accent : "transparent",
          borderLeftColor: pct > 75 ? accent : "transparent",
          transform: [{ rotate: "-45deg" }],
        }}
      />
      <Text style={{ fontSize: 11, fontWeight: "800", color: accent }}>
        {pct}%
      </Text>
    </View>
  );
}

// ─── Single order plan card ───────────────────

type LocalOrder = Order & { localItems: OrderItem[] };

function PlanCard({
  order,
  index,
  onToggleItem,
}: {
  order: LocalOrder;
  index: number;
  accentIndex: number;
  onToggleItem: (orderId: string, itemIndex: number) => void;
}) {
  const theme = useTheme();
  const palette = PLAN_ACCENTS[index % PLAN_ACCENTS.length];
  const { accent, tint } = palette;

  const doneCount = order.localItems.filter((i) => i.have_ordered).length;
  const totalCount = order.localItems.length;
  const progress = totalCount > 0 ? doneCount / totalCount : 0;
  const allDone = doneCount === totalCount && totalCount > 0;

  const estimatedDate = new Date(order.estimated_date_to_order + "T00:00:00");
  const dateLabel = estimatedDate.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  const [collapsed, setCollapsed] = useState(false);

  return (
    <View
      style={[
        styles.planCard,
        {
          backgroundColor: theme.surfaceElevated ?? theme.surface,
          borderColor: theme.border,
          shadowColor: accent,
        },
      ]}
    >
      {/* Card Header */}
      <Pressable
        onPress={() => setCollapsed((v) => !v)}
        style={[styles.cardHeader, { backgroundColor: tint }]}
      >
        <View style={styles.cardHeaderLeft}>
          <View style={[styles.runBadge, { backgroundColor: accent }]}>
            <Text style={styles.runBadgeText}>RUN {index + 1}</Text>
          </View>
          <Text style={[styles.cardTitle, { color: theme.text }]}>
            {allDone ? "Mission Complete 🎉" : "Market Mission"}
          </Text>
          <View style={styles.cardMeta}>
            <Ionicons
              name="calendar-outline"
              size={12}
              color={theme.textMuted}
            />
            <Text style={[styles.cardMetaText, { color: theme.textMuted }]}>
              {dateLabel}
            </Text>
            <Text style={[styles.cardMetaDot, { color: theme.textDim }]}>
              ·
            </Text>
            <Ionicons name="cart-outline" size={12} color={accent} />
            <Text
              style={[
                styles.cardMetaText,
                { color: accent, fontWeight: "600" },
              ]}
            >
              {doneCount}/{totalCount} grabbed
            </Text>
          </View>
        </View>

        <DonutProgress progress={progress} accent={accent} />
      </Pressable>

      {/* Progress bar */}
      <View style={[styles.progressTrack, { backgroundColor: accent + "20" }]}>
        <View
          style={[
            styles.progressFill,
            {
              backgroundColor: accent,
              width: `${Math.round(progress * 100)}%`,
            },
          ]}
        />
      </View>

      {/* Items list */}
      {!collapsed && (
        <View style={styles.itemsList}>
          {order.localItems.map((item, itemIdx) => (
            <ItemRow
              key={itemIdx}
              item={item}
              accent={accent}
              onToggle={() => onToggleItem(order.id, itemIdx)}
            />
          ))}

          {allDone && (
            <View
              style={[
                styles.allDoneBanner,
                {
                  backgroundColor: accent + "18",
                  borderColor: accent + "40",
                },
              ]}
            >
              <Text style={[styles.allDoneText, { color: accent }]}>
                🏆 All items grabbed — you're a shopping hero!
              </Text>
            </View>
          )}
        </View>
      )}

      {collapsed && (
        <Pressable
          onPress={() => setCollapsed(false)}
          style={[styles.collapsedBar, { borderColor: theme.border }]}
        >
          <Text style={[styles.collapsedText, { color: theme.textMuted }]}>
            {totalCount} items · tap to expand
          </Text>
          <Ionicons name="chevron-down" size={14} color={theme.textDim} />
        </Pressable>
      )}
    </View>
  );
}

// ─── Main Plan Screen ─────────────────────────

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

  const handleToggleItem = (orderId: string, itemIndex: number) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const newItems = o.localItems.map((item, idx) =>
          idx === itemIndex
            ? { ...item, have_ordered: !item.have_ordered }
            : item,
        );
        return { ...o, localItems: newItems };
      }),
    );
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
          {
            borderBottomColor: theme.border,
            backgroundColor: theme.surface,
          },
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
              accentIndex={idx}
              onToggleItem={handleToggleItem}
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

// ─── Styles ───────────────────────────────────

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

  planCard: {
    borderRadius: Radius.xl,
    borderWidth: 1,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  cardHeaderLeft: { flex: 1, gap: 4 },
  runBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  runBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.8,
  },
  cardTitle: { fontSize: Typography.size.md, fontWeight: "700" },
  cardMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flexWrap: "wrap",
  },
  cardMetaText: { fontSize: Typography.size.xs },
  cardMetaDot: { fontSize: Typography.size.xs },

  progressTrack: { height: 3 },
  progressFill: { height: 3, borderRadius: 2 },

  itemsList: { padding: Spacing.md, gap: Spacing.xs },

  itemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: Spacing.sm,
    borderRadius: Radius.lg,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
    flexShrink: 0,
  },
  itemEmoji: { fontSize: 18, lineHeight: 22, flexShrink: 0 },
  itemTextBlock: { flex: 1, gap: 2 },
  itemName: { fontSize: Typography.size.sm, fontWeight: "600" },
  reasonRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 4,
  },
  reasonText: { fontSize: Typography.size.xs, lineHeight: 16, flex: 1 },
  tapHint: { fontSize: 10 },

  allDoneBanner: {
    padding: Spacing.sm,
    borderRadius: Radius.lg,
    borderWidth: 1,
    marginTop: Spacing.xs,
  },
  allDoneText: {
    fontSize: Typography.size.sm,
    fontWeight: "600",
    textAlign: "center",
  },

  collapsedBar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
  },
  collapsedText: { fontSize: Typography.size.xs },

  footer: {
    fontSize: 11,
    textAlign: "center",
    marginTop: Spacing.sm,
  },
});
