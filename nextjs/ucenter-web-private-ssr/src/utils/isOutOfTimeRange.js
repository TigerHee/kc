/**
 * Owner: willen@kupotech.com
 */
export default function isOutOfTimeRange(time, rangeList = []) {
  if (time < 1) return true;
  const [start, end] = rangeList || [];
  if (!start || !end) return true;
  return time < start || time > end;
}
