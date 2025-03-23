import RadioGroup from "react-native-radio-buttons-group";
import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";

type Props = {
  storage: "gigafile" | "dropbox" | undefined;
  onPress: (value: string) => void;
};

export const StorageSelector = ({ storage, onPress }: Props) => {
  return (
    <RadioGroup
      labelStyle={[{ color: Colors.blue1InIcon }, Typography.textLg]}
      containerStyle={{ alignItems: "flex-start" }}
      radioButtons={[
        {
          id: "gigafile",
          label: "ギガファイル便",
          value: "gigafile",
          color: Colors.blue1InIcon,
        },
        {
          id: "dropbox",
          label: "Dropbox",
          value: "dropbox",
          color: Colors.blue1InIcon,
        },
      ]}
      onPress={onPress}
      selectedId={storage}
    />
  );
};
