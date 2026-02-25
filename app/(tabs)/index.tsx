import HomeHeader from "@/components/home/HomeHeader";
import QuickActions from "@/components/home/QuickActions";
import RecentActivity from "@/components/home/RecentActivity";
import StatsRow from "@/components/home/StatsRow";
import { ThemeDark } from "@/constants/Themes";
import { useSession } from "@/hooks/useSession";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";

export default function HomeScreen() {
  const { session } = useSession();
  const userEmail = session?.user?.email ?? "";

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <HomeHeader userEmail={userEmail} notificationCount={3} />
      <StatsRow />
      <QuickActions />
      <RecentActivity />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: ThemeDark.background,
  },
  content: {
    flexGrow: 1,
  },
});
