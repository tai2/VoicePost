import React, { useEffect } from "react";
import { StatusBar } from "react-native";
import { useTranslation } from "react-i18next";
import { Stack, useNavigationContainerRef } from "expo-router";
import * as Sentry from "@sentry/react-native";
import { Colors } from "@/constants/Colors";
import "@/lib/i18n";

const navigationIntegration = Sentry.reactNavigationIntegration({
  // `enableTimeToInitialDisplay` sometimes causes the error below.
  //
  //     Sentry Logger [error]: Failed to receive any fallback timestamp.
  //
  // It bothers me, so I set it to false.
  enableTimeToInitialDisplay: false,
});

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  debug: process.env.NODE_ENV !== "production",
  tracesSampleRate: 1.0,
  integrations: [navigationIntegration],
  enableNativeFramesTracking: true,
});

export default function RootLayout() {
  const { t } = useTranslation();
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
        <Stack.Screen name="home" />
        <Stack.Screen
          name="settings"
          options={{
            title: t("title.settings"),
          }}
        />
      </Stack>
      <StatusBar barStyle="light-content" />
    </>
  );
}
