import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

// ── Glow Orb ──────────────────────────────────
// Three large, blurred, slowly-pulsing radial blobs.
// Far less noisy than particles — reads cleanly on web & mobile.

interface OrbConfig {
  color: string;
  size: number;
  x: string;
  y: string;
  delay: number;
  minOpacity: number;
  maxOpacity: number;
  duration: number;
}

const ORBS: OrbConfig[] = [
  // Primary teal — top-left
  {
    color: "#0d9488",
    size: 480,
    x: "-18%",
    y: "-12%",
    delay: 0,
    minOpacity: 0.13,
    maxOpacity: 0.22,
    duration: 5500,
  },
  // Mid teal — bottom-right
  {
    color: "#14b8a6",
    size: 380,
    x: "55%",
    y: "55%",
    delay: 2000,
    minOpacity: 0.07,
    maxOpacity: 0.15,
    duration: 7000,
  },
  // Deep accent — centre
  {
    color: "#065f59",
    size: 300,
    x: "20%",
    y: "35%",
    delay: 1000,
    minOpacity: 0.06,
    maxOpacity: 0.11,
    duration: 6200,
  },
];

function GlowOrb({
  color,
  size,
  x,
  y,
  delay,
  minOpacity,
  maxOpacity,
  duration,
}: OrbConfig) {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration,
          delay,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        left: x as any,
        top: y as any,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        opacity: pulse.interpolate({
          inputRange: [0, 1],
          outputRange: [minOpacity, maxOpacity],
        }),
        transform: [
          {
            scale: pulse.interpolate({
              inputRange: [0, 1],
              outputRange: [0.85, 1.1],
            }),
          },
        ],
      }}
    />
  );
}

export function AmbientBackground() {
  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {ORBS.map((orb, i) => (
        <GlowOrb key={i} {...orb} />
      ))}
    </View>
  );
}
