import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // This hides the "(auth)/login" text
        contentStyle: { backgroundColor: "white" },
      }}
    />
  );
}
