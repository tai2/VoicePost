import * as FileSystem from "expo-file-system";
import * as Sentry from "@sentry/react-native";

export const upload = async (
  localPath: string,
  remotePath: string,
  accessToken: string,
  callback: (data: FileSystem.UploadProgressData) => void
): Promise<{ id: string } | null> => {
  const receivedData = new Set();
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
    (data: FileSystem.UploadProgressData) => {
      // createUploadTask sometimes calls duplicate data on Android like these:
      //
      // {totalBytesExpectedToSend: 74842, totalBytesSent: 8192}
      // {totalBytesExpectedToSend: 74842, totalBytesSent: 74842}
      // {totalBytesExpectedToSend: 74842, totalBytesSent: 8192}
      // {totalBytesExpectedToSend: 74842, totalBytesSent: 74842}
      //
      // So we need to filter out duplicate data.
      if (receivedData.has(data.totalBytesSent)) {
        return;
      }
      receivedData.add(data.totalBytesSent);
      callback(data);
    }
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
