/*
 * @owner: borden@kupotech.com
 */
// 默认断点
export const defaultBreakPoints = [768, 1024];

const defaultMin = -1;
const defaultMax = 1000000;
const defaultBreakPointsStrs = ['sm', 'md', 'lg'];

// 断点匹配
export const breakPointMatch = ({
  min = defaultMin,
  max = defaultMax,
  v,
  index,
  isCustomKey,
}) => {
  const defaultStr =
    index <= 2 ? defaultBreakPointsStrs[index] : `lg${index - 2}`;
  // 完整区间
  if (min <= v && v < max) {
    // min没取到，用的默认的（断点便利第一次）
    if (min === defaultMin) {
      return isCustomKey ? `${max}` : defaultStr;
      // max没取到，用的默认的（断点便利最后）
    } else if (max === defaultMax) {
      return isCustomKey ? `${min}` : defaultStr;
      // 区间内
    } else {
      return isCustomKey ? `${min}-${max}` : defaultStr;
    }
  }
};
