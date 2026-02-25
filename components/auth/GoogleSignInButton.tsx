import React, { useRef } from "react";
import { Animated, Platform, Pressable, StyleSheet, Text, View } from "react-native";

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
        {/* Google "G" — no image dependency */}
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
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#14b8a625",
    backgroundColor: "#071c1a",
    gap: 10,
    ...(Platform.OS === "web" ? ({ cursor: "pointer" } as any) : {}),
  },
  gLogo: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  gText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#4285F4",
    letterSpacing: -0.2,
  },
  label: {
    color: "#dff0ed",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: -0.1,
  },
});
