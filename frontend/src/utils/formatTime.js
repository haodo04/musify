export const secondsToMinSec = (totalSeconds) => {
  if (!totalSeconds || isNaN(totalSeconds)) {
    return { minute: 0, second: 0 };
  }
  return {
    minute: Math.floor(totalSeconds / 60),
    second: Math.floor(totalSeconds % 60),
  };
};

export const formatTime = (totalSeconds) => {
  if (!totalSeconds || isNaN(totalSeconds)) return "0:00";
  const minute = Math.floor(totalSeconds / 60);
  const second = Math.floor(totalSeconds % 60);
  return `${minute}:${second.toString().padStart(2, "0")}`;
};