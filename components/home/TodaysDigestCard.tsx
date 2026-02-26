// ─────────────────────────────────────────────
//  TodaysDigestCard  — v2
//  Bold dark atmospheric AI summary card.
//  Collapsed: large summary text + first insight
//             teaser.
//  Expanded:  full insights (accent-bar bullets)
//             + numbered recommendations.
// ─────────────────────────────────────────────

import { Radius, Spacing, Typography } from "@/constants/Themes";
import { AnalysisEntry } from "@/lib/analysis.service";
import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  Animated,
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  UIManager,
  View,
} from "react-native";

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

// ── Card colour palette — Night Owl dark ─────
const CARD_BG = "#011627"; // editor.background
const CARD_ACCENT = "#7fdbca"; // terminal.ansiBrightCyan
const CARD_GLOW = "#7fdbca1a";
const TEXT_PRIMARY = "#d6deeb"; // editor.foreground
const TEXT_MUTED = "#5f7e97"; // sideBarTitle
const TEXT_DIM = "#4b6479"; // editorLineNumber
const DIVIDER = "#122d42"; // contrastBorder

type Props = {
  analysis: AnalysisEntry;
};

export default function TodaysDigestCard({ analysis }: Props) {
  const [expanded, setExpanded] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const { summary, insights, recommendations } = analysis.overall_summary;

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => !prev);
    Animated.timing(rotateAnim, {
      toValue: expanded ? 0 : 1,
      duration: 240,
      useNativeDriver: true,
    }).start();
  };

  const chevronRotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <View style={styles.wrapper}>
      <Pressable
        onPress={toggle}
        android_ripple={{ color: CARD_GLOW }}
        style={styles.card}
      >
        {/* Top accent bar */}
        <View style={styles.accentBar} />

        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.iconRing}>
            <Ionicons name="sparkles" size={18} color={CARD_ACCENT} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>AI DIGEST · TODAY</Text>
            <Text style={styles.headerTitle}>Your pantry, analysed</Text>
          </View>
          <Animated.View style={{ transform: [{ rotate: chevronRotation }] }}>
            <Ionicons name="chevron-down" size={20} color={TEXT_DIM} />
          </Animated.View>
        </View>

        {/* Summary */}
        <Text style={styles.summary} numberOfLines={expanded ? undefined : 3}>
          {summary}
        </Text>

        {/* First insight teaser — collapsed only */}
        {!expanded && insights.length > 0 && (
          <View style={styles.teaserRow}>
            <View style={styles.teaserAccent} />
            <Text style={styles.teaserText} numberOfLines={2}>
              {insights[0]}
            </Text>
          </View>
        )}

        {!expanded && (
          <Text style={styles.readMore}>
            Tap for insights & recommendations ↓
          </Text>
        )}

        {/* Expanded content */}
        {expanded && (
          <View style={styles.expandedContent}>
            <View style={[styles.divider, { backgroundColor: DIVIDER }]} />
            <Text style={styles.sectionLabel}>INSIGHTS</Text>
            {insights.map((insight, i) => (
              <View key={i} style={styles.insightRow}>
                <View style={styles.insightAccentBar} />
                <Text style={styles.insightText}>{insight}</Text>
              </View>
            ))}

            <View
              style={[
                styles.divider,
                { backgroundColor: DIVIDER, marginTop: Spacing.md },
              ]}
            />
            <Text style={styles.sectionLabel}>RECOMMENDATIONS</Text>
            {recommendations.map((rec, i) => (
              <View key={i} style={styles.recRow}>
                <View style={styles.recBadge}>
                  <Text style={styles.recBadgeText}>{i + 1}</Text>
                </View>
                <Text style={styles.recText}>{rec}</Text>
              </View>
            ))}
          </View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.lg,
  },
  card: {
    backgroundColor: CARD_BG,
    borderRadius: Radius.xl,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 20,
    elevation: 10,
  },
  accentBar: {
    height: 3,
    backgroundColor: CARD_ACCENT,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    padding: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  iconRing: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: CARD_GLOW,
    borderWidth: 1,
    borderColor: CARD_ACCENT + "44",
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
  },
  eyebrow: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.2,
    color: CARD_ACCENT,
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: Typography.size.base,
    fontWeight: "700",
    color: TEXT_PRIMARY,
    letterSpacing: -0.2,
  },
  summary: {
    fontSize: Typography.size.md,
    fontWeight: "500",
    color: TEXT_PRIMARY,
    lineHeight: 26,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  teaserRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    backgroundColor: CARD_GLOW,
    borderRadius: Radius.md,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: CARD_ACCENT + "22",
  },
  teaserAccent: {
    width: 3,
    borderRadius: 2,
    backgroundColor: CARD_ACCENT,
    alignSelf: "stretch",
    minHeight: 16,
  },
  teaserText: {
    flex: 1,
    fontSize: Typography.size.sm,
    color: TEXT_MUTED,
    lineHeight: 19,
  },
  readMore: {
    fontSize: 11,
    color: TEXT_DIM,
    textAlign: "center",
    paddingBottom: Spacing.md,
    letterSpacing: 0.2,
  },
  expandedContent: {
    paddingBottom: Spacing.md,
  },
  divider: {
    height: 1,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  sectionLabel: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.4,
    color: CARD_ACCENT,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  insightRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  insightAccentBar: {
    width: 3,
    borderRadius: 2,
    backgroundColor: CARD_ACCENT,
    alignSelf: "stretch",
    minHeight: 16,
    marginTop: 2,
  },
  insightText: {
    flex: 1,
    fontSize: Typography.size.sm,
    color: TEXT_MUTED,
    lineHeight: 20,
  },
  recRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  recBadge: {
    width: 22,
    height: 22,
    borderRadius: Radius.full,
    backgroundColor: CARD_ACCENT,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 1,
  },
  recBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: CARD_BG,
  },
  recText: {
    flex: 1,
    fontSize: Typography.size.sm,
    color: TEXT_PRIMARY,
    lineHeight: 20,
  },
});
