export const getRecordedFilename = (now?: Date) => {
  if (!now) {
    now = new Date();
  }
  const year = now.getFullYear().toString().padStart(4, "0");
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const date = now.getDate().toString().padStart(2, "0");
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");

  return `recording_${year}${month}${date}_${hours}${minutes}${seconds}.mp3`;
};
