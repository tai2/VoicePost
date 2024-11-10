import { useState } from "react";
import { Text, View, Button } from "react-native";
import { RootSiblingParent } from "react-native-root-siblings";
import Toast from "react-native-root-toast";

export default function Index() {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [recordedFile, setRecordedFile] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const showToast = () => {
    Toast.show("URLをクリップボードにコピーしました", {
      duration: Toast.durations.SHORT,
    });
  };

  return (
    <RootSiblingParent>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          title="設定"
          accessibilityLabel="設定画面を開く"
          onPress={() => {}}
        />

        {isRecording ? (
          <Button
            title="停止"
            accessibilityLabel="録音を停止する"
            onPress={() => {
              setIsRecording(false);
              setRecordedFile("file://path/to/recorded.mp3");
            }}
          />
        ) : (
          <Button
            title="録音"
            accessibilityLabel="録音を開始する"
            onPress={() => {
              setIsRecording(true);
              setRecordedFile(null);
              setUploadedFile(null);
            }}
          />
        )}

        {recordedFile ? (
          <>
            <Button
              title="戻す"
              accessibilityLabel="15秒前に戻す"
              onPress={() => {}}
            />
            {isPlaying ? (
              <Button
                title="停止"
                accessibilityLabel="再生中の音源を停止する"
                onPress={() => setIsPlaying(false)}
              />
            ) : (
              <Button
                title="再生"
                accessibilityLabel="録音した音源を再生する"
                onPress={() => setIsPlaying(true)}
              />
            )}
            <Button
              title="進める"
              accessibilityLabel="15秒先に進める"
              onPress={() => {}}
            />
            <Button
              title="アップロード"
              accessibilityLabel="録音した音源をアップロードする"
              onPress={() => {
                setUploadedFile("https://example.com/recorded.mp3");
                showToast();
              }}
            />
          </>
        ) : null}

        {uploadedFile ? (
          <Button
            title="コピー"
            accessibilityLabel="アップロードした音源をURLをコピーする"
            onPress={() => showToast()}
          />
        ) : null}
      </View>
    </RootSiblingParent>
  );
}
