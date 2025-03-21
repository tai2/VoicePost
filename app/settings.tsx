import { useState, useEffect } from "react";
import { View, Text, Button } from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Typography } from "@/constants/Typography";
import { Spacing } from "@/constants/Spacing";
import { Colors } from "@/constants/Colors";
import { Borders } from "@/constants/Borders";
import { collectError } from "@/lib/collectError";
import { useDropboxOAuth } from "@/hooks/useDropboxOAuth";
import { catcher } from "@/lib/catcher";

const Settings = () => {
  const [preserveDuration, setPreserveDuration] = useState<string | undefined>(
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

    getRefreshToken().then((token) => {
      setIsLoggedIn(token !== null);
    });
  }, [getRefreshToken]);

  const handlePreserveDurationChange = async (value: string) => {
    setPreserveDuration(value);

    try {
      await AsyncStorage.setItem("preserveDuration", value);
    } catch (e) {
      collectError("Failed to save preserve duration", e);
    }
  };

  const login = async () => {
    await issueAccessToken();
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
        gap: Spacing[5],
      }}
    >
      <Text
        style={[
          { color: Colors.zinc50, textAlign: "center" },
          Typography.textXl,
        ]}
      >
        ギガファイル便
      </Text>
      <View
        style={[
          {
            padding: Spacing[2],
            backgroundColor: Colors.zinc50,
          },
          Borders.roundedLg,
        ]}
      >
        <Text style={[{ color: Colors.blue1InIcon }, Typography.textXl]}>
          保存期限
        </Text>
        <Picker
          testID="duration_picker"
          itemStyle={{ color: Colors.blue1InIcon }}
          selectedValue={preserveDuration}
          onValueChange={handlePreserveDurationChange}
        >
          <Picker.Item label="3日" value="3" />
          <Picker.Item label="5日" value="5" />
          <Picker.Item label="7日" value="7" />
          <Picker.Item label="14日" value="14" />
          <Picker.Item label="30日" value="30" />
          <Picker.Item label="60日" value="60" />
          <Picker.Item label="100日" value="100" />
        </Picker>
      </View>
      <Text
        style={[
          { color: Colors.zinc50, textAlign: "center" },
          Typography.textXl,
        ]}
      >
        Dropbox
      </Text>
      <View
        style={[
          {
            padding: Spacing[2],
            backgroundColor: Colors.zinc50,
          },
          Borders.roundedLg,
        ]}
      >
        {isLoggedIn ? (
          <Button title="ログアウト" onPress={catcher(logout)} />
        ) : (
          <Button title="ログイン" onPress={catcher(login)} />
        )}
      </View>
    </View>
  );
};

export default Settings;
