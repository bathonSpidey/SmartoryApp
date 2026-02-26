// ─────────────────────────────────────────────
//  PreferenceSwiperCard
//  Shows one randomly-picked preference question
//  per session. The card lives in the home feed
//  and can be swiped left/right to dismiss.
//  Tapping an option records the answer and moves
//  to the next unseen question.
// ─────────────────────────────────────────────

import { Radius, Shadow, Spacing, Typography } from "@/constants/Themes";
import { useTheme } from "@/hooks/useTheme";
import { FlatQuestion } from "@/lib/analysis.service";
import { Ionicons } from "@expo/vector-icons";
import React, { useRef } from "react";
import {
  Animated,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Props = {
  question: FlatQuestion;
  onAnswer: (option: string) => void;
  onDismiss: () => void;
};

const SWIPE_THRESHOLD = 80;

export default function PreferenceSwiperCard({
  question,
  onAnswer,
  onDismiss,
}: Props) {
  const theme = useTheme();
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const flyOut = (direction: "left" | "right", cb: () => void) => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: direction === "right" ? 400 : -400,
        duration: 240,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(cb);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gs) =>
        Math.abs(gs.dx) > 8 && Math.abs(gs.dx) > Math.abs(gs.dy),
      onPanResponderMove: (_, gs) => {
        translateX.setValue(gs.dx);
        // Fade out as you drag
        opacity.setValue(1 - Math.min(Math.abs(gs.dx) / 200, 0.6));
      },
      onPanResponderRelease: (_, gs) => {
        if (Math.abs(gs.dx) > SWIPE_THRESHOLD) {
          flyOut(gs.dx > 0 ? "right" : "left", onDismiss);
        } else {
          // Snap back
          Animated.parallel([
            Animated.spring(translateX, {
              toValue: 0,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 1,
              duration: 150,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    }),
  ).current;

  const handleAnswer = (option: string) => {
    flyOut("right", () => onAnswer(option));
  };

  const handleDismiss = () => {
    flyOut("left", onDismiss);
  };

  return (
    <Animated.View
      style={[styles.wrapper, { transform: [{ translateX }], opacity }]}
      {...panResponder.panHandlers}
    >
      <View
        style={[
          styles.card,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <View
            style={[styles.iconWrap, { backgroundColor: theme.primaryGlow }]}
          >
            <Ionicons
              name="chatbubble-ellipses"
              size={14}
              color={theme.primary}
            />
          </View>
          <Text style={[styles.label, { color: theme.primary }]}>
            Quick question
          </Text>
          {question.context && (
            <View
              style={[
                styles.contextChip,
                { backgroundColor: theme.surfaceInput },
              ]}
            >
              <Text style={[styles.contextText, { color: theme.textMuted }]}>
                {question.context}
              </Text>
            </View>
          )}
          {/* Dismiss */}
          <Pressable
            onPress={handleDismiss}
            style={styles.closeButton}
            hitSlop={8}
          >
            <Ionicons name="close" size={16} color={theme.textDim} />
          </Pressable>
        </View>

        {/* Question */}
        <Text style={[styles.question, { color: theme.text }]}>
          {question.question}
        </Text>

        {/* Options */}
        <View style={styles.optionsRow}>
          {question.options.map((opt) => (
            <Pressable
              key={opt}
              onPress={() => handleAnswer(opt)}
              style={({ pressed }) => [
                styles.optionChip,
                {
                  backgroundColor: pressed
                    ? theme.primaryGlow
                    : theme.surfaceInput,
                  borderColor: pressed ? theme.primary : theme.border,
                },
              ]}
            >
              <Text style={[styles.optionText, { color: theme.text }]}>
                {opt}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Swipe hint */}
        <Text style={[styles.hint, { color: theme.textDim }]}>
          Swipe to skip · tap to answer
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.md,
  },
  card: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    ...Shadow.sm,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  iconWrap: {
    width: 24,
    height: 24,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: Typography.size.xs,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    flex: 1,
  },
  contextChip: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  contextText: {
    fontSize: 10,
    fontWeight: "600",
  },
  closeButton: {
    padding: 2,
  },
  question: {
    fontSize: Typography.size.base,
    fontWeight: "600",
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  optionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  optionChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  optionText: {
    fontSize: Typography.size.sm,
    fontWeight: "500",
  },
  hint: {
    fontSize: 10,
    textAlign: "center",
    marginTop: 2,
  },
});
