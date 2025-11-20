/**
 * Owner: willen@kupotech.com
 */

const MAX_OVER_TIME = 20 * 1000; // 误差在 20s 内 使用serverTime， 否则使用本地时间

// 传入serverTime ，比较决定使用哪个作为当前时间
export default ({ serverTime = -1, requestedLocalTime = -1 } = {}) => {
  const dateNow = Date.now();
  if (serverTime <= 0 || requestedLocalTime <= 0) return dateNow;
  const duration = dateNow - requestedLocalTime;
  serverTime += duration;

  // serverTime 与dateNow差距不大，使用dateNow
  if (Math.abs(serverTime - dateNow) < MAX_OVER_TIME) {
    return dateNow;
  }
  // serverTime 与dateNow差距过大，使用serverTime
  return serverTime;
};
