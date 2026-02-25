import { Radius, Spacing, Typography } from "@/constants/Themes";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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
