/**
 * Owner: iron@kupotech.com
 */
/* eslint-disable */
/**
 *
 * @description 获取queryString字符串转换为JSON对象
 * @param {String} search 可选参数 无是自动获取浏览器后面的queryString
 * @returns {Object}
 * runtime: next/browser
 */
export function searchToJson(search) {
  if (!search) {
    search = window.location.search.slice(1);
  }
  const temp = {};
  if (search) {
    try {
      const arr = search.split('&');
      for (const key in arr) {
        if (Object.prototype.hasOwnProperty.call(arr, key)) {
          const str = arr[key];
          const at = str.indexOf('=');
          const k = str.substring(0, at);
          const v = decodeURIComponent(decodeURI(str.substring(at + 1)));
          temp[k] = v;
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  return temp;
}
