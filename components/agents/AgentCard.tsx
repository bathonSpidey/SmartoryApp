// ─────────────────────────────────────────────
//  AgentCard — Individual agent configuration card
//  Shows bot face + config details + action button
// ─────────────────────────────────────────────

import BotFace from "@/components/agents/BotFace";
import { SemanticTheme } from "@/constants/Themes";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { styles } from "./styles/AgentCard.styles";
import { AgentConfig, AgentMeta } from "./types";

type Props = {
  agentType: string;
  meta: AgentMeta;
  config: AgentConfig | undefined;
  theme: SemanticTheme;
  onConfigure: (agentType: string) => void;
  onUpdate: (agentType: string, config: AgentConfig) => void;
};

export default function AgentCard({
  agentType,
  meta,
  config,
  theme,
  onConfigure,
  onUpdate,
}: Props) {
  const isConfigured = !!config;

  // Derive head colours based on theme surface + accent
  const headBg = isConfigured ? `${meta.accentHex}12` : theme.surfaceElevated;
  const headBorder = isConfigured ? `${meta.accentHex}55` : theme.border;
  const dimColor = theme.textDim;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.surface,
          borderColor: isConfigured ? `${meta.accentHex}44` : theme.border,
          ...theme.shadowCard,
        },
      ]}
    >
      {/* ── Status badge ── */}
      <View
        style={[
          styles.badge,
          {
            backgroundColor: isConfigured
              ? `${meta.accentHex}18`
              : theme.surfaceElevated,
          },
        ]}
      >
        <View
          style={[
            styles.badgeDot,
            {
              backgroundColor: isConfigured ? meta.accentHex : dimColor,
            },
          ]}
        />
        <Text
          style={[
            styles.badgeText,
            { color: isConfigured ? meta.accentHex : dimColor },
          ]}
        >
          {isConfigured ? "Active" : "Not configured"}
        </Text>
      </View>

      {/* ── Bot face ── */}
      <View style={styles.faceContainer}>
        <BotFace
          agentType={
            agentType as
              | "extractor"
              | "recommender"
              | "planner"
              | "budget_watcher"
          }
          accent={meta.accentHex}
          dim={dimColor}
          headBg={headBg}
          headBorder={headBorder}
          active={isConfigured}
          size={64}
        />
      </View>

      {/* ── Agent name & description ── */}
      <Text style={[styles.agentName, { color: theme.text }]}>
        {meta.label}
      </Text>
      <Text style={[styles.agentDesc, { color: theme.textMuted }]}>
        {meta.description}
      </Text>

      {/* ── Config details (only when configured) ── */}
      {isConfigured && config && (
        <View
          style={[
            styles.configRow,
            {
              backgroundColor: theme.surfaceElevated,
              borderColor: theme.border,
            },
          ]}
        >
          <ConfigPill
            icon="hardware-chip-outline"
            value={config.model_name}
            color={meta.accentHex}
            theme={theme}
          />
          <ConfigPill
            icon="thermometer-outline"
            value={`${config.temperature}`}
            color={meta.accentHex}
            theme={theme}
          />
          <ConfigPill
            icon="cloud-outline"
            value={config.provider_name}
            color={meta.accentHex}
            theme={theme}
          />
        </View>
      )}

      {/* ── Action button ── */}
      <Pressable
        onPress={() =>
          isConfigured && config
            ? onUpdate(agentType, config)
            : onConfigure(agentType)
        }
        style={({ pressed }) => [
          styles.actionBtn,
          {
            backgroundColor: isConfigured
              ? `${meta.accentHex}18`
              : meta.accentHex,
            borderColor: meta.accentHex,
            opacity: pressed ? 0.75 : 1,
          },
        ]}
      >
        <Ionicons
          name={isConfigured ? "pencil-outline" : "settings-outline"}
          size={14}
          color={isConfigured ? meta.accentHex : "#fff"}
        />
        <Text
          style={[
            styles.actionBtnText,
            { color: isConfigured ? meta.accentHex : "#fff" },
          ]}
        >
          {isConfigured ? "Update" : "Configure"}
        </Text>
      </Pressable>
    </View>
  );
}

// ── Mini config pill ─────────────────────────
function ConfigPill({
  icon,
  value,
  color,
  theme,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  color: string;
  theme: SemanticTheme;
}) {
  return (
    <View style={styles.pill}>
      <Ionicons name={icon} size={11} color={color} />
      <Text
        style={[styles.pillText, { color: theme.textMuted }]}
        numberOfLines={1}
      >
        {value}
      </Text>
    </View>
  );
}
