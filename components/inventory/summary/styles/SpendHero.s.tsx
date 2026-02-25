import { Radius, Spacing, Typography } from "@/constants/Themes";
import { StyleSheet } from "react-native";

export const s = StyleSheet.create({
  card: { borderRadius: Radius.xl, padding: Spacing.lg, gap: 10 },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  label: {
    color: "rgba(255,255,255,0.8)",
    fontSize: Typography.size.sm,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  trendText: { fontSize: 11, fontWeight: "700" },
  amount: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "800",
    letterSpacing: -1.5,
    lineHeight: 40,
  },
  pills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 2,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255,255,255,0.12)",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: Radius.full,
  },
  pillText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: Typography.size.xs,
    fontWeight: "500",
  },
  nudge: {
    color: "rgba(255,255,255,0.6)",
    fontSize: Typography.size.xs,
    fontWeight: "500",
  },
});
