import * as FileSystem from "expo-file-system";
import * as Sentry from "@sentry/react-native";

export const upload = async (
  localPath: string,
  remotePath: string,
  accessToken: string,
  callback: (data: FileSystem.UploadProgressData) => void
): Promise<{ id: string } | null> => {
  const task = FileSystem.createUploadTask(
    "https://content.dropboxapi.com/2/files/upload",
    localPath,
    {
      uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
      headers: {
        "Content-Type": "application/octet-stream",
        Authorization: `Bearer ${accessToken}`,
        "Dropbox-API-Arg": JSON.stringify({
          autorename: false,
          mode: "add",
          mute: false,
          path: remotePath,
          strict_conflict: false,
        }),
      },
    },
    callback
  );

  const result = await task.uploadAsync();
  if (!result) {
    return null;
  }

  try {
    return JSON.parse(result.body);
  } catch {
    Sentry.captureMessage(`Invalid response from dropbox: ${result.body}`);
    return null;
  }
};
