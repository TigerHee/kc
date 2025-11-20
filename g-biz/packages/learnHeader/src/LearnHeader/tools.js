/**
 * Owner: iron@kupotech.com
 */

// 检测上次操作的时间是否未过期
// 未过期返回true，过期返回false
// 默认5秒过期
const lastPullDataTimestamp = {};
export const checkLastOperateTimestampUnexpired = (key, expireDuration = 5 * 1000) => {
  const select = lastPullDataTimestamp[key] || 0;
  const now = Date.now();
  if (now - select > expireDuration) {
    lastPullDataTimestamp[key] = now;
    return false;
  }
  return true;
};
