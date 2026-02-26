import Navbar from "@/components/navigation/Navbar";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <Navbar {...props} />}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="inventory" />
      <Tabs.Screen name="reports" />
      <Tabs.Screen name="scan" />
      <Tabs.Screen name="agents" />
      <Tabs.Screen name="preferences" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
