import { useEffect, useState, useRef } from "react";
import { Text, View, Button } from "react-native";
import { RootSiblingParent } from "react-native-root-siblings";
import Toast from "react-native-root-toast";

type RecordedAudio = {
  file: string;
  fileSize: number;
};

export default function Index() {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const recordingStartedAt = useRef<number>(0);
  const [recordedDuration, setRecordedDuration] = useState<number>(0);
  const [recordedAudio, setRecordedAudio] = useState<RecordedAudio | null>(
    null
  );
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  useEffect(() => {
    if (isRecording) {
      requestAnimationFrame((t) => {
        setRecordedDuration(t - recordingStartedAt.current);
      });
    }
  }, [isRecording, recordedDuration]);

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
              setRecordedAudio({
                file: "file://path/to/recorded.mp3",
                fileSize: 1024 * 100,
              });
            }}
          />
        ) : (
          <Button
            title="録音"
            accessibilityLabel="録音を開始する"
            onPress={() => {
              console.log("Play");
              setIsRecording(true);
              recordingStartedAt.current = performance.now();
              setRecordedDuration(0);
              setRecordedAudio(null);
              setUploadedFile(null);
            }}
          />
        )}

        {isRecording || recordedAudio ? (
          <Text>{formatDuration(recordedDuration)}</Text>
        ) : null}

        {recordedAudio ? (
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
              disabled={uploadedFile !== null}
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

const formatDuration = (duration: number): string => {
  const durationSeconds = duration / 1000;
  const minutes = Math.floor(durationSeconds / 60);
  const seconds = Math.floor(durationSeconds % 60);
  const belowSeconds = Math.floor((duration % 1000) / 10);
  return `${pad2(minutes)}:${pad2(seconds)}.${pad2(belowSeconds)}`;
};

const pad2 = (n: number): string => n.toString().padStart(2, "0");
