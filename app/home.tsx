import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { useTranslation } from "react-i18next";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import Toast from "react-native-root-toast";
import Slider from "@react-native-community/slider";
import * as Clipboard from "expo-clipboard";
import { router, Stack } from "expo-router";
import { RootSiblingParent } from "react-native-root-siblings";
import AntDesign from "@expo/vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WebView } from "react-native-webview";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";

import { IconRecordButton } from "@/components/IconRecordButton";
import { TextRecordButton } from "@/components/TextRecordButton";
import { RewindButton } from "@/components/RewindButton";
import { FastForwardButton } from "@/components/FastForwardButton";
import { PlayButton } from "@/components/PlayButton";
import { PauseButton } from "@/components/PauseButton";
import { UploadButton } from "@/components/UploadButton";
import { CopyButton } from "@/components/CopyButton";
import { StorageSelectorModal } from "@/components/StorageSelectorModal";
import { getRecordedFilename } from "@/lib/getRecordedFilename";
import { useRecorder } from "@/hooks/useRecorder";
import { useUploader } from "@/hooks/useUploader";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Borders } from "@/constants/Borders";
import { BoxShadow } from "@/constants/BoxShadow";
import { PlayTime } from "@/components/PlayTime";
import { delay } from "@/lib/delay";
import { catcher } from "@/lib/catcher";
import { collectError } from "@/lib/collectError";
import { Config } from "@/constants/Config";

const DEFAULT_GIGAFILE_SERVER = "46.gigafile.nu";

