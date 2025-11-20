/**
 * Owner: borden@kupotech.com
 */

export const find = (arr, filterFn) => {
  arr = arr || [];
  const res = arr.filter(filterFn);
  return res[0];
};

export const arrayMap = (arr, mapFn) => {
  arr = arr || [];
  const len = arr.length;
  const res = [];
  for (let i = 0; i < len; i++) {
    const item = mapFn(arr[i], i);
    res.push(item);
  }
  return res;
};

export const forEach = (arr, mapFn) => {
  arr = arr || [];
  const len = arr.length;
  for (let i = 0; i < len; i++) {
    mapFn(arr[i], i);
  }
};

export const reduce = (arr, callback, initializer) => {
  let accumulator = (initializer === undefined) ? 0 : initializer;
  const len = arr.length;
  for (let i = 0; i < len; i++) {
    accumulator = callback(accumulator, arr[i]);
  }
  return accumulator;
};
