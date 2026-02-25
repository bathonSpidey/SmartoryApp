import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

interface IsoCubeProps {
  size?: number;
}

export function IsoCube({ size = 38 }: IsoCubeProps) {
  const mountAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(mountAnim, {
      toValue: 1,
      friction: 5,
      tension: 80,
      delay: 100,
      useNativeDriver: true,
    }).start();
  }, []);

  const f = size / 38;

  return (
    <Animated.View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
        opacity: mountAnim,
        transform: [
          {
            scale: mountAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.4, 1],
            }),
          },
          {
            rotate: mountAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ["-20deg", "0deg"],
            }),
          },
        ],
      }}
    >
      {/* Top face */}
      <View
        style={{
          position: "absolute",
          width: size * 0.6,
          height: size * 0.34,
          backgroundColor: "#5eead4",
          top: size * 0.04,
          left: size * 0.2,
          transform: [{ skewX: "-30deg" }, { scaleY: 0.9 }],
          borderRadius: 2 * f,
        }}
      />
      {/* Left face */}
      <View
        style={{
          position: "absolute",
          width: size * 0.44,
          height: size * 0.52,
          backgroundColor: "#0d9488",
          bottom: size * 0.06,
          left: size * 0.05,
          transform: [{ skewY: "20deg" }],
          borderRadius: 2 * f,
        }}
      />
      {/* Right face */}
      <View
        style={{
          position: "absolute",
          width: size * 0.44,
          height: size * 0.52,
          backgroundColor: "#0a7c72",
          bottom: size * 0.06,
          right: size * 0.05,
          transform: [{ skewY: "-20deg" }],
          borderRadius: 2 * f,
        }}
      />
      {/* Top edge highlight */}
      <View
        style={{
          position: "absolute",
          width: size * 0.5,
          height: 1.5 * f,
          backgroundColor: "#99f6e4",
          top: size * 0.17,
          left: size * 0.25,
          transform: [{ skewX: "-30deg" }],
          opacity: 0.7,
        }}
      />
    </Animated.View>
  );
}