const Home = () => {
  const uploarderViewHeightRatio = 0.95;

  const { t } = useTranslation();
  const [showStorageSelector, setShowStorageSelector] = useState(false);
  const [storage, setStorage] = useState<"gigafile" | "dropbox" | undefined>(
    undefined,
  );

  const gigafileServer = useRef<string>(DEFAULT_GIGAFILE_SERVER);
  const webViewRef = useRef<WebView>(null);
  const insets = useSafeAreaInsets();

  const [uploadFilename, setUploadFilename] = useState<string>("");
  const [uploaderViewSize, setUploaderViewSize] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });
  const uploaderViewRef = useRef<View>(null);
  const uploaderViewPosition = useSharedValue(0);
  const uploaderButtonPosition = useSharedValue(0);

  useLayoutEffect(() => {
    uploaderViewRef.current?.measure((x_, y_, width, height) => {
      setUploaderViewSize({ width, height: height });
      uploaderViewPosition.value =
        -height * uploarderViewHeightRatio + insets.bottom;
      uploaderButtonPosition.value = 0;
    });
  }, [
    setUploaderViewSize,
    uploaderViewPosition,
    uploaderButtonPosition,
    insets.bottom,
  ]);

  useEffect(() => {
    AsyncStorage.getItem("storage").then((value) => {
      if (value === "gigafile" || value === "dropbox") {
        setStorage(value);
      }
    });
  }, []);

  const player = useAudioPlayer();
  const status = useAudioPlayerStatus(player);
  useEffect(() => {
    if (status.didJustFinish) {
      player.pause();
      player.seekTo(0);
    }
  }, [player, status.didJustFinish]);

  const {
    isRecording,
    isProcessing,
    recordedDuration,
    recordedFile,
    startRecording,
    stopRecording,
  } = useRecorder();

  const { isUploading, uploadProgress, uploadedFileUrl, reset, upload } =
    useUploader();

  const uploadButtonAnimation = useAnimatedStyle(() => ({
    left: withSpring(uploaderButtonPosition.value),
  }));

  const copyButtonAnimattion = useAnimatedStyle(() => ({
    left: withSpring(uploaderViewSize.width + uploaderButtonPosition.value),
  }));

  const springConfig = {
    mass: 0.9,
    stiffness: 150,
  };
  const handleOnStart = async () => {
    reset();
    await startRecording();

    uploaderViewPosition.value = withSpring(
      -uploaderViewSize.height * uploarderViewHeightRatio + insets.bottom,
      springConfig,
    );
    uploaderButtonPosition.value = 0;
  };

  const handleOnStop = async () => {
    uploaderViewPosition.value = withSpring(0, springConfig);
    const uri = await stopRecording();
    player.replace(uri);
    setUploadFilename(getRecordedFilename());
  };

  const copyToClipboard = async (url: string) => {
    await Clipboard.setStringAsync(url);

    Toast.show(t("message.copiedUrl"), {
      duration: Toast.durations.SHORT,
    });
  };

  const handleUpload = async () => {
    if (!recordedFile) {
      collectError("No recorded file");
      return;
    }

    const storage = await AsyncStorage.getItem("storage");
    if (!storage) {
      setShowStorageSelector(true);
      return;
    }

    if (storage !== "gigafile" && storage !== "dropbox") {
      throw `Invalid storage value: ${storage}`;
    }

    if (storage === "gigafile") {
      if (webViewRef.current) {
        // Fetch new server URL
        webViewRef.current.reload();
      }
    }

    const result = await upload(
      recordedFile,
      uploadFilename,
      storage === "gigafile"
        ? {
            service: storage,
            server: gigafileServer.current,
          }
        : {
            service: storage,
          },
    );
    if (result.status === "failed") {
      collectError("Failed to upload:", result.error);
      Alert.alert(t("title.error"), t("message.uploadingFailed"));
      return;
    }

    if (result.status === "canceled") {
      return;
    }

    await delay(200);
    uploaderButtonPosition.value = -uploaderViewSize.width;
    await delay(400);
    await copyToClipboard(result.url);
  };

  const handleCopy = async () => {
    if (!uploadedFileUrl) {
      collectError("No uploaded file URL");
      return;
    }
    await copyToClipboard(uploadedFileUrl);
  };

  const handleStorageChange = async (value: string) => {
    if (value !== "gigafile" && value !== "dropbox") {
      throw `Invalid storage value: ${value}`;
    }

    await AsyncStorage.setItem("storage", value);

    setStorage(value);
    setShowStorageSelector(false);

    await handleUpload();
  };

  // react-native-root-toast requires the RootSiblingParent
  return (
    <RootSiblingParent>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: Colors.blue1InIcon }}
        edges={["top", "left", "right"]}
      >
        <Stack.Screen
          options={{
            title: t("title.home"),
            headerRight: () => (
              <Pressable
                accessibilityLabel={t("accessibilityLabel.openSettings")}
                onPressIn={() => {
                  // Workaround for expo/expo#33093 https://github.com/expo/expo/issues/33093
                  // We should get back to the regular `Link` component when the issue is resolved
                  router.navigate("/settings");
                }}
              >
                <AntDesign
                  name="setting"
                  size={Spacing[6]}
                  hitSlop={Spacing[6]}
                  color={Colors.zinc50}
                />
              </Pressable>
            ),
          }}
        />
        <StorageSelectorModal
          visible={showStorageSelector}
          storage={storage}
          onRequestClose={() => {
            setShowStorageSelector(false);
          }}
          onPress={catcher(handleStorageChange)}
        />

        {storage === "gigafile" ? (
          <View
            style={{
              height: 0,
            }}
          >
            <WebView
              ref={webViewRef}
              source={{ uri: "https://gigafile.nu/" }}
              injectedJavaScript={`(() => {
          window.ReactNativeWebView.postMessage(JSON.stringify({ serverUrl: server }));
        })();`}
              onMessage={(message) => {
                const serverUrl = JSON.parse(
                  message.nativeEvent.data,
                ).serverUrl;
                if (serverUrl) {
                  gigafileServer.current = serverUrl;
                }
              }}
            />
          </View>
        ) : null}

        <View
          style={{
            flex: 1,
            paddingTop: Spacing[5],
            gap: Spacing[5],
            alignItems: "center",
          }}
        >
          <View style={{ flex: 0.4 }}>
            <IconRecordButton
              height="100%"
              isRecording={isRecording}
              isProcessing={isProcessing}
              onStop={catcher(handleOnStop)}
              onStart={catcher(handleOnStart)}
            />
          </View>

          <PlayTime
            time={
              recordedFile
                ? {
                    mode: "player",
                    position: status.currentTime * 1000,
                    duration: recordedDuration,
                  }
                : { mode: "recorder", duration: recordedDuration }
            }
          />

          <TextRecordButton
            isRecording={isRecording}
            isProcessing={isProcessing}
            onStop={catcher(handleOnStop)}
            onStart={catcher(handleOnStart)}
          />

          <Animated.View
            ref={uploaderViewRef}
            style={[
              {
                position: "absolute",
                bottom: uploaderViewPosition,
                gap: Spacing[5],
                width: "102%",
                paddingTop: Spacing[6],
                paddingHorizontal: Spacing[6],
                paddingBottom: Spacing[6] + insets.bottom,
                backgroundColor: Colors.blue1InIcon,
                alignItems: "center",
                borderColor: "rgba(0, 0, 0, 0.5)",
              },
              BoxShadow.shadow2Xl,
              Borders.roundedT3Xl,
              Borders.border,
            ]}
          >
            <Text
              testID="upload_file_name"
              style={{
                color: Colors.zinc50,
                opacity: uploadFilename ? 1 : 0,
              }}
            >
              {t("label.filename")}: {uploadFilename}
            </Text>
            <Slider
              style={{
                width: uploaderViewSize.width - Spacing[6] * 2,
                height: Spacing[10],
              }}
              value={(status.currentTime * 1000) / recordedDuration}
              minimumTrackTintColor={Colors.orangeInIcon}
              maximumTrackTintColor={Colors.zinc300}
              onSlidingComplete={(position: number) => {
                player.seekTo(status.duration * position);
              }}
            />
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                gap: Spacing[2.5],
              }}
            >
              <RewindButton
                onPress={() => {
                  const positionMillis =
                    status.currentTime - Config.skipDuration / 1000;
                  player.seekTo(positionMillis);
                }}
              />
              <View style={{ flexGrow: 1 }}>
                {status.playing ? (
                  <PauseButton
                    onPress={() => {
                      player.pause();
                    }}
                  />
                ) : (
                  <PlayButton
                    onPress={() => {
                      player.play();
                    }}
                  />
                )}
              </View>
              <FastForwardButton
                onPress={() => {
                  player.seekTo(
                    status.currentTime + Config.skipDuration / 1000,
                  );
                }}
              />
            </View>
            <View
              style={{
                width: "100%",
                height: Spacing[12],
              }}
            >
              <Animated.View
                style={[
                  {
                    position: "absolute",
                    width: "100%",
                  },
                  uploadButtonAnimation,
                ]}
              >
                <UploadButton
                  disabled={uploadedFileUrl !== null}
                  isUploading={isUploading}
                  progress={uploadProgress}
                  onPress={catcher(handleUpload)}
                />
              </Animated.View>
              <Animated.View
                style={[
                  { position: "absolute", width: "100%" },
                  copyButtonAnimattion,
                ]}
              >
                <CopyButton
                  disabled={uploadedFileUrl === null}
                  onPress={catcher(handleCopy)}
                />
              </Animated.View>
            </View>
          </Animated.View>
        </View>
      </SafeAreaView>
    </RootSiblingParent>
  );
};

export default Home;
