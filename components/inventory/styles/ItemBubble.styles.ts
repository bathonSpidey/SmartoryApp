import { Radius, Spacing, Typography } from "@/constants/Themes";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  bubble: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: Radius.md,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: Spacing.xs,
  },
  stripe: {
    width: 4,
    alignSelf: "stretch",
  },
  body: {
    flex: 1,
    paddingVertical: 8,
    paddingLeft: 10,
    paddingRight: 4,
    gap: 2,
  },
  name: {
    fontSize: Typography.size.sm,
    fontWeight: "600",
    lineHeight: 16,
  },
  category: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  right: {
    paddingRight: 12,
    paddingVertical: 8,
    alignItems: "flex-end",
    gap: 1,
  },
  price: {
    fontSize: Typography.size.sm,
    fontWeight: "700",
  },
  qty: {
    fontSize: 11,
    fontWeight: "500",
  },
  unit: {
    fontSize: 10,
  },
});
