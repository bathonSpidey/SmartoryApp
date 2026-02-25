import { Radius, Spacing, ThemeDark, Typography } from "@/constants/Themes";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ScanScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Scan</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.scanArea}>
          {/* Corner brackets */}
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
          <Ionicons name="scan-outline" size={56} color={ThemeDark.textDim} />
        </View>
        <Text style={styles.hint}>
          Point your camera at a barcode or QR code
        </Text>
        <Text style={styles.subHint}>Barcode scanner coming soon</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: ThemeDark.background,
  },
  header: {
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: ThemeDark.border,
    backgroundColor: ThemeDark.surface,
  },
  title: {
    fontSize: Typography.size.xl,
    fontWeight: "700",
    color: ThemeDark.text,
  },
  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
    paddingHorizontal: Spacing.screenPadding,
  },
  scanArea: {
    width: 220,
    height: 220,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 28,
    height: 28,
    borderColor: ThemeDark.primary,
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: Radius.sm,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: Radius.sm,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: Radius.sm,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: Radius.sm,
  },
  hint: {
    fontSize: Typography.size.sm,
    fontWeight: "600",
    color: ThemeDark.text,
    textAlign: "center",
  },
  subHint: {
    fontSize: Typography.size.xs,
    color: ThemeDark.textMuted,
  },
});
