import { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Typography } from "@/constants/Typography";
import { Spacing } from "@/constants/Spacing";
import { Colors } from "@/constants/Colors";
import { Borders } from "@/constants/Borders";

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
    <View style={{ padding: Spacing[6] }}>
      <View
        style={[
          {
            padding: Spacing[2],
            backgroundColor: Colors.zinc50,
          },
          Borders.roundedLg,
        ]}
      >
        <Text style={Typography.textXl}>保存期限</Text>
        <Picker
          testID="duration_picker"
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
    </View>
  );
}
