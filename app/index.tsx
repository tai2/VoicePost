import { useFocusEffect, useRouter } from "expo-router";

// Since Dropbox's OAuth2 doesn't allow empty path (index) as the redirect URI, we need an explicit path for the home
// screen to redirect to. To workaround the issue, we redirect to the home screen from the index screen.
const Index = () => {
  const router = useRouter();

  useFocusEffect(() => {
    router.replace("/home");
  });

  return null;
};

export default Index;
