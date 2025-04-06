import { Modal, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Borders } from "@/constants/Borders";
import { BoxShadow } from "@/constants/BoxShadow";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";

import { StorageSelector } from "./StorageSelector";

type Props = {
  visible: boolean;
  storage: "gigafile" | "dropbox" | undefined;
  onPress: (value: string) => void;
  onRequestClose: () => void;
};

export const StorageSelectorModal = ({
  visible,
  storage,
  onRequestClose,
  onPress,
}: Props) => {
  const { t } = useTranslation();

  return (
    // Due to an issue on reanimated, we need to wrap Modal with a View.
    // https://github.com/software-mansion/react-native-reanimated/issues/6659#issuecomment-2704931585
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onRequestClose}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={[
              {
                backgroundColor: Colors.zinc50,
                padding: Spacing[6],
                gap: Spacing[3],
              },
              Borders.roundedLg,
              BoxShadow.shadow2Xl,
            ]}
          >
            <Text style={[{ color: Colors.blue1InIcon }, Typography.textBase]}>
              {t("message.selectStorage")}
            </Text>
            <StorageSelector storage={storage} onPress={onPress} />
          </View>
        </View>
      </Modal>
    </View>
  );
};
