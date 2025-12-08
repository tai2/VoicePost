import { Colors } from "@/constants/Colors";
import { useFocusEffect, useRouter } from "expo-router";
import { View } from "react-native";

// Since Dropbox's OAuth2 doesn't allow empty path (index) as the redirect URI, we need an explicit path for the home
// screen to redirect to. To workaround the issue, we redirect to the home screen from the index screen.
const Index = () => {
  const router = useRouter();

  useFocusEffect(() => {
    router.replace("/home");
  });

  return <View style={{ flex: 1, backgroundColor: Colors.blue1InIcon }} />;
};

export default Index;
