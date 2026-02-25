import { Radius, Spacing, Typography } from "@/constants/Themes";
import { useReceipts } from "@/hooks/useReceipts";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { InventoryStates } from "../../components/inventory/InventoryStates";
import { InventorySummary } from "../../components/inventory/InventorySummary";
import { ReceiptCard } from "../../components/inventory/ReceiptCard";
import { receiptDate } from "../../components/inventory/summary/dateUtils";
import { Receipt } from "../../components/inventory/types";

// ── sort types ───────────────────────────────

type SortField = "date" | "items" | "total";
type SortDir = "asc" | "desc";
type SortOption = {
  field: SortField;
  dir: SortDir;
  label: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
};

const SORT_OPTIONS: SortOption[] = [
  {
    field: "date",
    dir: "desc",
    label: "Date: Newest first",
    icon: "calendar-outline",
  },
  {
    field: "date",
    dir: "asc",
    label: "Date: Oldest first",
    icon: "calendar-outline",
  },
  {
    field: "items",
    dir: "desc",
    label: "Items: Most first",
    icon: "cube-outline",
  },
  {
    field: "items",
    dir: "asc",
    label: "Items: Fewest first",
    icon: "cube-outline",
  },
  {
    field: "total",
    dir: "desc",
    label: "Total: Highest first",
    icon: "wallet-outline",
  },
  {
    field: "total",
    dir: "asc",
    label: "Total: Lowest first",
    icon: "wallet-outline",
  },
];

function applySort(
  receipts: Receipt[],
  field: SortField,
  dir: SortDir,
): Receipt[] {
  return [...receipts].sort((a, b) => {
    let diff = 0;
    if (field === "date")
      diff = receiptDate(a).getTime() - receiptDate(b).getTime();
    if (field === "items") diff = a.items.length - b.items.length;
    if (field === "total") diff = a.total_amount - b.total_amount;
    return dir === "asc" ? diff : -diff;
  });
}

type Section = { label: string; data: Receipt[]; isOlder?: boolean; isSortable?: boolean };

function groupByRecency(receipts: Receipt[]): Section[] {
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const msPerDay = 86_400_000;

  const sections: Section[] = [
    { label: "This Week", data: [] },
    { label: "Earlier This Month", data: [], isSortable: true },
    { label: "Older", data: [], isOlder: true, isSortable: true },
  ];

  for (const r of receipts) {
    const d = receiptDate(r);
    const diffDays = Math.round(
      (startOfToday.getTime() - d.getTime()) / msPerDay,
    );
    if (diffDays < 7) sections[0].data.push(r);
    else if (
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    )
      sections[1].data.push(r);
    else sections[2].data.push(r);
  }

  return sections.filter((sec) => sec.data.length > 0);
}

