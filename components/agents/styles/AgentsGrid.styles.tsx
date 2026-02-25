import { Spacing } from "@/constants/Themes";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { gap: Spacing.md },
  row: { flexDirection: "row", gap: Spacing.md },
  phantom: { flex: 1 },
});
