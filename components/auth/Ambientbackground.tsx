import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

// ── Types ─────────────────────────────────────

type ParticleShape = "box" | "circle" | "line";

interface ParticleConfig {
  size: number;
  startX: string;
  startY: string;
  delay: number;
  shape: ParticleShape;
}

// ── Particle configs ──────────────────────────
// Edit this array to add/remove/reposition particles

export const PARTICLE_CONFIG: ParticleConfig[] = [
  { size: 14, startX: "8%", startY: "12%", delay: 0, shape: "box" },
  { size: 6, startX: "22%", startY: "28%", delay: 500, shape: "circle" },
  { size: 20, startX: "75%", startY: "9%", delay: 200, shape: "box" },
  { size: 4, startX: "88%", startY: "22%", delay: 800, shape: "circle" },
  { size: 10, startX: "60%", startY: "18%", delay: 1100, shape: "line" },
  { size: 8, startX: "15%", startY: "72%", delay: 300, shape: "box" },
  { size: 5, startX: "82%", startY: "65%", delay: 700, shape: "circle" },
  { size: 16, startX: "45%", startY: "80%", delay: 1400, shape: "line" },
  { size: 7, startX: "35%", startY: "15%", delay: 600, shape: "circle" },
  { size: 12, startX: "92%", startY: "45%", delay: 900, shape: "box" },
];

// ── Single Particle ───────────────────────────

function Particle({ size, startX, startY, delay, shape }: ParticleConfig) {
  const floatY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0.35,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(floatY, {
            toValue: -28,
            duration: 4000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(rotate, {
            toValue: 1,
            duration: 4000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0.12,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(floatY, {
            toValue: 0,
            duration: 4000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(rotate, {
            toValue: 0,
            duration: 4000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "25deg"],
  });

  return (
    <Animated.View
      style={{
        position: "absolute",
        left: startX as any,
        top: startY as any,
        opacity,
        transform: [{ translateY: floatY }, { rotate: spin }],
      }}
    >
      {shape === "box" && (
        <View
          style={{
            width: size,
            height: size,
            borderWidth: 1.5,
            borderColor: "#14b8a6",
            borderRadius: 3,
          }}
        />
      )}
      {shape === "circle" && (
        <View
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: "#14b8a6",
          }}
        />
      )}
      {shape === "line" && (
        <View
          style={{
            width: size * 2.5,
            height: 1.5,
            backgroundColor: "#14b8a6",
            borderRadius: 2,
          }}
        />
      )}
    </Animated.View>
  );
}

// ── Ambient Layer (renders all particles + overlay) ──

export function AmbientBackground() {
  return (
    <>
      {PARTICLE_CONFIG.map((p, i) => (
        <Particle key={i} {...p} />
      ))}
      {/* Subtle grid overlay */}
      <View
        style={{ ...StyleSheet.absoluteFillObject, opacity: 0.04 }}
        pointerEvents="none"
      />
    </>
  );
}
