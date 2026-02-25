// ─────────────────────────────────────────────
//  ReceiptCard — The main receipt display card
//  • Tap header to expand / collapse items
//  • Left stripe colour = store accent colour
//  • Category chips summarise what's inside
//  • Modular: drop it anywhere, pass theme prop
// ─────────────────────────────────────────────

import { Radius, SemanticTheme, Spacing, Typography } from "@/constants/Themes";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  UIManager,
  View,
} from "react-native";
import { CategoryChip } from "./CategoryChip";
import { getStoreColor } from "./categoryColors";
import { ItemBubble } from "./ItemBubble";
import { Receipt } from "./types";

// Enable LayoutAnimation on Android
if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

type Props = {
  receipt: Receipt;
  theme: SemanticTheme;
  /** Start expanded — useful for single-receipt views */
  defaultExpanded?: boolean;
};

export function ReceiptCard({
  receipt,
  theme,
  defaultExpanded = false,
}: Props) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const storeColor = getStoreColor(receipt.store_name);
  const currency = receipt.raw_response.currency ?? "USD";
  const symbol = CURRENCY_SYMBOLS[currency] ?? currency + " ";
  const date = relativeDate(receipt.raw_response.date ?? receipt.created_at);
  const storeInitial = receipt.store_name.trim()[0]?.toUpperCase() ?? "?";

  // Unique categories used in this receipt
  const uniqueCategories = [...new Set(receipt.items.map((i) => i.category))];

  function toggle() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((v) => !v);
  }

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          ...theme.shadowCard,
        },
      ]}
    >
      {/* ── Top accent bar ── */}
      <View style={[styles.accentBar, { backgroundColor: storeColor }]} />

      {/* ── Card body ── */}
      <View style={styles.body}>
        {/* ── Header row (pressable) ── */}
        <Pressable
          style={({ pressed }) => [
            styles.headerRow,
            pressed && { opacity: 0.75 },
          ]}
          onPress={toggle}
          hitSlop={8}
        >
          {/* Store avatar */}
          <View
            style={[
              styles.avatar,
              {
                backgroundColor: storeColor + "22",
                borderColor: storeColor + "55",
              },
            ]}
          >
            <Text style={[styles.avatarLetter, { color: storeColor }]}>
              {storeInitial}
            </Text>
          </View>

          {/* Store info */}
          <View style={styles.storeInfo}>
            <Text
              style={[styles.storeName, { color: theme.text }]}
              numberOfLines={1}
            >
              {titleCase(receipt.store_name)}
            </Text>
            <Text style={[styles.dateText, { color: theme.textMuted }]}>
              {date}
            </Text>
          </View>

          {/* Total + chevron */}
          <View style={styles.totalCol}>
            <Text style={[styles.totalAmount, { color: theme.text }]}>
              {symbol}
              {receipt.total_amount.toFixed(2)}
            </Text>
          </View>

          <View
            style={[
              styles.chevronBox,
              { backgroundColor: theme.surfaceElevated },
            ]}
          >
            <Ionicons
              name={expanded ? "chevron-up" : "chevron-down"}
              size={14}
              color={theme.textMuted}
            />
          </View>
        </Pressable>

        {/* ── Divider ── */}
        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        {/* ── Category chips strip + item count ── */}
        <View style={styles.chipsRow}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsScroll}
          >
            {uniqueCategories.map((cat) => (
              <CategoryChip key={cat} category={cat} size="sm" />
            ))}
          </ScrollView>
          <View
            style={[
              styles.itemCountBadge,
              { backgroundColor: theme.surfaceElevated },
            ]}
          >
            <Ionicons name="list-outline" size={11} color={theme.textMuted} />
            <Text style={[styles.itemCountText, { color: theme.textMuted }]}>
              {receipt.items.length}
            </Text>
          </View>
        </View>

        {/* ── Expanded: item list ── */}
        {expanded && (
          <View style={styles.itemsList}>
            <View
              style={[styles.itemsDivider, { backgroundColor: theme.border }]}
            />
            {receipt.items.map((item, i) => (
              <ItemBubble
                key={`${item.name}-${i}`}
                item={item}
                currency={currency}
                theme={theme}
              />
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

// ── helpers ──────────────────────────────────

function titleCase(str: string) {
  return str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

function parseReceiptDate(raw: string): Date | null {
  if (!raw) return null;
  const slashMatch = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slashMatch) {
    const [, m, d, y] = slashMatch;
    return new Date(`${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`);
  }
  const dotMatch = raw.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (dotMatch) {
    const [, d, m, y] = dotMatch;
    return new Date(`${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`);
  }
  try {
    const d = new Date(raw);
    return isNaN(d.getTime()) ? null : d;
  } catch {
    return null;
  }
}

function relativeDate(raw: string): string {
  const date = parseReceiptDate(raw);
  if (!date) return raw;

  const now = new Date();
  // Compare calendar days (ignore time)
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dateStart = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  const diffDays = Math.round(
    (todayStart.getTime() - dateStart.getTime()) / 86_400_000,
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return "Last week";

  // Older: show "Jan 5" or "Jan 5, 2023" if different year
  const sameYear = date.getFullYear() === now.getFullYear();
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    ...(sameYear ? {} : { year: "numeric" }),
  });
}

import { CURRENCY_SYMBOLS } from "@/constants/currencies";

// ── styles ───────────────────────────────────

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
    overflow: "hidden",
  },
  accentBar: {
    height: 4,
    width: "100%",
  },
  body: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },

  // ── Header ──
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarLetter: {
    fontSize: 20,
    fontWeight: "700",
  },
  storeInfo: {
    flex: 1,
    gap: 3,
    minWidth: 0,
  },
  storeName: {
    fontSize: Typography.size.md,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  dateText: {
    fontSize: Typography.size.xs,
    fontWeight: "500",
  },
  totalCol: {
    alignItems: "flex-end",
    flexShrink: 0,
  },
  totalAmount: {
    fontSize: Typography.size.lg,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  chevronBox: {
    width: 26,
    height: 26,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  // ── Divider ──
  divider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
  },

  // ── Chips strip ──
  chipsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: Spacing.md,
    paddingRight: Spacing.sm,
    gap: Spacing.sm,
  },
  chipsScroll: {
    gap: 6,
    paddingRight: 4,
    flexGrow: 0,
    maxWidth: "100%",
  },
  itemCountBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.full,
    flexShrink: 0,
  },
  itemCountText: {
    fontSize: 11,
    fontWeight: "700",
  },

  // ── Items list ──
  itemsList: {
    paddingHorizontal: Spacing.md,
  },
  itemsDivider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: Spacing.sm,
  },
});
