import { useState } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as Crypto from "expo-crypto";
import * as Sentry from "@sentry/react-native";

import { Config } from "@/constants/Config";
import { collectError } from "@/lib/collectError";

export const useUploader = () => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);

  const reset = () => {
    setIsUploading(false);
    setUploadProgress(0);
    setUploadedFileUrl(null);
  };

  const upload = async (
    file: string,
    uploadedAs: string
  ): Promise<string | null> => {
    setIsUploading(true);

    const preserveDuration =
      (await AsyncStorage.getItem("preserveDuration")) ||
      Config.defaultPreserveDuration;

    const task = FileSystem.createUploadTask(
      "https://46.gigafile.nu/upload_chunk.php",
      file,
      {
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        fieldName: "file",
        parameters: {
          id: Crypto.randomUUID(),
          name: uploadedAs,
          chunk: "0",
          chunks: "1",
          lifetime: preserveDuration,
        },
      },
      (data) => {
        setUploadProgress(data.totalBytesSent / data.totalBytesExpectedToSend);
      }
    );
    const result = await task.uploadAsync();
    if (!result) {
      Alert.alert("エラー", "アップロードに失敗しました");
      return null;
    }

    let url: string;
    try {
      url = JSON.parse(result.body).url || null;
    } catch (e) {
      Sentry.captureMessage(`Response from gigafile.nu: ${result.body}`);
      collectError(`Failed to parse the response`, e);
      Alert.alert("エラー", "アップロードに失敗しました");
      return null;
    }

    setUploadedFileUrl(url);

    return url;
  };

  return {
    isUploading,
    uploadProgress,
    uploadedFileUrl,
    reset,
    upload,
  };
};
