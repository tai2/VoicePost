import { useEffect, useState, useRef } from "react";
import { Text, View, Button } from "react-native";
import { RootSiblingParent } from "react-native-root-siblings";
import Toast from "react-native-root-toast";
import * as Progress from "react-native-progress";
import Slider from "@react-native-community/slider";
import * as Clipboard from "expo-clipboard";
import * as FileSystem from "expo-file-system";
import { Audio } from "expo-av";
import uuid from "react-native-uuid";

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
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const recordingRef = useRef<Audio.Recording | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const [soundPosition, setSoundPosition] = useState<number>(0);
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  async function startRecording() {
    try {
      if (!permissionResponse) {
        throw new Error("Permission response is not ready");
      }

      if (permissionResponse.status !== "granted") {
        console.log("Requesting permission..");
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log("Starting recording..");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      console.log("Recording started");
      recordingRef.current = recording;
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    if (!recordingRef.current) {
      console.error("Recording is not started");
      return;
    }

    console.log("Stopping recording..");

    await recordingRef.current.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recordingRef.current.getURI();
    console.log("Recording stopped and stored at", uri);
  }

  async function playSound() {
    if (!recordingRef.current) {
      console.error("Recording is not started");
      return;
    }

    const uri = recordingRef.current.getURI();
    if (!uri) {
      console.error("Recording is not stored");
      return;
    }

    console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync(
      { uri },
      undefined,
      (status) => {
        if (!status.isLoaded) {
          return;
        }

        if (status.didJustFinish) {
          setIsPlaying(false);
          setSoundPosition(0);
          return;
        }

        if (status.isPlaying && status.durationMillis) {
          setSoundPosition(status.positionMillis / status.durationMillis);
        }
      }
    );

    console.log("Playing Sound");
    await sound.playAsync();
    soundRef.current = sound;
  }

  async function pauseSound() {
    if (!soundRef.current) {
      console.error("Sound is not loaded");
      return;
    }

    await soundRef.current.pauseAsync();
  }

  useEffect(() => {
    if (isRecording) {
      requestAnimationFrame((t) => {
        setRecordedDuration(t - recordingStartedAt.current);
      });
    }
  }, [isRecording, recordedDuration]);

  const copyToClipboard = async (url: string) => {
    await Clipboard.setStringAsync(url);
    Toast.show("URLをクリップボードにコピーしました", {
      duration: Toast.durations.SHORT,
    });
  };

  const uploadToGigafile = async (file: string) => {
    setIsUploading(true);
    const task = FileSystem.createUploadTask(
      "https://46.gigafile.nu/upload_chunk.php",
      file,
      {
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        fieldName: "file",
        parameters: {
          id: uuid.v4(),
          name: "audio.mp3",
          chunk: "0",
          chunks: "1",
          lifetime: "60",
        },
      },
      (data) => {
        console.log("Upload progress", data);
        setUploadProgress(data.totalBytesSent / data.totalBytesExpectedToSend);
      }
    );
    const result = await task.uploadAsync();
    if (result) {
      const body = JSON.parse(result.body);
      setUploadedFileUrl(body.url);
      copyToClipboard(body.url);
    }
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
              stopRecording();
            }}
          />
        ) : (
          <Button
            title="録音"
            accessibilityLabel="録音を開始する"
            onPress={async () => {
              await startRecording();
              setIsRecording(true);
              recordingStartedAt.current = performance.now();
              setRecordedDuration(0);
              setRecordedAudio(null);
              setUploadedFileUrl(null);
              setIsUploading(false);
              setUploadProgress(0);
            }}
          />
        )}

        {isRecording || recordedAudio ? (
          <Text>{formatDuration(recordedDuration)}</Text>
        ) : null}

        {recordedAudio ? (
          <>
            <Slider
              style={{ width: 200, height: 40 }}
              value={soundPosition}
              minimumTrackTintColor="#FFFFFF"
              maximumTrackTintColor="#000000"
            />
            <Button
              title="戻す"
              accessibilityLabel="15秒前に戻す"
              onPress={() => {}}
            />
            {isPlaying ? (
              <Button
                title="停止"
                accessibilityLabel="再生中の音源を停止する"
                onPress={async () => {
                  await pauseSound();
                  setIsPlaying(false);
                }}
              />
            ) : (
              <Button
                title="再生"
                accessibilityLabel="録音した音源を再生する"
                onPress={async () => {
                  setIsPlaying(true);
                  await playSound();
                }}
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
              disabled={uploadedFileUrl !== null}
              onPress={() => {
                const uri = recordingRef.current?.getURI();
                if (!uri) {
                  console.error("Recording is not stored");
                  return;
                }

                uploadToGigafile(uri);
              }}
            />
          </>
        ) : null}

        {isUploading ? (
          <Progress.Circle size={30} progress={uploadProgress} />
        ) : null}

        {uploadedFileUrl ? (
          <Button
            title="コピー"
            accessibilityLabel="アップロードした音源をURLをコピーする"
            onPress={() => {
              copyToClipboard(uploadedFileUrl);
            }}
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
