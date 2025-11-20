
/**
 * 最小时间精度, 6ms
 */
const MIN_PRECISION = 6;

/**
 * 获取当前时间
 * 优先使用 performance.now(从页面打开时间计算), 否则使用 Date.now(从 1970-01-01 00:00:00 UTC 计算)
 */
const getNow = typeof performance === 'object' ? () => performance.now() : () => Date.now();

/**
 * 精确计时器, 减少定时器误差
 * 注意: 本方法只能减少误差, 无法完全消除
 * 思路: 另开一个 timer 在更短的时间范围内检查时间差, 当时间差超过阈值时, 重新计时; 定时器到时时, 重新检查时间差, 防止提前触发
 * 以下场景可能导致定时器误差:
 * * 页面退到后台, alert/confirm 等原生modal, 定时器会被暂停
 * * 在特定场景下, 定时器可能会提前触发(修正后会导致方法实际上可能晚于预期时间触发, 10ms 以内)
 * @param fn 回调函数
 * @param timeout 超时时间
 * @param precision 时间精度要求, 默认 100ms
 */
export function preciseTimer(fn: () => void, timeout: number, precision = 100) {
  const timePrecision = Math.max(precision, MIN_PRECISION);
  let last = getNow();
  // 期望触发的时间节点
  const desired = last + timeout;

  let timer: NodeJS.Timeout, checkTimer: NodeJS.Timeout;
  const clear = () => {
    clearTimeout(timer);
    clearTimeout(checkTimer);
  }
  const callback = () => {
    const now = getNow();
    // 未到时间, 继续等待, 定时器可能提前触发
    if (now < desired) {
      timer = setTimeout(callback, desired - now);
      return;
    }
    clear();
    fn();
  }

  timer = setTimeout(callback, timeout);
  const check = () => {
    // 每过 1/10 时间, 检查一次时间误差
    const checkTime = Math.ceil(Math.max((desired - getNow()) / 10, timePrecision));
    checkTimer = setTimeout(() => {
      const now = getNow();
      if (now >= desired) {
        callback();
        return;
      }
      // 时间差超过阈值, 重新计时
      if (now - last > timePrecision) {
        clearTimeout(timer);
        timer = setTimeout(callback, desired - now);
      }
      last = now;
      // 继续下一轮检查
      check();
    }, checkTime);
  };

  check();

  return clear;
}
