/**
 * Owner: hanx.wei@kupotech.com
 */
// 性能优化相关
/**
 * 并发处理
 * max 最多同时请求数量，默认10
 * @template T
 * @param {T[]} list
 * @param { (T) => Promise<any> } callback
 * @param {{ max?: number }} config max 最多同时请求数量，默认10
 */
async function concurrencyHandle(list, callback, config) {
  const { max: maxLimit = 10 } = config || {};
  // const maxLength = list.length - 1;
  const maxLength = list.length;
  const limit = Math.min(maxLimit, maxLength);
  let next = limit;
  let remain = limit;
  /**
   * 递归执行方法
   * @param {number} i
   * @param { resolve: (value: any) => void} resolve
   */
  const execHandle = (i, resolve) => {
    callback(list[i]).finally(() => {
      if (next >= maxLength) {
        remain--;
        if (remain <= 0) {
          resolve();
        }
        return;
      }
      execHandle(next, resolve);
      next++;
    });
  };

  return new Promise(resolve => {
    // 初始化并发处理
    for (let i = 0; i < limit; i++) {
      execHandle(i, resolve);
    }
  }).catch(err => {
    console.error(err);
  });
}

module.exports = concurrencyHandle;
