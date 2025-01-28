const text = maestro.copiedText;
const min = parseInt(text.split(":")[0], 10);
const sec = parseInt(text.split(":")[1], 10);
output.time = min * 60 + sec;
