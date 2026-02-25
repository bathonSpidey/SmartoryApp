import { Radius, Spacing, Typography } from "@/constants/Themes";
import { StyleSheet } from "react-native";

export const s = StyleSheet.create({
  // ── Skeleton ──
  card: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
    overflow: "hidden",
  },
  accent: { height: 4 },
  body: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  avatar: { width: 44, height: 44, borderRadius: Radius.full },
  lines: { flex: 1, gap: 6 },
  line: { height: 13, borderRadius: Radius.sm },
  amount: { width: 60, height: 22, borderRadius: Radius.sm },

  // ── Shared states ──
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing["4xl"],
    gap: Spacing.sm,
  },
  icon: {
    width: 80,
    height: 80,
    borderRadius: Radius.xl,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: Typography.size.md,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    fontSize: Typography.size.sm,
    textAlign: "center",
    lineHeight: 20,
  },

  // ── Error retry ──
  retry: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    marginTop: Spacing.sm,
  },
  retryText: { fontSize: Typography.size.sm, fontWeight: "700" },
});
