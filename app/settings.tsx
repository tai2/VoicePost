import { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DEFAULT_PRESERVE_DURATION } from "@/constants/values";

export default function Settings() {
  const [preserveDuration, setPreserveDuration] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    AsyncStorage.getItem("preserveDuration").then((value) => {
      if (value) {
        setPreserveDuration(value);
      }
    });
  }, []);

  const handlePreserveDurationChange = async (value: string) => {
    setPreserveDuration(value);

    try {
      await AsyncStorage.setItem("preserveDuration", value);
    } catch (e) {
      console.error("Failed to save preserve duration", e);
    }
  };

  return (
    <View>
      <Text>ギガファイル便</Text>
      <Text>保存期限</Text>
      <Picker
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
  );
}
