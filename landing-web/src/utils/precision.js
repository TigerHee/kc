/**
 * Owner: jesse.shao@kupotech.com
 */
/**
 * 缓存币种精度
 * runtime: next/browser
 */
const precisionMap = {};

export default function(coin, precision = null) {
  if (typeof precision !== 'number') {
    return precisionMap[coin];
  }
  precisionMap[coin] = precision;
  return precision;
}

export const all = () => {
  return precisionMap;
};
