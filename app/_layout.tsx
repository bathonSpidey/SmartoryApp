import { ThemeProvider } from "@/contexts/ThemeContext";
import { useSession } from "@/hooks/useSession";
import { supabase } from "@/lib/supabase";
import * as Linking from "expo-linking";
import { Stack, useRouter, useSegments } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

WebBrowser.maybeCompleteAuthSession();

// ── OAuth deep link handler ───────────────────
// Catches smartory://auth/callback after Google sign-in
// and hands the tokens to Supabase

function useOAuthDeepLink() {
  useEffect(() => {
    Linking.getInitialURL().then((url) => {
      if (url) handleAuthUrl(url);
    });

    const subscription = Linking.addEventListener("url", ({ url }) => {
      handleAuthUrl(url);
    });

    return () => subscription.remove();
  }, []);
}

async function handleAuthUrl(url: string) {
  if (!url.includes("auth/callback") && !url.includes("access_token")) return;

  try {
    const fragmentIndex = url.indexOf("#");
    const queryIndex = url.indexOf("?");
    const paramsString =
      fragmentIndex !== -1
        ? url.slice(fragmentIndex + 1)
        : url.slice(queryIndex + 1);

    const params = Object.fromEntries(new URLSearchParams(paramsString));

    if (params.access_token && params.refresh_token) {
      await supabase.auth.setSession({
        access_token: params.access_token,
        refresh_token: params.refresh_token,
      });
    }
  } catch (err) {
    console.error("[handleAuthUrl] Failed to set session from deep link:", err);
  }
}

// ── Auth guard ────────────────────────────────
// Replaces your mock isSignedIn logic with real session state

function AuthGuard() {
  const { session, loading } = useSession();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!session && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (session && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [session, loading, segments]);

  return null;
}

// ── Root Layout ───────────────────────────────

export default function RootLayout() {
  const { loading } = useSession();

  useOAuthDeepLink();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#061a18",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator color="#14b8a6" size="large" />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <AuthGuard />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
