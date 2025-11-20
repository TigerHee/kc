/**
 * Owner: willen@kupotech.com
 */
/**
 * @param {*} callback function
 * @param {*} ts ms
 */
const throttleDataHoc = (callback, ts = 0) => {
  if (typeof callback !== 'function') {
    throw new Error('throttleDataHoc callback must be a function');
  }

  let last = 0;
  let cache = [];
  let timer = null;

  const outcall = (now) => {
    last = now;

    if (timer) {
      clearTimeout(timer);
      timer = null;
    }

    const out = cache;
    cache = [];
    callback(out);
  };

  return (data) => {
    cache.push(data);

    const now = Date.now();
    if (now - last > ts) {
      outcall(now);
    } else {
      // timeout
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        const n = Date.now();
        outcall(n);
      }, ts);
    }
  };
};

export default throttleDataHoc;
