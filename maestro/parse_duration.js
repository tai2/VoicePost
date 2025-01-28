const durationText = maestro.copiedText;
const min = parseInt(durationText.split(":")[0], 10);
const sec = parseInt(durationText.split(":")[1], 10);
output.duration = min * 60 + sec;
