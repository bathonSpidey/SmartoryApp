import { Radius, Spacing, Typography } from "@/constants/Themes";
import { StyleSheet } from "react-native";

export const s = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  title: {
    fontSize: Typography.size.sm,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  betaPill: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  betaText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  // ── Collapse chevron ──────────────────────
  headerSpacer: { flex: 1 },
  chevron: {
    padding: 2,
  },
  // ── Hint chips ───────────────────────────
  hintsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 4,
  },
  hintChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  hintText: {
    fontSize: 11,
    fontWeight: "600",
  },
  // ── Messages ─────────────────────────────
  messagesContainer: {
    height: 240,
  },
  messagesContent: {
    gap: 10,
    paddingBottom: 4,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 18,
  },
  // ── Bubbles ──────────────────────────────
  bubbleRow: {
    flexDirection: "row",
    maxWidth: "82%",
  },
  bubbleRowUser: {
    alignSelf: "flex-end",
  },
  bubbleRowBot: {
    alignSelf: "flex-start",
  },
  bubble: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.md,
  },
  bubbleUser: {
    borderBottomRightRadius: 4,
  },
  bubbleBot: {
    borderBottomLeftRadius: 4,
  },
  bubbleText: {
    fontSize: Typography.size.xs,
    fontWeight: "500",
    lineHeight: 18,
  },
  // ── Input row ───────────────────────────
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: Spacing.sm,
  },
  textInput: {
    flex: 1,
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingTop: 9,
    paddingBottom: 9,
    fontSize: Typography.size.xs,
    maxHeight: 90,
    lineHeight: 18,
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
});
