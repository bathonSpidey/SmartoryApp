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
            Your scanned receipts
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
              <Text style={[s.sectionLabel, { color: theme.textMuted }]}>
                {receipts.length} receipt{receipts.length !== 1 ? "s" : ""}
              </Text>
              {receipts.map((receipt) => (
                <ReceiptCard key={receipt.id} receipt={receipt} theme={theme} />
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
