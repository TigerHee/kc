/*
 * @owner: borden@kupotech.com
 */
// 判断函数是不是异步函数
function isAsyncFunction(fn) {
  return fn?.constructor?.name === 'AsyncFunction';
}

// 缓存函数
function memoize(func) {
  const cache = new Map();

  return function(...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = func(...args);
    cache.set(key, result);
    return result;
  };
}

// 执行同步或异步函数
export async function execMaybeAsyncFn(fn, ...rest) {
  if (isAsyncFunction(fn)) {
    const ret = await fn(...rest);
    return ret;
  }
  if (typeof fn === 'function') {
    return fn(...rest);
  }
  return null;
}

export const list2map = (list, key, formatItem = (v) => v) =>
  list.reduce((a, b, i) => {
    a[typeof key === 'function' ? key(b) : b[key]] = formatItem(b, i);
    return a;
  }, {});

// 精度转步长
export const precision2step = memoize((precision) => {
  return precision <= 0 ? 1 : `0.${'1'.padStart(precision, '0')}`;
});

// 精度转decimals
export const precision2decimals = memoize((precision) => {
  const decimals = [];
  while (precision > 0) {
    decimals.push({
      length: precision,
      group: 10 ** (10 - precision),
    });
    precision -= 1;
  }
  return decimals;
});

// 步长转精度 num >= 1 时， num<1，（仅限 0.0000...x 这种格式，如 0.01， 0.0005， 0.0000007等）
export const step2precision = memoize((num) => {
  if (num > 1) return 0;
  const decimal = `${num}`.split('.')[1];
  return decimal ? decimal.length : 0;
});

// 检测是否新鲜
export const checkIsStale = (staleTime, updateAt) =>
  staleTime === -1 || Date.now() - updateAt <= staleTime;
