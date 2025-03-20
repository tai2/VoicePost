import React, { useEffect } from "react";
import { Stack, useNavigationContainerRef } from "expo-router";
import * as Sentry from "@sentry/react-native";
import { Colors } from "@/constants/Colors";
import { StatusBar } from "react-native";
import { isRunningInExpoGo } from "expo";

const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: !isRunningInExpoGo(),
});

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  debug: process.env.NODE_ENV !== "production",
  tracesSampleRate: 1.0,
  integrations: [navigationIntegration],
  enableNativeFramesTracking: !isRunningInExpoGo(),
});

export default function RootLayout() {
  const ref = useNavigationContainerRef();
  useEffect(() => {
    if (ref?.current) {
      navigationIntegration.registerNavigationContainer(ref);
    }
  }, [ref]);

  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.blue1InIcon,
          },
          headerTintColor: Colors.zinc50,
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen
          name="settings"
          options={{
            title: "設定",
          }}
        />
      </Stack>
      <StatusBar barStyle="light-content" />
    </>
  );
}
