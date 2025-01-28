import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.blue1InIcon,
        },
        headerTintColor: Colors.zinc50,
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
  );
}
