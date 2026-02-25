// ─────────────────────────────────────────────
//  BotFace — Personality avatar for agent cards
//  Pure View/StyleSheet — no SVG library needed
// ─────────────────────────────────────────────

import React from "react";
import { StyleSheet, View } from "react-native";

type Props = {
  /** Primary accent colour (eyes, mouth, antenna tip) */
  accent: string;
  /** Dimmed/muted colour for inactive state */
  dim: string;
  /** Background fill of the head */
  headBg: string;
  /** Border colour of the head */
  headBorder: string;
  /** Whether the bot is "active" (configured) */
  active: boolean;
  size?: number;
};

export default function BotFace({
  accent,
  dim,
  headBg,
  headBorder,
  active,
  size = 72,
}: Props) {
  const eyeColor = active ? accent : dim;
  const mouthColor = active ? accent : dim;
  const antennaColor = active ? accent : dim;

  const headR = size * 0.18;
  const eyeSize = size * 0.15;
  const pupilSize = size * 0.07;
  const mouthW = size * 0.36;
  const mouthH = size * 0.09;

  return (
    <View style={[styles.wrapper, { width: size, height: size + size * 0.22 }]}>
      {/* ── Antenna ── */}
      <View style={styles.antennaGroup}>
        <View style={[styles.antennaTip, { backgroundColor: antennaColor }]} />
        <View style={[styles.antennaStem, { backgroundColor: antennaColor }]} />
      </View>

      {/* ── Head ── */}
      <View
        style={[
          styles.head,
          {
            width: size,
            height: size,
            borderRadius: headR,
            backgroundColor: headBg,
            borderColor: headBorder,
            borderWidth: active ? 2 : 1.5,
          },
        ]}
      >
        {/* ears */}
        <View
          style={[
            styles.earLeft,
            { backgroundColor: headBorder, height: size * 0.28 },
          ]}
        />
        <View
          style={[
            styles.earRight,
            { backgroundColor: headBorder, height: size * 0.28 },
          ]}
        />

        {/* ── Eyes row ── */}
        <View style={styles.eyeRow}>
          {/* left eye */}
          <View
            style={[
              styles.eye,
              {
                width: eyeSize,
                height: eyeSize,
                borderRadius: eyeSize / 2,
                borderColor: eyeColor,
                backgroundColor: active ? `${eyeColor}22` : "transparent",
              },
            ]}
          >
            {active && (
              <View
                style={[
                  styles.pupil,
                  {
                    width: pupilSize,
                    height: pupilSize,
                    borderRadius: pupilSize / 2,
                    backgroundColor: eyeColor,
                  },
                ]}
              />
            )}
          </View>

          {/* right eye */}
          <View
            style={[
              styles.eye,
              {
                width: eyeSize,
                height: eyeSize,
                borderRadius: eyeSize / 2,
                borderColor: eyeColor,
                backgroundColor: active ? `${eyeColor}22` : "transparent",
              },
            ]}
          >
            {active && (
              <View
                style={[
                  styles.pupil,
                  {
                    width: pupilSize,
                    height: pupilSize,
                    borderRadius: pupilSize / 2,
                    backgroundColor: eyeColor,
                  },
                ]}
              />
            )}
          </View>
        </View>

        {/* ── Mouth ── */}
        <View
          style={[
            styles.mouth,
            {
              width: mouthW,
              height: mouthH,
              borderRadius: mouthH / 2,
              backgroundColor: active ? `${mouthColor}33` : "transparent",
              borderColor: mouthColor,
              borderWidth: 1.5,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: "center" },
  antennaGroup: { alignItems: "center", marginBottom: 2 },
  antennaTip: { width: 7, height: 7, borderRadius: 4, marginBottom: 2 },
  antennaStem: { width: 2.5, height: 10, borderRadius: 2 },
  head: {
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    overflow: "visible",
  },
  earLeft: {
    position: "absolute",
    left: -5,
    width: 5,
    borderRadius: 3,
    top: "35%",
  },
  earRight: {
    position: "absolute",
    right: -5,
    width: 5,
    borderRadius: 3,
    top: "35%",
  },
  eyeRow: { flexDirection: "row", gap: 10, alignItems: "center" },
  eye: { borderWidth: 2, alignItems: "center", justifyContent: "center" },
  pupil: {},
  mouth: { marginTop: -2 },
});