export default function InventoryScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { receipts, loading, refreshing, error, refresh } = useReceipts();
  const [sortOption, setSortOption] = useState<SortOption>(SORT_OPTIONS[0]);
  const [sortModalVisible, setSortModalVisible] = useState(false);

  return (
    <View
      style={[
        s.screen,
        { paddingTop: insets.top, backgroundColor: theme.background },
      ]}
    >
      {/* Header */}
      <View
        style={[
          s.header,
          { borderBottomColor: theme.border, backgroundColor: theme.surface },
        ]}
      >
        <View>
          <Text style={[s.title, { color: theme.text }]}>Inventory</Text>
          <Text style={[s.subtitle, { color: theme.textMuted }]}>
            Track what you're spending
          </Text>
        </View>
        {loading && !refreshing && (
          <ActivityIndicator size="small" color={theme.primary} />
        )}
      </View>

      {/* Content */}
      {loading && !refreshing ? (
        <ScrollView
          contentContainerStyle={[
            s.list,
            { paddingBottom: insets.bottom + Spacing.xl },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <InventoryStates.Skeleton theme={theme} />
          <InventoryStates.Skeleton theme={theme} />
          <InventoryStates.Skeleton theme={theme} />
        </ScrollView>
      ) : error ? (
        <InventoryStates.Error
          message={error}
          onRetry={refresh}
          theme={theme}
        />
      ) : (
        <ScrollView
          contentContainerStyle={[
            s.list,
            { paddingBottom: insets.bottom + Spacing.xl },
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refresh}
              tintColor={theme.primary}
              colors={[theme.primary]}
            />
          }
        >
          {receipts.length === 0 ? (
            <InventoryStates.Empty theme={theme} />
          ) : (
            <>
              <InventorySummary receipts={receipts} theme={theme} />
              {groupByRecency(receipts).map((section) => {
                const data = section.isSortable
                  ? applySort(section.data, sortOption.field, sortOption.dir)
                  : section.data;
                return (
                  <React.Fragment key={section.label}>
                    {/* Section header */}
                    <View style={s.sectionRow}>
                      <Text
                        style={[s.sectionLabel, { color: theme.textMuted }]}
                      >
                        {section.label}
                      </Text>
                      {section.isSortable && (
                        <Pressable
                          style={[
                            s.sortBtn,
                            {
                              backgroundColor: theme.surfaceElevated,
                              borderColor: theme.border,
                            },
                          ]}
                          onPress={() => setSortModalVisible(true)}
                        >
                          <Ionicons
                            name="funnel-outline"
                            size={12}
                            color={theme.textMuted}
                          />
                          <Text
                            style={[s.sortBtnText, { color: theme.textMuted }]}
                          >
                            {sortOption.label.split(":")[0]}
                          </Text>
                          <Ionicons
                            name={
                              sortOption.dir === "asc"
                                ? "arrow-up"
                                : "arrow-down"
                            }
                            size={10}
                            color={theme.primary}
                          />
                        </Pressable>
                      )}
                    </View>
                    {data.map((receipt) => (
                      <ReceiptCard
                        key={receipt.id}
                        receipt={receipt}
                        theme={theme}
                      />
                    ))}
                  </React.Fragment>
                );
              })}

              {/* ── Sort picker modal ── */}
              <Modal
                visible={sortModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setSortModalVisible(false)}
              >
                <Pressable
                  style={s.modalBackdrop}
                  onPress={() => setSortModalVisible(false)}
                >
                  <View
                    style={[
                      s.modalSheet,
                      {
                        backgroundColor: theme.surface,
                        borderColor: theme.border,
                      },
                    ]}
                  >
                    <Text style={[s.modalTitle, { color: theme.text }]}>
                      Sort by
                    </Text>
                    {SORT_OPTIONS.map((opt) => {
                      const active =
                        opt.field === sortOption.field &&
                        opt.dir === sortOption.dir;
                      return (
                        <Pressable
                          key={opt.label}
                          style={[
                            s.modalOption,
                            active && { backgroundColor: theme.primary + "10" },
                          ]}
                          onPress={() => {
                            setSortOption(opt);
                            setSortModalVisible(false);
                          }}
                        >
                          <View
                            style={[
                              s.modalOptionIcon,
                              {
                                backgroundColor:
                                  (active ? theme.primary : theme.textMuted) +
                                  "18",
                              },
                            ]}
                          >
                            <Ionicons
                              name={opt.icon}
                              size={16}
                              color={active ? theme.primary : theme.textMuted}
                            />
                          </View>
                          <Text
                            style={[
                              s.modalOptionText,
                              { color: active ? theme.primary : theme.text },
                              active && { fontWeight: "700" },
                            ]}
                          >
                            {opt.label}
                          </Text>
                          {active && (
                            <Ionicons
                              name="checkmark"
                              size={16}
                              color={theme.primary}
                              style={{ marginLeft: "auto" }}
                            />
                          )}
                        </Pressable>
                      );
                    })}
                  </View>
                </Pressable>
              </Modal>
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: Typography.size.xl,
    fontWeight: "700",
    letterSpacing: -0.4,
  },
  subtitle: { fontSize: Typography.size.xs, fontWeight: "500", marginTop: 1 },
  list: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.lg,
    flexGrow: 1,
  },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.sm,
  },
  sectionLabel: {
    fontSize: Typography.size.xs,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  sortBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  sortBtnText: {
    fontSize: 11,
    fontWeight: "600",
  },
  // ── Sort modal ──
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    borderWidth: 1,
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
    gap: 4,
  },
  modalTitle: {
    fontSize: Typography.size.md,
    fontWeight: "800",
    letterSpacing: -0.3,
    marginBottom: Spacing.sm,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: Radius.md,
  },
  modalOptionIcon: {
    width: 32,
    height: 32,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  modalOptionText: {
    fontSize: Typography.size.sm,
    fontWeight: "500",
  },
});
