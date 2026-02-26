import ExpiryUrgentStrip from "@/components/home/ExpiryUrgentStrip";
import HomeHeader from "@/components/home/HomeHeader";
import NotificationSheet from "@/components/home/NotificationSheet";
import PreferenceSwiperCard from "@/components/home/PreferenceSwiperCard";
import TodaysDigestCard from "@/components/home/TodaysDigestCard";
import { Spacing } from "@/constants/Themes";
import { useAnalysis } from "@/hooks/useAnalysis";
import { useSession } from "@/hooks/useSession";
import { useTheme } from "@/hooks/useTheme";
import React, { useState } from "react";
import { ScrollView, View } from "react-native";

export default function HomeScreen() {
  const { session } = useSession();
  const theme = useTheme();
  const userEmail = session?.user?.email ?? "";

  const {
    analysis,
    urgentItems,
    allAlerts,
    currentQuestion,
    dismissCurrentQuestion,
    answerCurrentQuestion,
  } = useAnalysis();

  const [notifSheetOpen, setNotifSheetOpen] = useState(false);
  const [seenAlertCount, setSeenAlertCount] = useState(0);
  const unseenCount = Math.max(0, allAlerts.length - seenAlertCount);

  function openNotifSheet() {
    setSeenAlertCount(allAlerts.length);
    setNotifSheetOpen(true);
  }

  return (
    <>
      <ScrollView
        style={{ flex: 1, backgroundColor: theme.background }}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: Spacing.xl }}
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader
          userEmail={userEmail}
          notificationCount={unseenCount}
          onNotificationPress={openNotifSheet}
        />

        {/* Urgent expiry strip — only items ≤ 2 days */}
        <ExpiryUrgentStrip urgentItems={urgentItems} />

        {/* AI Digest — summary + insights + recommendations */}
        {analysis && <TodaysDigestCard analysis={analysis} />}

        {/* Preference question card — one per session, swipeable */}
        {currentQuestion && (
          <PreferenceSwiperCard
            question={currentQuestion}
            onAnswer={answerCurrentQuestion}
            onDismiss={dismissCurrentQuestion}
          />
        )}

        <View style={{ height: Spacing.xl }} />
      </ScrollView>

      {/* Notification sheet — all alerts grouped by urgency */}
      <NotificationSheet
        visible={notifSheetOpen}
        alerts={allAlerts}
        onClose={() => setNotifSheetOpen(false)}
      />
    </>
  );
}
