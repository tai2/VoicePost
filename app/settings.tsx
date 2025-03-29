import { useState, useEffect } from "react";
import { View, Text, Button, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Typography } from "@/constants/Typography";
import { Spacing } from "@/constants/Spacing";
import { Colors } from "@/constants/Colors";
import { Borders } from "@/constants/Borders";
import { useDropboxOAuth } from "@/hooks/useDropboxOAuth";
import { catcher } from "@/lib/catcher";
import { StorageSelector } from "@/components/StorageSelector";

const SectionSpacer = () => <View style={{ height: Spacing[5] }} />;

const SectionHeader = ({ children }: { children: React.ReactNode }) => (
  <Text style={[{ color: Colors.zinc300 }, Typography.textBase]}>
    {children}
  </Text>
);

const Section = ({ children }: { children: React.ReactNode }) => (
  <View
    style={[
      {
        padding: Spacing[2],
        backgroundColor: Colors.zinc50,
      },
      Borders.roundedLg,
    ]}
  >
    {children}
  </View>
);

const Settings = () => {
  const [preserveDuration, setPreserveDuration] = useState<string | undefined>(
    undefined
  );
  const [storage, setStorage] = useState<"gigafile" | "dropbox" | undefined>(
    undefined
  );
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const { issueAccessToken, getRefreshToken, clearRefreshToken } =
    useDropboxOAuth("settings");

  useEffect(() => {
    AsyncStorage.getItem("preserveDuration").then((value) => {
      if (value) {
        setPreserveDuration(value);
      }
    });

    AsyncStorage.getItem("storage").then((value) => {
      if (value === "gigafile" || value === "dropbox") {
        setStorage(value);
      }
    });

    getRefreshToken().then((token) => {
      setIsLoggedIn(token !== null);
    });
  }, [getRefreshToken]);

  const handlePreserveDurationChange = async (value: string) => {
    setPreserveDuration(value);

    await AsyncStorage.setItem("preserveDuration", value);
  };

  const handleStorageChange = async (value: string) => {
    if (value !== "gigafile" && value !== "dropbox") {
      throw `Invalid storage value: ${value}`;
    }

    setStorage(value);

    await AsyncStorage.setItem("storage", value);
  };

  const login = async () => {
    try {
      await issueAccessToken();
    } catch (e) {
      Alert.alert("エラー", "ログインできませんでした");
      throw e;
    }
    setIsLoggedIn((await getRefreshToken()) !== null);
  };

  const logout = async () => {
    await clearRefreshToken();
    setIsLoggedIn(false);
  };

  return (
    <View
      style={{
        padding: Spacing[6],
        backgroundColor: Colors.blue1InIcon,
        height: "100%",
        gap: Spacing[1],
      }}
    >
      <SectionHeader>保存先</SectionHeader>
      <Section>
        <StorageSelector
          storage={storage}
          onPress={catcher(handleStorageChange)}
        />
      </Section>

      <SectionSpacer />

      <SectionHeader>ギガファイル便設定</SectionHeader>
      <Section>
        <Text style={[{ color: Colors.blue1InIcon }, Typography.textXl]}>
          保存期限
        </Text>
        <Picker
          testID="duration_picker"
          itemStyle={{ color: Colors.blue1InIcon }}
          selectedValue={preserveDuration}
          onValueChange={catcher(handlePreserveDurationChange)}
        >
          <Picker.Item label="3日" value="3" />
          <Picker.Item label="5日" value="5" />
          <Picker.Item label="7日" value="7" />
          <Picker.Item label="14日" value="14" />
          <Picker.Item label="30日" value="30" />
          <Picker.Item label="60日" value="60" />
          <Picker.Item label="100日" value="100" />
        </Picker>
      </Section>

      <SectionSpacer />

      <SectionHeader>Dropbox設定</SectionHeader>
      <Section>
        {isLoggedIn ? (
          <Button title="ログアウト" onPress={catcher(logout)} />
        ) : (
          <Button title="ログイン" onPress={catcher(login)} />
        )}
      </Section>
    </View>
  );
};

export default Settings;
