/**
 * Owner: jacky@kupotech.com
 */

/**
 * 简单的轮询函数，仅迁移业务使用
 * @param {Function} callback - 回调函数
 * @param {number} interval - 轮询间隔时间，单位为毫秒
 * @returns {Function} - 返回一个函数，用于停止轮询
 */
export const polling = (callback, interval = 10 * 1000) => {
  let timer;
  let isStopped = false;

  const poll = async () => {
    if (isStopped) return;

    await callback();

    if (!isStopped) {
      timer = setTimeout(poll, interval);
    }
  };

  poll();

  return () => {
    isStopped = true;
    clearTimeout(timer);
  };
};
