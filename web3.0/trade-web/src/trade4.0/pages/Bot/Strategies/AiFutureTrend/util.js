/**
 * Owner: mike@kupotech.com
 */

/**
 * @description: 获取key
 * @param {*} params
 * @return {*}
 */
export const getMinInvestCacheKey = params => {
  const cacheKey = [params.symbol, params.leverage, params.pullBack].join('-');
  return cacheKey;
};
