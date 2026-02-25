import React, { useEffect, useRef } from "react";
import { Animated, Easing, Text } from "react-native";
import { styles } from "../../styles/login.styles";

interface StatPillProps {
  label: string;
  value: string;
  delay: number;
}

export function StatPill({ label, value, delay }: StatPillProps) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 600,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.statPill,
        {
          opacity: anim,
          transform: [
            {
              translateY: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [12, 0],
              }),
            },
          ],
        },
      ]}
    >
      <Text style={styles.statValue}>{value}</Text>
      <Text style={[styles.statLabel, { opacity: 0.35 }]}>{"\u00b7"}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Animated.View>
  );
}
