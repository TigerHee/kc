/*
 * @Author: garuda@kupotech.com
 * @Date: 2025-09-03 22:34:03
 * @LastEditors: garuda@kupotech.com
 * @LastEditTime: 2025-09-17 20:14:17
 */
/**
 * Owner: garuda@kupotech.com
 * 判断 storage 是否可用
 */
function isStorageValid(type: string) {
  try {
    return (
      typeof window !== 'undefined' &&
      typeof window[type] !== 'undefined' &&
      'setItem' in window[type] &&
      // in IE8 typeof localStorage.setItem === 'object'
      !!window[type].setItem
    );
  } catch (e) {
    return false;
  }
}
export default isStorageValid;
