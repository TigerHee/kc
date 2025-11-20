/**
 *
 * @description 获取queryString字符串转换为JSON对象
 * @param {String} search 可选参数 无是自动获取浏览器后面的queryString
 * @returns {Object}
 * runtime: next/browser
 */
export default function searchToJson(search?: string) {
  // 检查是否在客户端环境
  if (typeof window === 'undefined') {
    console.warn('searchToJson: 此函数只能在客户端执行');
    return {};
  }
  if (!search) {
    search = window.location.search.slice(1);
  }
  const temp: Record<string, string> = {};
  if (search) {
    try {
      const arr = search.split('&');
      Object.keys(arr).forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(arr, key)) {
          const str = arr[key];
          const at = str.indexOf('=');
          const k = str.substring(0, at);
          const v = decodeURIComponent(decodeURI(str.substring(at + 1)));
          temp[k] = v;
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  return temp;
}

export function getUrlSearch() {
  if (typeof window === 'undefined') {
    console.warn('searchToJson: 此函数只能在客户端执行');
    return '';
  }
  return window.location.search || '';
}
