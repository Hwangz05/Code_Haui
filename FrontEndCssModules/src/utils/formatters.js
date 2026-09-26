export const formatPoints = (points) => {
  return `${Number(points).toLocaleString('vi-VN')} pts`;
};

export const formatTime = (ms) => {
  return `${ms} ms`;
};

export const formatMemory = (mb) => {
  return `${mb} MB`;
};

export const truncateText = (text, maxLength = 80) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};
