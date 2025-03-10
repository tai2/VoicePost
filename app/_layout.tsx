import React from "react";
import { Stack } from "expo-router";
import { Colors } from "@/constants/Colors";
import { StatusBar } from "react-native";

export default function RootLayout() {
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
