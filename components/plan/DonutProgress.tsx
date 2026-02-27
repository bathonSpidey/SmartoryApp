import React from "react";
import { Text, View } from "react-native";

type Props = {
  progress: number;
  accent: string;
};

export default function DonutProgress({ progress, accent }: Props) {
  const size = 48;
  const pct = Math.round(progress * 100);

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 4,
        borderColor: accent + "30",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: accent + "15",
      }}
    >
      <View
        style={{
          position: "absolute",
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 4,
          borderColor: "transparent",
          borderTopColor: pct > 0 ? accent : "transparent",
          borderRightColor: pct > 25 ? accent : "transparent",
          borderBottomColor: pct > 50 ? accent : "transparent",
          borderLeftColor: pct > 75 ? accent : "transparent",
          transform: [{ rotate: "-45deg" }],
        }}
      />
      <Text style={{ fontSize: 11, fontWeight: "800", color: accent }}>
        {pct}%
      </Text>
    </View>
  );
}
