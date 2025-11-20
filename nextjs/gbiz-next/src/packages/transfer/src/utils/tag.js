/**
 * Owner: solar@kupotech.com
 */
/**
 *  将tag从BTC-USDT转化为BTC/USDT 一般都是/用来展示 -用于和后端交互
 * @param {string} tag
 */
export function transformTag(tag) {
  return tag.replace(/-/g, '/');
}
