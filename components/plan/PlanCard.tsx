import { useSession } from "@/hooks/useSession";
import { useTheme } from "@/hooks/useTheme";
import {
  addItemToOrder,
  completePlan,
  togglePlanItem,
} from "@/lib/order.service";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { PLAN_ACCENTS } from "./constants";
import DonutProgress from "./DonutProgress";
import ItemRow from "./ItemRow";
import { styles } from "./styles/PlanCard.styles";
import { LocalOrder } from "./types";

type Props = {
  order: LocalOrder;
  index: number;
  onComplete: (orderId: string) => void;
};

export default function PlanCard({ order, index, onComplete }: Props) {
  const theme = useTheme();
  const { session } = useSession();
  const { accent, tint } = PLAN_ACCENTS[index % PLAN_ACCENTS.length];

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

  const [collapsed, setCollapsed] = useState(true);

  // ── Toggle state ───────────────────────────
  const [togglingIdx, setTogglingIdx] = useState<number | null>(null);

  const handleToggle = async (itemIdx: number) => {
    if (!session?.access_token || togglingIdx !== null) return;
    const item = order.localItems[itemIdx];
    // Optimistic update
    order.localItems[itemIdx] = { ...item, have_ordered: !item.have_ordered };
    setTogglingIdx(itemIdx);
    try {
      const res = await togglePlanItem(
        session.access_token,
        order.id,
        item.item,
      );
      if (res.status === "success") {
        // Sync from server response
        const synced = res.data.order.map((i) => ({ ...i }));
        order.localItems.splice(0, order.localItems.length, ...synced);
        // If every item is now checked, complete the plan and remove from list
        if (synced.every((i) => i.have_ordered)) {
          setTogglingIdx(null);
          await completePlan(session.access_token, order.id);
          onComplete(order.id);
          return;
        }
      }
    } catch {
      // Revert on failure
      order.localItems[itemIdx] = item;
    } finally {
      setTogglingIdx(null);
    }
  };

  // ── Add-item state ─────────────────────────
  const [addingItem, setAddingItem] = useState(false);
  const [itemName, setItemName] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  const handleAddItem = async () => {
    const trimmed = itemName.trim();
    if (!trimmed || !session?.access_token) return;
    setAddLoading(true);
    setAddError(null);
    try {
      const res = await addItemToOrder(session.access_token, order.id, trimmed);
      if (res.status === "success") {
        // Sync local items from the returned order
        const newItems = res.data.order.map((i) => ({ ...i }));
        order.localItems.splice(0, order.localItems.length, ...newItems);
        setItemName("");
        setAddingItem(false);
      }
    } catch (e: any) {
      setAddError(e.message ?? "Failed to add item");
    } finally {
      setAddLoading(false);
    }
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.surfaceElevated ?? theme.surface,
          borderColor: theme.border,
          shadowColor: accent,
        },
      ]}
    >
      {/* Header — tappable to collapse/expand */}
      <Pressable
        onPress={() => setCollapsed((v) => !v)}
        style={[styles.header, { backgroundColor: tint }]}
      >
        <View style={styles.headerLeft}>
          <View style={[styles.runBadge, { backgroundColor: accent }]}>
            <Text style={styles.runBadgeText}>RUN {index + 1}</Text>
          </View>
          <Text style={[styles.title, { color: theme.text }]}>
            {allDone ? "Mission Complete 🎉" : "Market Mission"}
          </Text>
          <View style={styles.meta}>
            <Ionicons
              name="calendar-outline"
              size={12}
              color={theme.textMuted}
            />
            <Text style={[styles.metaText, { color: theme.textMuted }]}>
              {dateLabel}
            </Text>
            <Text style={[styles.metaDot, { color: theme.textDim }]}>·</Text>
            <Ionicons name="cart-outline" size={12} color={accent} />
            <Text
              style={[styles.metaText, { color: accent, fontWeight: "600" }]}
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

      {/* Expanded items list */}
      {!collapsed && (
        <View style={styles.itemsList}>
          {order.localItems.map((item, itemIdx) => (
            <ItemRow
              key={itemIdx}
              item={item}
              accent={accent}
              toggling={togglingIdx === itemIdx}
              onToggle={() => handleToggle(itemIdx)}
            />
          ))}
          {allDone && (
            <View
              style={[
                styles.allDoneBanner,
                { backgroundColor: accent + "18", borderColor: accent + "40" },
              ]}
            >
              <Text style={[styles.allDoneText, { color: accent }]}>
                🏆 All items grabbed — you're a shopping hero!
              </Text>
            </View>
          )}

          {/* Add-item UI */}
          {addingItem ? (
            <>
              <View style={styles.addItemRow}>
                <TextInput
                  style={[
                    styles.addItemInput,
                    {
                      backgroundColor: theme.surfaceInput ?? theme.surface,
                      borderColor: theme.borderFocus ?? accent,
                      color: theme.text,
                    },
                  ]}
                  placeholder="Item name…"
                  placeholderTextColor={theme.textDim}
                  value={itemName}
                  onChangeText={setItemName}
                  autoFocus
                  onSubmitEditing={handleAddItem}
                  returnKeyType="done"
                />
                <Pressable
                  onPress={handleAddItem}
                  disabled={addLoading || !itemName.trim()}
                  style={[
                    styles.addItemConfirm,
                    {
                      backgroundColor:
                        itemName.trim() && !addLoading ? accent : accent + "50",
                    },
                  ]}
                >
                  {addLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.addItemConfirmText}>Add</Text>
                  )}
                </Pressable>
                <Pressable
                  onPress={() => {
                    setAddingItem(false);
                    setItemName("");
                    setAddError(null);
                  }}
                >
                  <Ionicons name="close" size={18} color={theme.textDim} />
                </Pressable>
              </View>
              {addError && (
                <Text
                  style={[{ fontSize: 11, color: theme.error, marginTop: 4 }]}
                >
                  {addError}
                </Text>
              )}
            </>
          ) : (
            <Pressable
              onPress={() => setAddingItem(true)}
              style={[
                styles.addItemBtn,
                { borderColor: accent + "50", backgroundColor: accent + "0E" },
              ]}
            >
              <Ionicons name="add" size={14} color={accent} />
              <Text style={[styles.addItemBtnText, { color: accent }]}>
                Add item
              </Text>
            </Pressable>
          )}
        </View>
      )}

      {/* Collapsed hint */}
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
