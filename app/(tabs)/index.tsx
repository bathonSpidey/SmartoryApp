import HomeHeader from "@/components/home/HomeHeader";
import QuickActions from "@/components/home/QuickActions";
import RecentActivity from "@/components/home/RecentActivity";
import StatsRow from "@/components/home/StatsRow";
import { useSession } from "@/hooks/useSession";
import { useTheme } from "@/hooks/useTheme";
import React from "react";
import { ScrollView } from "react-native";

export default function HomeScreen() {
  const { session } = useSession();
  const theme = useTheme();
  const userEmail = session?.user?.email ?? "";

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <HomeHeader userEmail={userEmail} notificationCount={3} />
      <StatsRow />
      <QuickActions />
      <RecentActivity />
    </ScrollView>
  );
}
