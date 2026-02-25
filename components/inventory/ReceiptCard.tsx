// ─────────────────────────────────────────────
//  ReceiptCard — The main receipt display card
//  • Tap header to expand / collapse items
//  • Left stripe colour = store accent colour
//  • Category chips summarise what's inside
//  • Modular: drop it anywhere, pass theme prop
// ─────────────────────────────────────────────

import { SemanticTheme } from "@/constants/Themes";
import { deleteReceipt } from "@/lib/receipt.service";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  LayoutAnimation,
  Modal,
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
import { styles } from "./styles/ReceiptCard.styles";
import { Receipt } from "./types";

// Enable LayoutAnimation on Android
if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

type Props = {
  receipt: Receipt;
  theme: SemanticTheme;
  /** Bearer token for authenticated API calls */
  token: string;
  /** Called after successful deletion so the parent can remove this card */
  onDelete?: (id: string) => void;
  /** Start expanded — useful for single-receipt views */
  defaultExpanded?: boolean;
};

export function ReceiptCard({
  receipt,
  theme,
  token,
  onDelete,
  defaultExpanded = false,
}: Props) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [deleting, setDeleting] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const storeColor = getStoreColor(receipt.store_name);
  const currency = receipt.raw_response.currency ?? "USD";
  const symbol = CURRENCY_SYMBOLS[currency] ?? currency + " ";
  const date = relativeDate(receipt.raw_response.date ?? receipt.created_at);
  const storeInitial = receipt.store_name.trim()[0]?.toUpperCase() ?? "?";

  // Unique categories + per-category spend totals
  const uniqueCategories = [...new Set(receipt.items.map((i) => i.category))];
  const categoryTotals = uniqueCategories.reduce<Record<string, number>>(
    (acc, cat) => {
      acc[cat] = receipt.items
        .filter((i) => i.category === cat)
        .reduce((sum, i) => sum + i.price * (i.quantity ?? 1), 0);
      return acc;
    },
    {},
  );

  function toggle() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((v) => !v);
  }

  function confirmDelete() {
    setDeleteError(null);
    setConfirmVisible(true);
  }

  async function handleDelete() {
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteReceipt(token, receipt.id);
      setConfirmVisible(false);
      onDelete?.(receipt.id);
    } catch (e) {
      setDeleteError("Failed to delete receipt. Please try again.");
    } finally {
      setDeleting(false);
    }
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
        <View style={styles.headerRow}>
          <Pressable
            style={({ pressed }) => [
              styles.headerPressable,
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

          {/* Delete button — outside header Pressable so it gets its own tap */}
          <Pressable
            onPress={confirmDelete}
            disabled={deleting}
            hitSlop={8}
            style={({ pressed }) => [
              styles.deleteBtn,
              {
                backgroundColor: "#ff3b3022",
                opacity: pressed || deleting ? 0.5 : 1,
              },
            ]}
          >
            <Ionicons
              name={deleting ? "hourglass-outline" : "trash-outline"}
              size={14}
              color="#ff3b30"
            />
          </Pressable>
        </View>

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
              <CategoryChip
                key={cat}
                category={cat}
                size="sm"
                amount={categoryTotals[cat]}
                symbol={symbol}
              />
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

      {/* ── Delete confirmation modal ── */}
      <Modal
        visible={confirmVisible}
        transparent
        animationType="fade"
        onRequestClose={() => !deleting && setConfirmVisible(false)}
      >
        <Pressable
          style={ds.overlay}
          onPress={() => !deleting && setConfirmVisible(false)}
        >
          <Pressable
            style={[
              ds.card,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Icon */}
            <View style={ds.iconWrap}>
              <Ionicons name="trash-outline" size={28} color="#ff3b30" />
            </View>

            <Text style={[ds.title, { color: theme.text }]}>
              Delete Receipt
            </Text>
            <Text style={[ds.message, { color: theme.textMuted }]}>
              Remove the receipt from{" "}
              <Text style={{ fontWeight: "700" }}>
                {titleCase(receipt.store_name)}
              </Text>
              ? This cannot be undone.
            </Text>

            {deleteError && <Text style={ds.errorText}>{deleteError}</Text>}

            <View style={ds.actions}>
              <Pressable
                onPress={() => setConfirmVisible(false)}
                disabled={deleting}
                style={({ pressed }) => [
                  ds.btn,
                  {
                    backgroundColor: theme.background,
                    borderWidth: 1,
                    borderColor: theme.border,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <Text style={[ds.btnCancelText, { color: theme.text }]}>
                  Cancel
                </Text>
              </Pressable>

              <Pressable
                onPress={handleDelete}
                disabled={deleting}
                style={({ pressed }) => [
                  ds.btn,
                  ds.btnDanger,
                  { opacity: pressed || deleting ? 0.7 : 1 },
                ]}
              >
                {deleting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={ds.btnDangerText}>Delete</Text>
                )}
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
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

// ── Delete modal styles ───────────────────────
const ds = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  card: {
    width: "100%",
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
    alignItems: "center",
    gap: 8,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#ff3b3018",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
  },
  message: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  errorText: {
    fontSize: 13,
    color: "#ff3b30",
    textAlign: "center",
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
    width: "100%",
  },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  btnCancelText: {
    fontSize: 14,
    fontWeight: "600",
  },
  btnDanger: {
    backgroundColor: "#ff3b30",
  },
  btnDangerText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
});
