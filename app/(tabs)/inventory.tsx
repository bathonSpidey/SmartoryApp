import { Spacing, Typography } from "@/constants/Themes";
import { useReceipts } from "@/hooks/useReceipts";
import { useTheme } from "@/hooks/useTheme";
import React from "react";
import {
  ActivityIndicator,
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
import { Receipt } from "../../components/inventory/types";

// ── helpers ──────────────────────────────────

function parseFlexDate(raw: string): Date {
  if (!raw) return new Date(0);
  const slash = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slash)
    return new Date(
      `${slash[3]}-${slash[1].padStart(2, "0")}-${slash[2].padStart(2, "0")}`,
    );
  const dot = raw.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (dot)
    return new Date(
      `${dot[3]}-${dot[2].padStart(2, "0")}-${dot[1].padStart(2, "0")}`,
    );
  try {
    return new Date(raw);
  } catch {
    return new Date(0);
  }
}

type Section = { label: string; data: Receipt[] };

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
    { label: "Earlier This Month", data: [] },
    { label: "Older", data: [] },
  ];

  for (const r of receipts) {
    const d = parseFlexDate(r.raw_response.date ?? r.created_at);
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

  return sections.filter((s) => s.data.length > 0);
}

export default function InventoryScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { receipts, loading, refreshing, error, refresh } = useReceipts();

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
              {groupByRecency(receipts).map((section) => (
                <React.Fragment key={section.label}>
                  <Text style={[s.sectionLabel, { color: theme.textMuted }]}>
                    {section.label}
                  </Text>
                  {section.data.map((receipt) => (
                    <ReceiptCard
                      key={receipt.id}
                      receipt={receipt}
                      theme={theme}
                    />
                  ))}
                </React.Fragment>
              ))}
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
  sectionLabel: {
    fontSize: Typography.size.xs,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: Spacing.sm,
  },
});
