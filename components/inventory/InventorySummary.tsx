// ─────────────────────────────────────────────
//  InventorySummary — thin orchestrator (~25 lines)
//  All logic lives in summary/SpendHero.tsx and
//  summary/SpendBreakdown.tsx for easy maintenance.
// ─────────────────────────────────────────────

import { SemanticTheme, Spacing } from "@/constants/Themes";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SpendBreakdown } from "./summary/SpendBreakdown";
import { SpendHero } from "./summary/SpendHero";
import { Receipt } from "./types";

type Props = { receipts: Receipt[]; theme: SemanticTheme };

export function InventorySummary({ receipts, theme }: Props) {
  return (
    <View style={s.container}>
      <SpendHero receipts={receipts} theme={theme} />
      <SpendBreakdown receipts={receipts} theme={theme} />
    </View>
  );
}

const s = StyleSheet.create({
  container: { gap: Spacing.sm, marginBottom: Spacing.md },
});
