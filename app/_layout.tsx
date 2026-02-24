import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";

export default function RootLayout() {
  const segments = useSegments();
  const router = useRouter();

  // 1. Add a state to track if the layout is mounted
  const [isReady, setIsReady] = useState(false);

  // Mock authentication state
  const isSignedIn = false;

  useEffect(() => {
    // Set ready on first mount
    setIsReady(true);
  }, []);

  useEffect(() => {
    // 2. Only navigate if the layout is ready
    if (!isReady) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!isSignedIn && !inAuthGroup) {
      router.replace("/login");
    } else if (isSignedIn && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [isSignedIn, segments, isReady]);

  // 3. Render the Stack - this MUST be present for the navigator to mount
  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
