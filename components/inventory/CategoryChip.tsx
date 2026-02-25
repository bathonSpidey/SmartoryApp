// ─────────────────────────────────────────────
//  CategoryChip — Pill badge for item categories
//  Tinted with the category's accent colour.
//  Tap to show a fading spend tooltip.
// ─────────────────────────────────────────────

import React, { useCallback, useRef, useState } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import { styles } from "./styles/CategoryChip.styles";
import { getCategoryColor } from "./categoryColors";

type Props = {
  category: string;
  /** Compact = tiny pill, default = normal pill */
  size?: "sm" | "md";
  /** Total spend for this category in the receipt */
  amount?: number;
  /** Currency symbol, e.g. "$" */
  symbol?: string;
};

export function CategoryChip({
  category,
  size = "md",
  amount,
  symbol = "$",
}: Props) {
  const color = getCategoryColor(category);
  const [visible, setVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showTooltip = useCallback(() => {
    if (amount == null) return;
    // Cancel any in-flight hide
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisible(true);
    fadeAnim.setValue(0);
    Animated.sequence([
      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 160,
        useNativeDriver: false,
      }),
      // Hold
      Animated.delay(900),
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: false,
      }),
    ]).start(({ finished }) => {
      if (finished) setVisible(false);
    });
  }, [amount, fadeAnim]);

  return (
    <View style={styles.wrapper}>
      {/* ── Chip pill ── */}
      <Pressable
        onPress={showTooltip}
        style={({ pressed }) => [
          styles.chip,
          size === "sm" && styles.chipSm,
          {
            backgroundColor: color + (pressed ? "30" : "1a"),
            borderColor: color + "44",
          },
        ]}
      >
        <View style={[styles.dot, { backgroundColor: color }]} />
        <Text
          style={[styles.label, size === "sm" && styles.labelSm, { color }]}
          numberOfLines={1}
        >
          {category}
        </Text>

        {/* ── Tooltip overlay (same size as chip, no clipping) ── */}
        {visible && (
          <Animated.View
            style={[
              styles.tooltip,
              { backgroundColor: color, opacity: fadeAnim },
            ]}
          >
            <Text style={styles.tooltipText}>
              {symbol}
              {amount?.toFixed(2)}
            </Text>
          </Animated.View>
        )}
      </Pressable>
    </View>
  );
}
