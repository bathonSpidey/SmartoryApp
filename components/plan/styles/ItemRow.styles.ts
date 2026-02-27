import { Radius, Spacing, Typography } from "@/constants/Themes";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  itemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: Spacing.sm,
    borderRadius: Radius.lg,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
    flexShrink: 0,
  },
  textBlock: { flex: 1, gap: 2 },
  itemName: { fontSize: Typography.size.sm, fontWeight: "600" },
  reasonRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 4,
  },
  reasonText: { fontSize: Typography.size.xs, lineHeight: 16, flex: 1 },
  tapHint: { fontSize: 10 },
});
