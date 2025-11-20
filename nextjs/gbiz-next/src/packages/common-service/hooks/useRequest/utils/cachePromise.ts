/*
 * @owner: borden@kupotech.com
 */
const cachePromise: any = new Map();

const getCachePromise = (cacheKey: any): any => {
  return cachePromise.get(cacheKey);
};

const setCachePromise = (cacheKey: any, promise: any): void => {
  cachePromise.set(cacheKey, promise);
  promise
    .then((res: any) => {
      cachePromise.delete(cacheKey);
      return res;
    })
    .catch(() => {
      cachePromise.delete(cacheKey);
    });
};

export { getCachePromise, setCachePromise };
