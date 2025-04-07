import { useState, useEffect } from "react";
import { View, Text, Alert } from "react-native";
import { useTranslation } from "react-i18next";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Typography } from "@/constants/Typography";
import { Spacing } from "@/constants/Spacing";
import { Colors } from "@/constants/Colors";
import { Borders } from "@/constants/Borders";
import { useDropboxOAuth } from "@/hooks/useDropboxOAuth";
import { catcher } from "@/lib/catcher";
import { StorageSelector } from "@/components/StorageSelector";
import { TextButton } from "@/components/TextButton";

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
        padding: Spacing[3],
        backgroundColor: Colors.zinc50,
      },
      Borders.roundedLg,
    ]}
  >
    {children}
  </View>
);

const Settings = () => {
  const { t } = useTranslation();
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
      Alert.alert(t("title.error"), t("message.loginFailed"));
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
      <SectionHeader>{t("label.storageSettings")}</SectionHeader>
      <Section>
        <StorageSelector
          storage={storage}
          onPress={catcher(handleStorageChange)}
        />
      </Section>

      <SectionSpacer />

      <SectionHeader>{t("label.gigafileSettings")}</SectionHeader>
      <Section>
        <Text style={[{ color: Colors.blue1InIcon }, Typography.textXl]}>
          {t("label.retentionPeriod")}
        </Text>
        <Picker
          testID="duration_picker"
          itemStyle={{ color: Colors.blue1InIcon }}
          selectedValue={preserveDuration}
          onValueChange={catcher(handlePreserveDurationChange)}
        >
          <Picker.Item label={t("label.3days")} value="3" />
          <Picker.Item label={t("label.5days")} value="5" />
          <Picker.Item label={t("label.7days")} value="7" />
          <Picker.Item label={t("label.14days")} value="14" />
          <Picker.Item label={t("label.30days")} value="30" />
          <Picker.Item label={t("label.60days")} value="60" />
          <Picker.Item label={t("label.100days")} value="100" />
        </Picker>
      </Section>

      <SectionSpacer />

      <SectionHeader>{t("label.dropboxSettings")}</SectionHeader>
      <Section>
        {isLoggedIn ? (
          <TextButton
            accessibilityLabel={t("accessibilityLabel.logout")}
            onPress={catcher(logout)}
          >
            {t("label.logout")}
          </TextButton>
        ) : (
          <TextButton
            accessibilityLabel={t("accessibilityLabel.login")}
            onPress={catcher(login)}
          >
            {t("label.login")}
          </TextButton>
        )}
      </Section>
    </View>
  );
};

export default Settings;
