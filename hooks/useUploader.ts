import { useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Config } from "@/constants/Config";
import { upload as uploadToGigafile } from "@/lib/gigafile/upload";
import { upload as uploadToDropbox } from "@/lib/dropbox/upload";
import { createSharedLinkWithSettings } from "@/lib/dropbox/createSharedLinkWithSettings";

import { useDropboxOAuth } from "./useDropboxOAuth";
import { TokenResponse } from "expo-auth-session";

export type UploadResult =
  | {
      status: "succeeded";
      url: string;
    }
  | {
      status: "canceled";
    }
  | {
      status: "failed";
      error: any;
    };

export const useUploader = () => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const { issueAccessToken } = useDropboxOAuth("home");
  const tokenResponse = useRef<TokenResponse | null>(null);

  const reset = () => {
    setIsUploading(false);
    setUploadProgress(0);
    setUploadedFileUrl(null);
  };

  const gigafileUploadFlow = async (
    fileUri: string,
    uploadedAs: string,
    server: string
  ): Promise<UploadResult> => {
    setIsUploading(true);

    const preserveDuration =
      (await AsyncStorage.getItem("preserveDuration")) ||
      Config.defaultPreserveDuration;

    const result = await uploadToGigafile(
      server,
      fileUri,
      uploadedAs,
      preserveDuration,
      (data) => {
        setUploadProgress(data.totalBytesSent / data.totalBytesExpectedToSend);
      }
    );
    if (!result) {
      return { status: "failed", error: "Failed to upload" };
    }

    return {
      status: "succeeded",
      url: result.url,
    };
  };

  const dropboxUploadFlow = async (
    fileUri: string,
    uploadedAs: string
  ): Promise<UploadResult> => {
    try {
      if (!tokenResponse.current || tokenResponse.current.shouldRefresh()) {
        tokenResponse.current = await issueAccessToken();
        if (!tokenResponse.current) {
          return { status: "canceled" };
        }
      }

      setIsUploading(true);

      const remotePath = `/${uploadedAs}`;

      const uploadResult = await uploadToDropbox(
        fileUri,
        remotePath,
        tokenResponse.current.accessToken,
        (data) => {
          setUploadProgress(
            data.totalBytesSent / data.totalBytesExpectedToSend
          );
        }
      );
      if (!uploadResult) {
        return { status: "failed", error: "Failed to upload" };
      }

      const shareResult = await createSharedLinkWithSettings(
        remotePath,
        tokenResponse.current.accessToken
      );

      return {
        status: "succeeded",
        url: shareResult.url,
      };
    } catch (error) {
      return { status: "failed", error };
    }
  };

  const upload = async (
    file: string,
    uploadedAs: string,
    storage:
      | {
          service: "gigafile";
          server: string;
        }
      | {
          service: "dropbox";
        }
  ): Promise<UploadResult> => {
    const result =
      storage.service === "gigafile"
        ? await gigafileUploadFlow(file, uploadedAs, storage.server)
        : await dropboxUploadFlow(file, uploadedAs);

    if (result.status === "succeeded") {
      setUploadedFileUrl(result.url);
    }

    return result;
  };

  return {
    isUploading,
    uploadProgress,
    uploadedFileUrl,
    reset,
    upload,
  };
};
