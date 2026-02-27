import { Radius, Spacing, Typography } from "@/constants/Themes";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.xl,
    borderWidth: 1,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },

  // ── Header ──────────────────────────────────
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  headerLeft: { flex: 1, gap: 4 },
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
  title: { fontSize: Typography.size.md, fontWeight: "700" },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flexWrap: "wrap",
  },
  metaText: { fontSize: Typography.size.xs },
  metaDot: { fontSize: Typography.size.xs },

  // ── Progress bar ─────────────────────────────
  progressTrack: { height: 3 },
  progressFill: { height: 3, borderRadius: 2 },

  // ── Items list ───────────────────────────────
  itemsList: { padding: Spacing.md, gap: Spacing.xs },

  // ── All-done banner ──────────────────────────
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

  // ── Collapsed bar ────────────────────────────
  collapsedBar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
  },
  collapsedText: { fontSize: Typography.size.xs },

  // ── Add-item row ─────────────────────────────
  addItemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  addItemInput: {
    flex: 1,
    height: 36,
    borderRadius: Radius.lg,
    borderWidth: 1,
    paddingHorizontal: Spacing.sm,
    fontSize: Typography.size.sm,
  },
  addItemConfirm: {
    height: 36,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  addItemConfirmText: {
    fontSize: Typography.size.sm,
    fontWeight: "700",
    color: "#fff",
  },
  addItemBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  addItemBtnText: { fontSize: Typography.size.xs, fontWeight: "600" },
});
