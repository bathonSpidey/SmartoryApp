// ─────────────────────────────────────────────
//  AgentsGrid — 2-column responsive grid of cards
// ─────────────────────────────────────────────

import AgentCard from "@/components/agents/AgentCard";
import { AgentConfig, AgentMeta } from "@/components/agents/types";
import { SemanticTheme, Spacing } from "@/constants/Themes";
import React from "react";
import { StyleSheet, View } from "react-native";

type GridItem = {
  agentType: string;
  meta: AgentMeta;
  config: AgentConfig | undefined;
};

type Props = {
  items: GridItem[];
  theme: SemanticTheme;
  onConfigure: (agentType: string) => void;
  onUpdate: (agentType: string, config: AgentConfig) => void;
};

export default function AgentsGrid({
  items,
  theme,
  onConfigure,
  onUpdate,
}: Props) {
  // Pair up items into rows of 2
  const rows: GridItem[][] = [];
  for (let i = 0; i < items.length; i += 2) {
    rows.push(items.slice(i, i + 2));
  }

  return (
    <View style={styles.container}>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((item) => (
            <AgentCard
              key={item.agentType}
              agentType={item.agentType}
              meta={item.meta}
              config={item.config}
              theme={theme}
              onConfigure={onConfigure}
              onUpdate={onUpdate}
            />
          ))}
          {/* Fill last row if odd number of agents */}
          {row.length === 1 && <View style={styles.phantom} />}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.md },
  row: { flexDirection: "row", gap: Spacing.md },
  phantom: { flex: 1 },
});
