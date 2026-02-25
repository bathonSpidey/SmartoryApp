import { FileRow } from "@/components/scan/FileRow";
import { ResultCard } from "@/components/scan/ResultCard";
import { Radius, Spacing, Typography } from "@/constants/Themes";
import { useReceiptEntries } from "@/hooks/useReceiptEntries";
import { useSession } from "@/hooks/useSession";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ScanScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { session } = useSession();
  const {
    entries,
    isProcessing,
    pickFromCamera,
    pickFromLibrary,
    pickDocument,
    removeEntry,
    clearEntries,
    extractAll,
  } = useReceiptEntries(session);

  const pendingCount = entries.filter((e) => e.status === "pending").length;
  const doneEntries = entries.filter(
    (e) => e.status === "done" || e.status === "error",
  );
  const hasAnyFiles = entries.length > 0;

  return (
    <View
      style={[
        styles.screen,
        { paddingTop: insets.top, backgroundColor: theme.background },
      ]}
    >
      <View
        style={[
          styles.header,
          { borderBottomColor: theme.border, backgroundColor: theme.surface },
        ]}
      >
        <Text style={[styles.title, { color: theme.text }]}>Scan Receipt</Text>
        {hasAnyFiles && (
          <Pressable onPress={clearEntries} style={styles.clearBtn}>
            <Text style={[styles.clearBtnText, { color: theme.textMuted }]}>
              Clear all
            </Text>
          </Pressable>
        )}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Picker action row */}
        <View style={styles.actionRow}>
          {(
            [
              {
                icon: "camera-outline",
                label: "Camera",
                onPress: pickFromCamera,
              },
              {
                icon: "images-outline",
                label: "Photos",
                onPress: pickFromLibrary,
              },
              {
                icon: "document-outline",
                label: "Files",
                onPress: pickDocument,
              },
            ] as const
          ).map(({ icon, label, onPress }) => (
            <Pressable
              key={label}
              style={({ pressed }) => [
                styles.actionBtn,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
              onPress={onPress}
            >
              <Ionicons name={icon} size={24} color={theme.primary} />
              <Text style={[styles.actionBtnText, { color: theme.text }]}>
                {label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Empty state */}
        {!hasAnyFiles && (
          <View style={styles.emptyState}>
            <View
              style={[
                styles.emptyIconWrap,
                { backgroundColor: theme.primaryGlow },
              ]}
            >
              <Ionicons
                name="receipt-outline"
                size={48}
                color={theme.primary}
              />
            </View>
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
              Upload your receipts
            </Text>
            <Text style={[styles.emptySubtitle, { color: theme.textMuted }]}>
              Take a photo, select images, or upload PDF files.{"\n"}
              You can add multiple receipts at once.
            </Text>
          </View>
        )}

        {/* File queue */}
        {hasAnyFiles && (
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>
              Files ({entries.length})
            </Text>
            {entries.map((entry) => (
              <FileRow
                key={entry.id}
                entry={entry}
                onRemove={removeEntry}
                theme={theme}
              />
            ))}
          </View>
        )}

        {/* Extract button */}
        {pendingCount > 0 && (
          <Pressable
            style={({ pressed }) => [
              styles.extractBtn,
              {
                backgroundColor: theme.primary,
                opacity: pressed || isProcessing ? 0.8 : 1,
              },
            ]}
            onPress={extractAll}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="sparkles-outline" size={20} color="#fff" />
            )}
            <Text style={styles.extractBtnText}>
              {isProcessing
                ? "Extracting…"
                : `Extract ${pendingCount} ${pendingCount === 1 ? "receipt" : "receipts"}`}
            </Text>
          </Pressable>
        )}

        {/* Results */}
        {doneEntries.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>
              Results
            </Text>
            {doneEntries.map((entry) => (
              <ResultCard key={entry.id} entry={entry} theme={theme} />
            ))}
          </View>
        )}

        <View style={{ height: insets.bottom + Spacing.lg }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  title: { fontSize: Typography.size.xl, fontWeight: "700" },
  clearBtn: { paddingVertical: 4, paddingHorizontal: 8 },
  clearBtnText: { fontSize: Typography.size.sm },
  scrollContent: { padding: Spacing.screenPadding, gap: Spacing.lg },
  actionRow: { flexDirection: "row", gap: Spacing.sm },
  actionBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    gap: Spacing.xs,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  actionBtnText: { fontSize: Typography.size.xs, fontWeight: "600" },
  emptyState: {
    alignItems: "center",
    paddingVertical: Spacing["3xl"],
    gap: Spacing.md,
  },
  emptyIconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: Typography.size.lg,
    fontWeight: "700",
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: Typography.size.sm,
    textAlign: "center",
    lineHeight: 20,
  },
  section: { gap: Spacing.sm },
  sectionLabel: {
    fontSize: Typography.size.xs,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  extractBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
  },
  extractBtnText: {
    color: "#fff",
    fontSize: Typography.size.base,
    fontWeight: "700",
  },
});
