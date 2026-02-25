import React, { useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";

interface GoogleSignInButtonProps {
  onPress: () => void;
  loading?: boolean;
}

export function GoogleSignInButton({
  onPress,
  loading = false,
}: GoogleSignInButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () =>
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();

  const handlePressOut = () =>
    Animated.spring(scale, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      disabled={loading}
    >
      <Animated.View
        style={[
          s.button,
          { transform: [{ scale }], opacity: loading ? 0.6 : 1 },
        ]}
      >
        {/* Google "G" logo built from Views — no image needed */}
        <View style={s.gLogo}>
          <Text style={s.gText}>G</Text>
        </View>
        <Text style={s.label}>
          {loading ? "Connecting…" : "Continue with Google"}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#14b8a630",
    backgroundColor: "#0c2825",
    gap: 10,
  },
  gLogo: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  gText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#4285F4", // Google blue
    letterSpacing: -0.3,
  },
  label: {
    color: "#e2f4f2",
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: -0.2,
  },
});
