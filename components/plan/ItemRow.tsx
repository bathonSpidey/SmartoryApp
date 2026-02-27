import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Pressable,
  Text,
  View,
} from "react-native";
import { styles } from "./styles/ItemRow.styles";
import { OrderItem } from "./types";

type Props = {
  item: OrderItem;
  accent: string;
  toggling?: boolean;
  onToggle: () => void;
};

export default function ItemRow({
  item,
  accent,
  toggling = false,
  onToggle,
}: Props) {
  const theme = useTheme();
  const scale = useRef(new Animated.Value(1)).current;
  const [expanded, setExpanded] = useState(false);

  const handlePress = () => {
    if (toggling) return;
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.92,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 200,
        friction: 10,
      }),
    ]).start();
    onToggle();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={handlePress}
        onLongPress={() => setExpanded((v) => !v)}
        style={[
          styles.itemRow,
          {
            backgroundColor: item.have_ordered ? accent + "12" : theme.surface,
            borderColor: item.have_ordered ? accent + "50" : theme.border,
          },
        ]}
      >
        {/* Checkbox */}
        <View
          style={[
            styles.checkbox,
            {
              borderColor: item.have_ordered ? accent : theme.border,
              backgroundColor: item.have_ordered ? accent : "transparent",
              opacity: toggling ? 0.6 : 1,
            },
          ]}
        >
          {toggling ? (
            <ActivityIndicator
              size="small"
              color={item.have_ordered ? "#fff" : accent}
            />
          ) : (
            item.have_ordered && (
              <Ionicons name="checkmark" size={12} color="#fff" />
            )
          )}
        </View>

        {/* Text block */}
        <View style={styles.textBlock}>
          <Text
            style={[
              styles.itemName,
              {
                color: item.have_ordered ? theme.textMuted : theme.text,
                textDecorationLine: item.have_ordered ? "line-through" : "none",
              },
            ]}
            numberOfLines={expanded ? undefined : 1}
          >
            {item.item}
          </Text>
          {expanded ? (
            <View style={styles.reasonRow}>
              <Ionicons name="sparkles" size={11} color={accent} />
              <Text style={[styles.reasonText, { color: theme.textMuted }]}>
                {item.reason}
              </Text>
            </View>
          ) : (
            <Text style={[styles.tapHint, { color: theme.textDim }]}>
              Hold for AI reason · tap to check
            </Text>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}
