export const generateTrackMarks = (min, max) => {
  if (max < min) {
    return [];
  }

  // 生成一个从 min 到 max 的数组
  return Array.from({length: max - min + 1}, (_, index) => min + index);
};
