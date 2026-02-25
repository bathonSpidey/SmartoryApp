import { Colors, Radius, ThemeDark, Typography } from "@/constants/Themes";
import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type NavItem = {
  route: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconFocused: keyof typeof Ionicons.glyphMap;
  isScan?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { route: "index", label: "Home", icon: "home-outline", iconFocused: "home" },
  {
    route: "inventory",
    label: "Inventory",
    icon: "cube-outline",
    iconFocused: "cube",
  },
  {
    route: "scan",
    label: "Scan",
    icon: "scan-outline",
    iconFocused: "scan",
    isScan: true,
  },
  {
    route: "reports",
    label: "Reports",
    icon: "bar-chart-outline",
    iconFocused: "bar-chart",
  },
  {
    route: "profile",
    label: "Profile",
    icon: "person-outline",
    iconFocused: "person",
  },
];

export default function Navbar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8) }]}
    >
      {state.routes.map((route, index) => {
        const item = NAV_ITEMS[index];
        if (!item) return null;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        if (item.isScan) {
          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={styles.scanWrapper}
            >
              <View
                style={[
                  styles.scanButton,
                  isFocused && styles.scanButtonActive,
                ]}
              >
                <Ionicons
                  name={isFocused ? item.iconFocused : item.icon}
                  size={26}
                  color={ThemeDark.background}
                />
              </View>
            </Pressable>
          );
        }

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={styles.tab}
            android_ripple={{ color: ThemeDark.primaryGlow, borderless: true }}
          >
            <Ionicons
              name={isFocused ? item.iconFocused : item.icon}
              size={22}
              color={isFocused ? ThemeDark.primary : ThemeDark.textMuted}
            />
            <Text
              style={[
                styles.label,
                { color: isFocused ? ThemeDark.primary : ThemeDark.textDim },
              ]}
            >
              {item.label}
            </Text>
            {isFocused && <View style={styles.activeDot} />}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: ThemeDark.surface,
    borderTopWidth: 1,
    borderTopColor: ThemeDark.border,
    paddingTop: 10,
    ...Platform.select({
      ios: {
        shadowColor: Colors.ink,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
      },
      android: { elevation: 12 },
    }),
  },
  tab: {
    flex: 1,
    alignItems: "center",
    gap: 3,
    paddingTop: 2,
    paddingBottom: 4,
    position: "relative",
  },
  label: {
    fontSize: Typography.size.xs,
    fontWeight: "500",
    letterSpacing: 0.2,
  },
  activeDot: {
    position: "absolute",
    top: -6,
    width: 4,
    height: 4,
    borderRadius: Radius.full,
    backgroundColor: ThemeDark.primary,
  },
  scanWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 4,
  },
  scanButton: {
    width: 56,
    height: 56,
    borderRadius: Radius.full,
    backgroundColor: ThemeDark.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -20,
    shadowColor: ThemeDark.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 8,
  },
  scanButtonActive: {
    backgroundColor: ThemeDark.primaryDim,
  },
});
